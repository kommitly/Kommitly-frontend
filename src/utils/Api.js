import axios from 'axios';

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQxNDU4NTI4LCJpYXQiOjE3NDA4NTM3MjgsImp0aSI6IjEyMjFlOTliMTMxNDQxYmU4YTZiMmQxNTJkYTkyOTQ5IiwidXNlcl9pZCI6IjA5MzIxOTgwLTk1NWItNGFkOS04MTE1LWI5YWQxZGM4ODY0NyJ9.klrBjFt24ec4VawF0tVMkUE6XbSt3l74-yTJpnQ2QYE";


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

const createAiGoal = async (ai_goal, ai_tasks) => {
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

const createGoal = async (title, description = '') => {
  const url = "https://kommitly-backend.onrender.com/api/goals/create/goal/";
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
    console.error("Error creating goal:", error.response?.data || error.message);
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
    return response.data; // Since response.data is already an array

  } catch (error) {
    console.error("Error fetching goals:", error.response?.data || error.message);
    throw error;
  }
};

const fetchAiGoalById = async (goalId) => {
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


const fetchGoalById = async (goalId) => {
  const url = `https://kommitly-backend.onrender.com/api/goals/${goalId}/`;
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

const deleteAiGoalById = async (goalId) => {
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

const createTask = async ({ goal, title}) => {
  const url = "https://kommitly-backend.onrender.com/api/goals/create/task/";
  const requestBody = { goal, title };
  try {
    const response = await axios.post(url, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  }
  catch (error) {
    console.error("Error creating task:", error.response?.data || error.message);
    throw error;
  }
}

const fetchTasks = async () => {  
  const url = "https://kommitly-backend.onrender.com/api/tasks/";
  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  }
  catch (error) {
    console.error("Error fetching tasks:", error.response?.data || error.message);
    throw error;
  }
}


export { generateInsights, createAiGoal, createGoal, fetchGoals, fetchAiGoalById, deleteAiGoalById, updateAiGoalById, updateTaskStatus, fetchGoalById, createTask , fetchTasks};