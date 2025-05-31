import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { fetchGoals } from '../utils/Api'; // Adjust the import path as needed

export const GoalsContext = createContext();

export const GoalsProvider = ({ children }) => {
  const [goals, setGoals] = useState({ goals: [], ai_goals: [] });

  // Load hidden and pinned goals from localStorage
  const [hiddenGoals, setHiddenGoals] = useState(() => {
    const storedHiddenGoals = localStorage.getItem("hiddenGoals");
    return storedHiddenGoals ? new Set(JSON.parse(storedHiddenGoals)) : new Set();
  });

  const [pinnedGoals, setPinnedGoals] = useState(() => {
    const storedPinnedGoals = localStorage.getItem("pinnedGoals");
    return storedPinnedGoals ? new Set(JSON.parse(storedPinnedGoals)) : new Set();
  });

  useEffect(() => {
    const loadGoals = async () => {
      
        const token = localStorage.getItem("token");  // Check if token exists
        if (!token) return; 

          try {
            const fetchedGoals = await fetchGoals();
            console.log("Fetched Goals:", fetchedGoals);
            setGoals(fetchedGoals ?? { goals: [], ai_goals: [] });
        } 
        catch (error) {    
        console.error('Error fetching goals:', error);
      }
    };

    loadGoals();
  }, []);

  // Function to reload goals from API
const reloadGoals = async () => {
  try {
    const fetchedGoals = await fetchGoals();
    console.log("Reloaded Goals:", fetchedGoals);
    setGoals(fetchedGoals ?? { goals: [], ai_goals: [] });
  
    return fetchedGoals;  // Return them here!
  } catch (error) {
    console.error('Error reloading goals:', error);
  }
};

  const addGoal = (newGoal) => {
    setGoals((prevGoals) => ({
      ...prevGoals,
      goals: [...prevGoals.goals, newGoal],
    }));
  };


  const removeGoal = (goalId) => {
    setGoals((prevGoals) => ({
      goals: prevGoals.goals.filter((goal) => goal.id !== goalId),
      ai_goals: prevGoals.ai_goals.filter((goal) => goal.id !== goalId), // Ensure AI goals update
    }));
     // Wait for UI update and then fetch fresh data
  setTimeout(reloadGoals, 500);
  };
  

  // Hide goal from sidebar without modifying setGoals
  const removeGoalFromSidebar = (goalId) => {
    setHiddenGoals((prevHidden) => {
      const updatedHidden = new Set(prevHidden);
      updatedHidden.delete(goalId);
      localStorage.setItem("hiddenGoals", JSON.stringify([...updatedHidden]));
      return updatedHidden;
  });

  setPinnedGoals((prevPinned) => {
    const updatedPinned = new Set(prevPinned);
    updatedPinned.delete(goalId);
    console.log("Updated Pinned Goals:", updatedPinned);
    localStorage.setItem("pinnedGoals", JSON.stringify([...updatedPinned]));
    return updatedPinned;
});


  // Remove from the main goal list
  setGoals((prevGoals) => ({
    goals: prevGoals.goals.filter(goal => goal.id !== goalId),
    ai_goals: prevGoals.ai_goals.filter(goal => goal.id !== goalId),
}));

 // Reload goals from API after removal
 setTimeout(reloadGoals, 200);
    
  };

  const unhideGoal = (goalId) => {
    setHiddenGoals((prevHidden) => {
      const updatedHidden = new Set(prevHidden);
      updatedHidden.delete(goalId);
      localStorage.setItem("hiddenGoals", JSON.stringify([...updatedHidden]));
      return updatedHidden;
    });
  };

  // Add goal to the sidebar (Pinning)
  const addGoalToSidebar = (goalId) => {
    if (!goalId) {
      console.error("Goal ID is undefined");
      return;
    }

    console.log("Adding goal to sidebar:", goalId);

    setPinnedGoals((prevPinned) => {
      const updatedPinned = new Set(prevPinned);
      updatedPinned.add(goalId);
      localStorage.setItem("pinnedGoals", JSON.stringify([...updatedPinned]));
      return updatedPinned;
    });

    setHiddenGoals((prevHidden) => {
      const updatedHidden = new Set(prevHidden);
      updatedHidden.delete(goalId); // Unhide goal if it was hidden
      localStorage.setItem("hiddenGoals", JSON.stringify([...updatedHidden]));
      return updatedHidden;
    });
    
  };

  

  return (
    <GoalsContext.Provider value={{ 
      goals, 
      setGoals, 
      addGoal, 
      reloadGoals,
      removeGoal, 
      removeGoalFromSidebar, 
      hiddenGoals, 
      unhideGoal, 
      addGoalToSidebar, 
      pinnedGoals 
    }}>
      {children}
    </GoalsContext.Provider>
  );
};

GoalsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
