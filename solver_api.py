# solver_api.py
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Optional
from ortools.sat.python import cp_model

app = FastAPI()


class Faculty(BaseModel):
    id: str
    name: str
    min_hours_per_week: Optional[int] = 0
    max_hours_per_week: Optional[int] = 1000
    unavailable: Optional[List[List[int]]] = []  # [[day, period], ...]


class Classroom(BaseModel):
    id: str
    name: str


class ClassRequirement(BaseModel):
    id: str
    faculty: str
    subject: str
    section: str
    class_type: str = "Theory"
    duration: Optional[int] = 1
    allowed_rooms: Optional[List[str]] = None
    allowed_days: Optional[List[int]] = None
    forbidden_periods: Optional[List[int]] = None


class TimetableRequest(BaseModel):
    days: List[int]
    periods: List[int]
    period_times: Dict[int, List[str]]
    faculties: List[Faculty]
    classrooms: List[Classroom]
    class_requirements: List[ClassRequirement]
    max_time_seconds: Optional[int] = 30
    max_nodes: Optional[int] = None


@app.post("/generate_timetable")
def generate_timetable(data: TimetableRequest):
    try:
        model = cp_model.CpModel()
        solver = cp_model.CpSolver()

        DAYS = data.days
        PERIODS = data.periods
        classroom_ids = [c.id for c in data.classrooms]

        # Decision variables: (req_id, day, start_period, room)
        y = {}
        for req in data.class_requirements:
            duration = req.duration or 1
            allowed_rooms = req.allowed_rooms or classroom_ids
            allowed_days = req.allowed_days or DAYS
            forbidden_periods = set(req.forbidden_periods or [])

            # Only allow start periods that fit within schedule
            valid_start_periods = [sp for sp in PERIODS if sp + duration - 1 <= max(PERIODS)]
            for d in allowed_days:
                for sp in valid_start_periods:
                    occupied = set(range(sp, sp + duration))
                    if forbidden_periods.intersection(occupied):
                        continue
                    for room in allowed_rooms:
                        key = (req.id, d, sp, room)
                        y[key] = model.NewBoolVar(f"x_{req.id}_{d}_{sp}_{room}")

        # 1) Each class requirement scheduled exactly once
        for req in data.class_requirements:
            vars_req = [v for k, v in y.items() if k[0] == req.id]
            if vars_req:
                model.Add(sum(vars_req) == 1)
            else:
                return {"error": f"No feasible placement for {req.id}", "scheduled": [], "status": "ERROR"}

        # 2) Room conflict: one class per room per period
        for d in DAYS:
            for p in PERIODS:
                for room in classroom_ids:
                    occupying = []
                    for (req_id, dd, sp, r), var in y.items():
                        if dd != d or r != room:
                            continue
                        req = next(rq for rq in data.class_requirements if rq.id == req_id)
                        duration = req.duration or 1
                        if sp <= p <= sp + duration - 1:
                            occupying.append(var)
                    if occupying:
                        model.Add(sum(occupying) <= 1)

        # 3) Faculty constraints
        for fac in data.faculties:
            # Only one class per period
            for d in DAYS:
                for p in PERIODS:
                    fac_vars = []
                    for (req_id, dd, sp, room), var in y.items():
                        req = next(rq for rq in data.class_requirements if rq.id == req_id)
                        if req.faculty != fac.id or dd != d:
                            continue
                        duration = req.duration or 1
                        if sp <= p <= sp + duration - 1:
                            fac_vars.append(var)
                    if fac_vars:
                        model.Add(sum(fac_vars) <= 1)
            # Min/Max hours
            fac_vars, fac_coeffs = [], []
            for (req_id, d, sp, room), var in y.items():
                req = next(rq for rq in data.class_requirements if rq.id == req_id)
                if req.faculty != fac.id:
                    continue
                fac_vars.append(var)
                fac_coeffs.append(req.duration or 1)
            if fac_vars:
                model.Add(sum(v * c for v, c in zip(fac_vars, fac_coeffs)) >= fac.min_hours_per_week)
                model.Add(sum(v * c for v, c in zip(fac_vars, fac_coeffs)) <= fac.max_hours_per_week)
            # Unavailable periods
            for (uday, uperiod) in fac.unavailable:
                for (req_id, d, sp, room), var in y.items():
                    if d == uday:
                        req = next(rq for rq in data.class_requirements if rq.id == req_id)
                        duration = req.duration or 1
                        if req.faculty == fac.id and sp <= uperiod <= sp + duration - 1:
                            model.Add(var == 0)

        # Solve
        solver.parameters.max_time_in_seconds = float(data.max_time_seconds or 30)
        if data.max_nodes:
            solver.parameters.max_number_of_nodes = int(data.max_nodes)
        status = solver.Solve(model)

        scheduled = []
        if status in [cp_model.OPTIMAL, cp_model.FEASIBLE]:
            for (req_id, d, sp, room), var in y.items():
                if solver.Value(var):
                    req = next(rq for rq in data.class_requirements if rq.id == req_id)
                    duration = req.duration or 1
                    for p in range(sp, sp + duration):
                        # Get the correct time for this period
                        if p in data.period_times:
                            start_time = data.period_times[p][0]
                            end_time = data.period_times[p][1]
                        else:
                            # Fallback if period not found
                            start_time = "N/A"
                            end_time = "N/A"
                        
                        scheduled.append({
                            "req_id": req_id,
                            "day": d,
                            "period": p,
                            "start_time": start_time,
                            "end_time": end_time,
                            "faculty": req.faculty,
                            "section": req.section,
                            "subject": req.subject,
                            "class_type": req.class_type,
                            "classroom": room,
                            "duration": duration,
                            "start_period_of_block": sp
                        })
        else:
            return {"scheduled": [], "status": "INFEASIBLE", "message": "No feasible solution found"}

        return {"scheduled": scheduled, "status": "FEASIBLE"}

    except Exception as e:
        return {"error": str(e), "scheduled": [], "status": "ERROR"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)