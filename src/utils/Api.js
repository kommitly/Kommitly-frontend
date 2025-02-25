import axios from 'axios';

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQwODM4MjE3LCJpYXQiOjE3NDAyMzM0MTcsImp0aSI6ImU1ZThkOWEwMTg1ZjRmZjA4MTI0NTAyNjQ1NmE5M2MwIiwidXNlcl9pZCI6ImU4ZWNjNmZlLWFiYjQtNDBiNC1iOGYwLTE5MmY4ODVlYjg1YiJ9.J_WjRWprcdV_DO-72msMO_T4z8v6_i3ZQU-dO8gGsig";


const generateInsights = async (title, description) => {
  const url = "https://kommitly-backend.onrender.com/api/goals/generate-ai-insights/";
  const requestBody = { title, description };
  try {
    const response = await axios.post(url, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating goal:", error);
    throw error;
  }
};

const createGoal = async (ai_goal, ai_tasks) => {
  const url = "https://kommitly-backend.onrender.com/api/goals/create-goal-ai/";
  const requestBody = { ai_goal, ai_tasks };
  try {
    const response = await axios.post(url, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating AI goal:", error.response?.data || error.message);
    throw error;
  }
};

const fetchGoals = async () => {
  const url = "https://kommitly-backend.onrender.com/api/goals/user-goals/";
  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const { goals, ai_goals } = response.data;
    return [...goals, ...ai_goals];
  } catch (error) {
    console.error("Error fetching goals:", error.response?.data || error.message);
    throw error;
  }
};

const fetchGoalById = async (goalId) => {
  const url = `https://kommitly-backend.onrender.com/api/goals/${goalId}/ai-goal/`;
  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching goal with ID ${goalId}:`, error.response?.data || error.message);
    throw error;
  }
};

const deleteGoalById = async (goalId) => {
  const url = `https://kommitly-backend.onrender.com/api/goals/${goalId}/delete-ai-goal/`;
  try {
    const response = await axios.delete(url, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting goal with ID ${goalId}:`, error.response?.data || error.message);
    throw error;
  }
};

const updateAiGoalById = async (goalId, title, description) => {
  const url = `https://kommitly-backend.onrender.com/api/goals/${goalId}/update-ai-goal/`;
  const requestBody = { title, description };
  try {
    const response = await axios.patch(url, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating goal with ID ${goalId}:`, error.response?.data || error.message);
    throw error;
  }
}

const updateTaskStatus = async (taskId, updatedData) => {
  const url = `https://kommitly-backend.onrender.com/api/tasks/${taskId}/update-ai-task/`;
  try {
    const response = await axios.patch(url, updatedData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
    
  } catch (error) {
    console.error(`Error updating task with ID ${taskId}:`, error.response?.data || error.message);
    throw error;
  }
}

export { generateInsights, createGoal, fetchGoals, fetchGoalById, deleteGoalById, updateAiGoalById, updateTaskStatus };