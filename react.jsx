import React, { useState } from 'react';

export default function Timetable() {
  const [scheduled, setScheduled] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState('');

  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const periods = [1,2,3,4,5,6,7,8,9,10]; // Added more periods to accommodate breaks

  const generateTimetable = async () => {
    setLoading(true);
    try {
      const requestData = {
        days: [1,2,3,4,5,6],
        periods,
        period_times: {
          1:["09:00","09:50"],2:["09:50","10:40"],3:["10:40","11:30"],4:["11:30","12:20"],
          5:["12:20","1:10"],6:["1:10","2:00"],7:["2:00","2:50"],8:["2:50","3:40"],
          9:["3:40","4:30"],10:["4:30","5:20"]
        },
        break_periods: [4], // Break after period 4 (lunch only)
        faculties: [
          {id:"F1",name:"Alice"},{id:"F2",name:"Bob"},{id:"F3",name:"Charlie"},
          {id:"F4",name:"David"},{id:"F5",name:"Eve"},{id:"F6",name:"Frank"}
        ],
        classrooms: [
          {id:"R1",name:"Room 101"},{id:"R2",name:"Room 102"},{id:"R3",name:"Lab 201"},
          {id:"R4",name:"Room 103"},{id:"R5",name:"Lab 202"}
        ],
        class_requirements: [
          // Section A - Theory classes (3 per subject per week)
          {id:"A_Math_1",faculty:"F1",subject:"Math",section:"A",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"A_Math_2",faculty:"F1",subject:"Math",section:"A",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"A_Math_3",faculty:"F1",subject:"Math",section:"A",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"A_Physics_1",faculty:"F2",subject:"Physics",section:"A",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"A_Physics_2",faculty:"F2",subject:"Physics",section:"A",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"A_Physics_3",faculty:"F2",subject:"Physics",section:"A",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"A_Chemistry_1",faculty:"F3",subject:"Chemistry",section:"A",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"A_Chemistry_2",faculty:"F3",subject:"Chemistry",section:"A",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"A_Chemistry_3",faculty:"F3",subject:"Chemistry",section:"A",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"A_English_1",faculty:"F4",subject:"English",section:"A",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"A_English_2",faculty:"F4",subject:"English",section:"A",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"A_English_3",faculty:"F4",subject:"English",section:"A",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          // Section A - Labs (1 per subject)
          {id:"A_Math_Lab",faculty:"F1",subject:"Math Lab",section:"A",class_type:"Lab",duration:2,allowed_rooms:["R3","R5"],allowed_days:[1,3,5],forbidden_periods:[4,7,8]},
          {id:"A_Physics_Lab",faculty:"F2",subject:"Physics Lab",section:"A",class_type:"Lab",duration:2,allowed_rooms:["R3","R5"],allowed_days:[2,4,6],forbidden_periods:[4,7,8]},
          {id:"A_Chemistry_Lab",faculty:"F3",subject:"Chemistry Lab",section:"A",class_type:"Lab",duration:2,allowed_rooms:["R3","R5"],allowed_days:[1,3,5],forbidden_periods:[4,7,8]},
          {id:"A_English_Lab",faculty:"F4",subject:"English Lab",section:"A",class_type:"Lab",duration:2,allowed_rooms:["R3","R5"],allowed_days:[2,4,6],forbidden_periods:[4,7,8]},

          // Section B - Theory classes (3 per subject per week) - Same subjects as Section A
          {id:"B_Math_1",faculty:"F1",subject:"Math",section:"B",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"B_Math_2",faculty:"F1",subject:"Math",section:"B",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"B_Math_3",faculty:"F1",subject:"Math",section:"B",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"B_Physics_1",faculty:"F2",subject:"Physics",section:"B",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"B_Physics_2",faculty:"F2",subject:"Physics",section:"B",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"B_Physics_3",faculty:"F2",subject:"Physics",section:"B",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"B_Chemistry_1",faculty:"F3",subject:"Chemistry",section:"B",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"B_Chemistry_2",faculty:"F3",subject:"Chemistry",section:"B",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"B_Chemistry_3",faculty:"F3",subject:"Chemistry",section:"B",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"B_English_1",faculty:"F4",subject:"English",section:"B",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"B_English_2",faculty:"F4",subject:"English",section:"B",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"B_English_3",faculty:"F4",subject:"English",section:"B",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          // Section B - Labs (1 per subject)
          {id:"B_Math_Lab",faculty:"F1",subject:"Math Lab",section:"B",class_type:"Lab",duration:2,allowed_rooms:["R3","R5"],allowed_days:[2,4,6],forbidden_periods:[7,8]},
          {id:"B_Physics_Lab",faculty:"F2",subject:"Physics Lab",section:"B",class_type:"Lab",duration:2,allowed_rooms:["R3","R5"],allowed_days:[1,3,5],forbidden_periods:[7,8]},
          {id:"B_Chemistry_Lab",faculty:"F3",subject:"Chemistry Lab",section:"B",class_type:"Lab",duration:2,allowed_rooms:["R3","R5"],allowed_days:[2,4,6],forbidden_periods:[7,8]},
          {id:"B_English_Lab",faculty:"F4",subject:"English Lab",section:"B",class_type:"Lab",duration:2,allowed_rooms:["R3","R5"],allowed_days:[1,3,5],forbidden_periods:[7,8]},

          // Section C - Theory classes (3 per subject per week) - Same subjects as Section A
          {id:"C_Math_1",faculty:"F1",subject:"Math",section:"C",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"C_Math_2",faculty:"F1",subject:"Math",section:"C",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"C_Math_3",faculty:"F1",subject:"Math",section:"C",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"C_Physics_1",faculty:"F2",subject:"Physics",section:"C",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"C_Physics_2",faculty:"F2",subject:"Physics",section:"C",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"C_Physics_3",faculty:"F2",subject:"Physics",section:"C",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"C_Chemistry_1",faculty:"F3",subject:"Chemistry",section:"C",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"C_Chemistry_2",faculty:"F3",subject:"Chemistry",section:"C",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"C_Chemistry_3",faculty:"F3",subject:"Chemistry",section:"C",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"C_English_1",faculty:"F4",subject:"English",section:"C",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"C_English_2",faculty:"F4",subject:"English",section:"C",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"C_English_3",faculty:"F4",subject:"English",section:"C",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          // Section C - Labs (1 per subject)
          {id:"C_Math_Lab",faculty:"F1",subject:"Math Lab",section:"C",class_type:"Lab",duration:2,allowed_rooms:["R3","R5"],allowed_days:[1,3,5],forbidden_periods:[7,8]},
          {id:"C_Physics_Lab",faculty:"F2",subject:"Physics Lab",section:"C",class_type:"Lab",duration:2,allowed_rooms:["R3","R5"],allowed_days:[2,4,6],forbidden_periods:[7,8]},
          {id:"C_Chemistry_Lab",faculty:"F3",subject:"Chemistry Lab",section:"C",class_type:"Lab",duration:2,allowed_rooms:["R3","R5"],allowed_days:[1,3,5],forbidden_periods:[7,8]},
          {id:"C_English_Lab",faculty:"F4",subject:"English Lab",section:"C",class_type:"Lab",duration:2,allowed_rooms:["R3","R5"],allowed_days:[2,4,6],forbidden_periods:[7,8]},

          // Section D - Theory classes (3 per subject per week) - Same subjects as Section A
          {id:"D_Math_1",faculty:"F1",subject:"Math",section:"D",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"D_Math_2",faculty:"F1",subject:"Math",section:"D",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"D_Math_3",faculty:"F1",subject:"Math",section:"D",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"D_Physics_1",faculty:"F2",subject:"Physics",section:"D",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"D_Physics_2",faculty:"F2",subject:"Physics",section:"D",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"D_Physics_3",faculty:"F2",subject:"Physics",section:"D",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"D_Chemistry_1",faculty:"F3",subject:"Chemistry",section:"D",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"D_Chemistry_2",faculty:"F3",subject:"Chemistry",section:"D",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"D_Chemistry_3",faculty:"F3",subject:"Chemistry",section:"D",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"D_English_1",faculty:"F4",subject:"English",section:"D",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"D_English_2",faculty:"F4",subject:"English",section:"D",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"D_English_3",faculty:"F4",subject:"English",section:"D",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          // Section D - Labs (1 per subject)
          {id:"D_Math_Lab",faculty:"F1",subject:"Math Lab",section:"D",class_type:"Lab",duration:2,allowed_rooms:["R3","R5"],allowed_days:[2,4,6],forbidden_periods:[7,8]},
          {id:"D_Physics_Lab",faculty:"F2",subject:"Physics Lab",section:"D",class_type:"Lab",duration:2,allowed_rooms:["R3","R5"],allowed_days:[1,3,5],forbidden_periods:[7,8]},
          {id:"D_Chemistry_Lab",faculty:"F3",subject:"Chemistry Lab",section:"D",class_type:"Lab",duration:2,allowed_rooms:["R3","R5"],allowed_days:[2,4,6],forbidden_periods:[7,8]},
          {id:"D_English_Lab",faculty:"F4",subject:"English Lab",section:"D",class_type:"Lab",duration:2,allowed_rooms:["R3","R5"],allowed_days:[1,3,5],forbidden_periods:[7,8]},

          // Section E - Theory classes (3 per subject per week) - Same subjects as Section A
          {id:"E_Math_1",faculty:"F1",subject:"Math",section:"E",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"E_Math_2",faculty:"F1",subject:"Math",section:"E",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"E_Math_3",faculty:"F1",subject:"Math",section:"E",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"E_Physics_1",faculty:"F2",subject:"Physics",section:"E",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"E_Physics_2",faculty:"F2",subject:"Physics",section:"E",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"E_Physics_3",faculty:"F2",subject:"Physics",section:"E",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"E_Chemistry_1",faculty:"F3",subject:"Chemistry",section:"E",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"E_Chemistry_2",faculty:"F3",subject:"Chemistry",section:"E",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"E_Chemistry_3",faculty:"F3",subject:"Chemistry",section:"E",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"E_English_1",faculty:"F4",subject:"English",section:"E",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"E_English_2",faculty:"F4",subject:"English",section:"E",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"E_English_3",faculty:"F4",subject:"English",section:"E",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          // Section E - Labs (1 per subject)
          {id:"E_Math_Lab",faculty:"F1",subject:"Math Lab",section:"E",class_type:"Lab",duration:2,allowed_rooms:["R3","R5"],allowed_days:[1,3,5],forbidden_periods:[7,8]},
          {id:"E_Physics_Lab",faculty:"F2",subject:"Physics Lab",section:"E",class_type:"Lab",duration:2,allowed_rooms:["R3","R5"],allowed_days:[2,4,6],forbidden_periods:[7,8]},
          {id:"E_Chemistry_Lab",faculty:"F3",subject:"Chemistry Lab",section:"E",class_type:"Lab",duration:2,allowed_rooms:["R3","R5"],allowed_days:[1,3,5],forbidden_periods:[7,8]},
          {id:"E_English_Lab",faculty:"F4",subject:"English Lab",section:"E",class_type:"Lab",duration:2,allowed_rooms:["R3","R5"],allowed_days:[2,4,6],forbidden_periods:[7,8]},

          // Section F - Theory classes (3 per subject per week) - Same subjects as Section A
          {id:"F_Math_1",faculty:"F1",subject:"Math",section:"F",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"F_Math_2",faculty:"F1",subject:"Math",section:"F",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"F_Math_3",faculty:"F1",subject:"Math",section:"F",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"F_Physics_1",faculty:"F2",subject:"Physics",section:"F",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"F_Physics_2",faculty:"F2",subject:"Physics",section:"F",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"F_Physics_3",faculty:"F2",subject:"Physics",section:"F",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"F_Chemistry_1",faculty:"F3",subject:"Chemistry",section:"F",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"F_Chemistry_2",faculty:"F3",subject:"Chemistry",section:"F",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"F_Chemistry_3",faculty:"F3",subject:"Chemistry",section:"F",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"F_English_1",faculty:"F4",subject:"English",section:"F",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"F_English_2",faculty:"F4",subject:"English",section:"F",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          {id:"F_English_3",faculty:"F4",subject:"English",section:"F",class_type:"Theory",duration:1,allowed_rooms:["R1","R2","R4"],allowed_days:[1,2,3,4,5,6],forbidden_periods:[]},
          // Section F - Labs (1 per subject)
          {id:"F_Math_Lab",faculty:"F1",subject:"Math Lab",section:"F",class_type:"Lab",duration:2,allowed_rooms:["R3","R5"],allowed_days:[2,4,6],forbidden_periods:[7,8]},
          {id:"F_Physics_Lab",faculty:"F2",subject:"Physics Lab",section:"F",class_type:"Lab",duration:2,allowed_rooms:["R3","R5"],allowed_days:[1,3,5],forbidden_periods:[7,8]},
          {id:"F_Chemistry_Lab",faculty:"F3",subject:"Chemistry Lab",section:"F",class_type:"Lab",duration:2,allowed_rooms:["R3","R5"],allowed_days:[2,4,6],forbidden_periods:[7,8]},
          {id:"F_English_Lab",faculty:"F4",subject:"English Lab",section:"F",class_type:"Lab",duration:2,allowed_rooms:["R3","R5"],allowed_days:[1,3,5],forbidden_periods:[7,8]},
        ]
      };

      const res = await fetch('http://localhost:5000/api/run-solver', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(requestData)
      });

      const data = await res.json();
      console.log('Solver response:', data);
      
      if (data.status === 'INFEASIBLE') {
        alert('No feasible timetable found. The constraints are too restrictive. Try reducing the number of classes or relaxing constraints.');
        setScheduled([]);
        setSelectedSection('');
      } else if (data.error) {
        alert(`Error: ${data.error}`);
        setScheduled([]);
        setSelectedSection('');
      } else {
      setScheduled(data.scheduled || []);
      const sections = [...new Set((data.scheduled||[]).map(c=>c.section))];
      setSelectedSection(sections[0] || '');
        console.log(`Generated ${data.scheduled?.length || 0} scheduled classes`);
        
        // Show summary of scheduled classes
        const summary = {};
        data.scheduled?.forEach(cls => {
          if (!summary[cls.section]) summary[cls.section] = 0;
          summary[cls.section]++;
        });
        console.log('Classes per section:', summary);
      }
    } catch(err) {
      console.error(err);
      alert('Failed to generate timetable: ' + err.message);
    }
    setLoading(false);
  };

  // Group scheduled classes by section
  const sectionGroups = {};
  for(const cls of scheduled){
    if(!sectionGroups[cls.section]) sectionGroups[cls.section] = [];
    sectionGroups[cls.section].push(cls);
  }

  // Build grid for selected section
  const grid = {};
  const selectedClasses = sectionGroups[selectedSection] || [];
  for(const cls of selectedClasses){
    if(!grid[cls.day]) grid[cls.day] = {};
    grid[cls.day][cls.period] = cls;
  }

  return (
    <div style={{fontFamily:'Arial, sans-serif', padding:20}}>
      <h1>Class Timetable</h1>
      <button onClick={generateTimetable} disabled={loading} style={{padding:10, fontSize:16}}>
        {loading ? 'Generating...' : 'Generate Timetable'}
      </button>

      {Object.keys(sectionGroups).length > 0 && (
        <div style={{marginTop:20}}>
          <label style={{marginRight:8}}>Select Section:</label>
          <select value={selectedSection} onChange={e=>setSelectedSection(e.target.value)} style={{padding:8, fontSize:16}}>
            {Object.keys(sectionGroups).map(sec=><option key={sec} value={sec}>{sec}</option>)}
          </select>
        </div>
      )}

      {selectedSection && (
        <div style={{marginTop:30}}>
          <table style={{borderCollapse:'collapse', width:'100%', textAlign:'center'}}>
            <thead>
              <tr>
                <th style={{border:'1px solid #555', padding:10}}>Day</th>
                {periods.map(p=><th key={p} style={{border:'1px solid #555', padding:10}}>Period {p}</th>)}
              </tr>
            </thead>
            <tbody>
              {days.map((day,di)=>(
                <tr key={di}>
                  <th style={{border:'1px solid #555', padding:10, background:'#f2f2f2'}}>{day}</th>
                  {periods.map(p=>{
                    const cls = grid[di+1]?.[p];
                    const isBreakPeriod = [4].includes(p); // Break periods (lunch only)
                    return (
                      <td key={p} style={{
                        border:'1px solid #555', 
                        padding:10, 
                        minWidth:120, 
                        background: isBreakPeriod ? '#ffeaa7' : (cls ? (cls.subject.toLowerCase().includes('lab') ? '#d1e7dd' : '#fff'):'#f8d7da')
                      }}>
                        {isBreakPeriod ? (
                          <div style={{textAlign:'center', fontWeight:'bold', color:'#d63031'}}>
                            <div>BREAK</div>
                            <div style={{fontSize:'12px'}}>Lunch</div>
                          </div>
                        ) : cls ? (
                          <div>
                            <div><strong>{cls.subject}</strong></div>
                            <div>{cls.faculty}</div>
                            <div>{cls.classroom}</div>
                            <div>{cls.class_type}</div>
                          </div>
                        ) : '-'}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {scheduled.length===0 && !loading && (
        <div style={{marginTop:20, color:'#666'}}>No timetable generated yet. Click the button above to generate one.</div>
      )}
    </div>
  );
}
