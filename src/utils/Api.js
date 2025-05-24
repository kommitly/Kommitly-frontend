import axios from 'axios';

// Function to get token from localStorage
const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token not found in localStorage");
    return null;
  }   
  return token;
};

const generateInsights = async (title, description) => {
  const url = "https://kommitly-backend.onrender.com/api/goals/generate-ai-insights/";
  const requestBody = { title, description };
  try {
    const token = getToken();
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
    const token = getToken();
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


const createGoal = async (title) => {
  const url = "https://kommitly-backend.onrender.com/api/goals/create/goal/";
  const requestBody = { title };
  try {
    const token = getToken();
    const response = await axios.post(url, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating goal:", error.response?.data || error.message);
    alert(`Error: ${JSON.stringify(error.response?.data)}`); // Show error to user
    throw error;
  }
};


const fetchGoals = async () => {
  const url = "https://kommitly-backend.onrender.com/api/goals/user-goals/";
  try {
    const token = getToken();
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
    const token = getToken();
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
    const token = getToken();
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
    const token = getToken();
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

const deleteGoalById = async (goalId) => {
  const url = `https://kommitly-backend.onrender.com/api/goals/${goalId}/delete/`;
  try {
    const token = getToken();
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
    const token = getToken();
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

const updateGoalById = async (goalId, title, description) => {
  const url = `https://kommitly-backend.onrender.com/api/goals/${goalId}/update-goal/`;
  const requestBody = { title, description };
  try {
    const token = getToken();
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

const updateAiTaskStatus = async (taskId, updatedData) => {
  const url = `https://kommitly-backend.onrender.com/api/tasks/${taskId}/update-ai-task/`;
  try {
    const token = getToken();
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

const updateSingleTaskStatus = async (taskId, updatedData) => {
  const url = `https://kommitly-backend.onrender.com/api/tasks/${taskId}/`;
  try {
    const token = getToken();
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

const updateSubtask = async (taskId, subtaskId, updatedData) => {
  console.log ( "for task with ID:", taskId, "Updating subtask with ID:", subtaskId, "with data:", updatedData);
  const url = `https://kommitly-backend.onrender.com/api/tasks/${taskId}/subtasks/${subtaskId}/`;
  console.log("API URL: ", url); // Log the URL for debugging
  try {
    const token = getToken();
    const response = await axios.patch(url, updatedData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
    
  } catch (error) {
    console.error(`Error updating subtask with ID ${subtaskId} for task ${taskId}:`, error.response?.data || error.message);
    throw error;
  }
}





const createTask = async ({ goal, title}) => {
  const url = "https://kommitly-backend.onrender.com/api/goals/create/task/";
  const requestBody = { goal, title };
  try {
    const token = getToken();
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


const createSubtask = async ({ taskId, title }) => {
  const url = `https://kommitly-backend.onrender.com/api/tasks/${taskId}/create-subtask/`; // Ensure task ID is in the URL
  const requestBody = { title }; // Send only the title in the request body
  
  try {
    const token = getToken();
    const response = await axios.post(url, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating sub-task:", error.response?.data || error.message);
    throw error;
  }
};




const createAiTask = async ({goalId, taskData}) => {  
  const url = `https://kommitly-backend.onrender.com/api/goals/${goalId}/ai-tasks/create/`;
  try {
    const token = getToken();
    const response = await axios.post(url, taskData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  }
  catch (error) {
    console.error("Error creating AI task:", error.response?.data || error.message);
    throw error;
  }
}


const fetchTasks = async () => {  
  const url = "https://kommitly-backend.onrender.com/api/tasks/";
  try {
    const token = getToken();
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

const deleteTaskById = async (taskId) => {
  const url = `https://kommitly-backend.onrender.com/api/tasks/${taskId}/delete/`;
  try {
    const token = getToken();
    const response = await axios.delete(url, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting task with ID ${taskId}:`, error.response?.data || error.message);
    throw error;
  }
}

const deleteSubtaskById = async (subtaskId) => {
  const url = `https://kommitly-backend.onrender.com/api/tasks/subtasks/${subtaskId}/delete/`;
  try {
    const token = getToken();
    const response = await axios.delete(url, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting subtask with ID ${subtaskId}:`, error.response?.data || error.message);
    throw error;
  }
}

const fetchTasksByGoalId = async (goalId) => {
  const url = `https://kommitly-backend.onrender.com/api/goals/${goalId}/tasks/`;
  try {
    const token = getToken();
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching tasks for goal with ID ${goalId}:`, error.response?.data || error.message);
    throw error;
  }
}

const fetchUserProfile = async () => {
  const url = "https://kommitly-backend.onrender.com/api/users/profile/";
  try {
    const token = getToken();
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error.response?.data || error.message);
    throw error;
  }
} 

const deleteAiTaskById = async (taskId) => {
  const url = `https://kommitly-backend.onrender.com/api/tasks/${taskId}/delete-ai-task/`;
  try {
    const token = getToken();
    const response = await axios.delete(url, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting task with ID ${taskId}:`, error.response?.data || error.message);
    throw error;
  }
}

const updateAiTaskById = async (taskId, updatedData) => {
  const url = `https://kommitly-backend.onrender.com/api/tasks/${taskId}/update-ai-task/`;
  try {
    const token = getToken();
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

const fetchTaskById = async (taskId) => {
  
  const url = `https://kommitly-backend.onrender.com/api/tasks/${taskId}/`;
  try {
    const token = getToken();
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching task with ID ${taskId}:`, error.response?.data || error.message);
    throw error;
  }
}


const updateAiSubtaskById = async (taskId, subtaskId, updatedData) => {
  const url = `https://kommitly-backend.onrender.com/api/tasks/${taskId}/ai-subtasks/${subtaskId}/`;

  try {
    const token = getToken();
    const response = await axios.patch(url, updatedData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
    
  } catch (error) {
    console.error(`Error updating subtask with ID ${subtaskId} for task ${taskId}:`, error.response?.data || error.message);
    throw error;
  }
}

export { 
  generateInsights,
  fetchTaskById,
  updateSubtask,
  updateSingleTaskStatus, 
  updateGoalById,
  createSubtask,
  createAiGoal, 
  createGoal, 
  fetchGoals, 
  createAiTask,
  updateAiTaskById,
  fetchAiGoalById, 
  deleteAiGoalById, 
  updateAiGoalById, 
  updateAiTaskStatus, 
  fetchGoalById, 
  createTask , 
  fetchTasks, 
  deleteGoalById, 
  deleteTaskById,
  deleteSubtaskById, 
  fetchTasksByGoalId, 
  fetchUserProfile, 
  deleteAiTaskById,
  updateAiSubtaskById};