import React, { useContext } from 'react';
import { GoalsContext } from '../../../context/GoalsContext'; // Adjust the import path as needed

const Goals = () => {
  const { goals } = useContext(GoalsContext);

  return (
    <div className=' w-full mt-8  flex  min-h-screen'>
        <div className=" w-11/12 p-8 mt-8 py-8 flex-1 overflow-y-auto scrollbar-hide max-h-[75vh] no-scrollbar">
        <h1>All Goals</h1>
      <ul>
        {goals.map((goal) => (
          <li key={goal.id}>{goal.title}</li>
        ))}
      </ul>
        </div>
     
    </div>
  );
};

export default Goals;