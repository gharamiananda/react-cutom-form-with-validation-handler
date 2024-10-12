import { useRef, useState } from "react";

function RefArray() {
    // the team input values
    const [team, setTeam] = useState([ "" ,'','']);
    // the input refs array
    const inputRefs =useRef([]);

  
    // update a team member
    function updateMember(index, value) {
      setTeam([ ...team.slice(0, index), value, ...team.slice(index+1)]);
    };
    
    // to focus the input
    function handleClick(element) {
      inputRefs.current[element].focus();
    };
    
    return (
      <div className="py-10">
        <h2 className="text-lg font-bold">Team</h2>
        <p className="text-gray-700 pb-4">Dynamic inputs with an array ref.</p>
        {team.map((member, i) => {
          return (
            <div key={i}>
              <label htmlFor={`input-array-${i+1}`}>Member {i+1}</label>
              <input ref={(element) => inputRefs.current[i] = element} id={`input-array-${i+1}`} value={team[i]} onChange={(e) => updateMember(i, e.target.value)} />
              <button onClick={() => handleClick(i)}>Focus Me</button>
            </div>
          );
        })}
      </div>
    );
  };

  export default RefArray