import React, { createContext, useState, useEffect } from 'react';
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
  }, []);

  const addGoal = (newGoal) => {
    setGoals((prevGoals) => [...prevGoals, newGoal]);
  };

  return (
    <GoalsContext.Provider value={{ goals, setGoals, addGoal }}>
      {children}
    </GoalsContext.Provider>
  );
};