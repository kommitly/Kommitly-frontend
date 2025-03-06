import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { fetchGoals } from '../utils/Api'; // Adjust the import path as needed

export const GoalsContext = createContext();

export const GoalsProvider = ({ children }) => {
  const [goals, setGoals] = useState({ goals: [], ai_goals: [] });

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const fetchedGoals = await fetchGoals();
        console.log(fetchedGoals)
        setGoals(fetchedGoals ?? { goals: [], ai_goals: [] });
      } catch (error) {
        console.error('Error fetching goals:', error);
      }
    };
  
    loadGoals();
  }, []); // Re-fetch whenever goals length changes
  

  const addGoal = (newGoal) => {
    setGoals((prevGoals) => ({
      ...prevGoals,
      goals: [...prevGoals.goals, newGoal],
    }));
  };
  

  const removeGoal = (goalId) => {
    setGoals((prevGoals) => ({
      ...prevGoals,
      goals: prevGoals.goals.filter((goal) => goal.id !== goalId),
    }));
  };
  

  return (
    <GoalsContext.Provider value={{ goals, setGoals, addGoal, removeGoal }}>
      {children}
    </GoalsContext.Provider>
  );
};

GoalsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};