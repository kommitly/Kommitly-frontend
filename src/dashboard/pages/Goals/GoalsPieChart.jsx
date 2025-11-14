import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

const GoalsPieChart = ({ goals, aiGoals }) => {
  const totalGoals = goals.length;
  const totalAiGoals = aiGoals.length;

  const data = [
    { name: 'Goals', value: totalGoals },
    { name: 'AI Goals', value: totalAiGoals }
  ];

  return (
    <div style={{ width: '100%', maxWidth: '250px', margin: '0 auto' }}>
     <PieChart
  series={[
    {
      data: [
        { id: 0, value: totalGoals, label: 'Goals' , color: '#B994DD'},
        { id: 1, value: totalAiGoals, label: 'AI Goals', color: '#6246AC' }
      ],
      innerRadius: 30,
      outerRadius: 100,
      paddingAngle: 5,
      cornerRadius: 5,
      startAngle: -45,
      endAngle: 225,
      highlightScope: { fade: 'global', highlight: 'item' },
      faded: { innerRadius: 30, additionalRadius: -30, color: 'rgba(29,29,30,0.27)' },
    
    }
  ]}
  width={300}
  height={300}
  slotProps={{
    legend: {
      direction: 'row',
      position: { vertical: 'top', horizontal: 'middle' },
      padding: 0,
      labelStyle: {
        fontSize: 12,
        
      },
    },
   
  }}
/>

    </div>
  );
};

export default GoalsPieChart;