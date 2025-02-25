import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { fetchGoals } from '../utils/Api'; // Adjust the import path as needed

export const GoalsContext = createContext();

export const GoalsProvider = ({ children }) => {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const fetchedGoals = await fetchGoals();
        setGoals(fetchedGoals);
      } catch (error) {
        console.error('Error fetching goals:', error);
      }
    };
  
    loadGoals();
  }, [goals.length]); // Re-fetch whenever goals length changes
  

  const addGoal = (newGoal) => {
    setGoals((prevGoals) => [...prevGoals, newGoal]);
  };

  const removeGoal = (goalId) => {
    setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== goalId));
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