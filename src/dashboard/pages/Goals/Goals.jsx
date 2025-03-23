import React, { useContext, useState, useEffect } from 'react';
import { GoalsContext } from '../../../context/GoalsContext';
import { fetchGoals } from '../../../utils/Api'; // Ensure correct import
import { motion } from 'framer-motion';

const Goals = () => {
  const { goals, setGoals } = useContext(GoalsContext);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
<<<<<<< Updated upstream
    const refreshGoals = async () => {
      try {
        const fetchedGoals = await fetchGoals();
        setGoals(fetchedGoals);
      } catch (error) {
        console.error('Error fetching goals:', error);
      }
      finally {
        setLoading(false);
      }
    };
=======
    if (goals.goals && goals.ai_goals) {
      setLoading(false);
      console.log("ai goals", goals.ai_goals);
    }
  }, [goals]);
>>>>>>> Stashed changes

    refreshGoals();
  }, [goals.length]); // Re-fetch whenever goals change

  

  if (loading) {
    return (
      <div className='w-full mt-8 flex min-h-screen'>
      <div className="w-11/12 p-8 mt-8 py-8 flex-1 flex justify-center items-center overflow-y-auto scrollbar-hide max-h-[75vh] no-scrollbar">
      <motion.div className="flex space-x-2">
  {[0, 1, 2].map((i) => (
    <motion.div
      key={i}
      className="w-2 h-2 bg-[#65558F] rounded-full"
      initial={{ y: -10 }}
      animate={{ y: [0, 10, 0] }}
      transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.2 }}
    />
  ))}
</motion.div>

      </div>
    </div>
    );
  }



  return (
    <div className='w-full mt-8 flex min-h-screen'>
      <div className="w-11/12 p-8 mt-8 py-8 flex-1 overflow-y-auto scrollbar-hide max-h-[75vh] no-scrollbar">
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
