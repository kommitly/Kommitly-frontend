import axios from "../utils/axiosConfig";  // now works


const generateInsights = async (title, description) => {
  const url = "https://kommitly-backend.onrender.com/api/goals/generate-ai-insights/";
  const requestBody = { title, description };
  try {
    //const token = getToken();
    const response = await axios.post(url, requestBody);
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


const createGoal = async (title, category) => {
  const url = "https://kommitly-backend.onrender.com/api/goals/create/goal/";
  const requestBody = { title, category };
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
  const url = "http://127.0.0.1:8000/api/goals/user-goals/";
  try {
   
    const response = await axios.get(url, {
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
  const url = `https://kommitly-backend.onrender.com/api/goals/${goalId}/update/`;
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

const updateTaskById = async (taskId, updatedData) => {
  console.log ( "for task with ID:", taskId, "with data:", updatedData);
  const url = `https://kommitly-backend.onrender.com/api/tasks/${taskId}/update/`;
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


const createTask = async ({ goal, title, priority, due_date, reminder_time}) => {
  const url = "https://kommitly-backend.onrender.com/api/goals/create/task/";
  const requestBody = { goal, title, priority, due_date, reminder_time };
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



const createAISubtask = async ({ taskId, title }) => {
  const url = `https://kommitly-backend.onrender.com/api/tasks/${taskId}/create-ai-subtask/`; // Ensure task ID is in the URL
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
  const url = "http://127.0.0.1:8000/api/users/profile/";
  try {
    
    const response = await axios.get(url, {
      
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


const triggerAiSubtaskReminder = async (subtaskData ) => {
  const url = "https://kommitly-backend.onrender.com/api/tasks/trigger-ai-subtask-reminders/";
  try {
    const token = getToken();
    const response = await axios.post(url, subtaskData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error triggering AI subtask reminder:", error.response?.data || error.message);
    throw error;
  }
}


const deleteAiSubtaskById = async (subtaskId) => {
  const url = `https://kommitly-backend.onrender.com/api/tasks/ai-subtasks/${subtaskId}/delete/`;
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
    console.error(`Error deleting AI subtask with ID ${subtaskId}:`, error.response?.data || error.message);
    throw error;
  }
}


const getAiSubtaskById = async (taskId, subtaskId) => {
  const url = `https://kommitly-backend.onrender.com/api/ai-task/${taskId}/ai-subtask/${subtaskId}/`;
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
    console.error(`Error fetching AI subtask with ID ${subtaskId} for task ${taskId}:`, error.response?.data || error.message);
    throw error;
  }
}

const fetchAllNotifications = async () => {
  const url = "https://kommitly-backend.onrender.com/api/notifications/";
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
    console.error("Error fetching notifications:", error.response?.data || error.message);
    throw error;
  }
}

const markNotificationAsRead = async (notificationId) => {
  const url = `https://kommitly-backend.onrender.com/api/notifications/${notificationId}/mark-read/`;
  try {
    const token = getToken();
    const response = await axios.patch(url, {}, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error marking notification with ID ${notificationId} as read:`, error.response?.data || error.message);
    throw error;
  }
}

const markAllNotificationAsRead = async () => {
  const url = `https://kommitly-backend.onrender.com/api/notifications/mark-all-read/`;
  try {
    const token = getToken();
    const response = await axios.patch(url, {}, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error marking all notifications as read:`, error.response?.data || error.message);
    throw error;
  }
}


const answerAiSubtask = async (subtaskId) => {
  const url = `https://kommitly-backend.onrender.com/api/tasks/ai-subtask/${subtaskId}/answer/`;
  try {
    const token = getToken();
    const response = await axios.post(url, {}, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error answering AI subtask with ID ${subtaskId}:`, error.response?.data || error.message);
    throw error;
  }
}



const loginWithGoogle = async (id_token) => {
  const url = "https://kommitly-backend.onrender.com/api/auth/google/";
  try {
    const response = await axios.post(url, { id_token }, {
      headers: {
        "Content-Type": "application/json"
      },
      
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in with Google:", error.response?.data || error.message);
    throw error;
  }
}

const createRoutine = async (routine_data)=> {
  const url = "https://kommitly-backend.onrender.com/api/routines/";
  try {
    const token = getToken();
    const response = await axios.post(url, routine_data, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error.response?.data || error.message);
    throw error;
  }
}



const fetchRoutines = async () => {
  const url = "https://kommitly-backend.onrender.com/api/routines/";
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
    console.error("Error fetching Routines:", error.response?.data || error.message);
    throw error;
  }
}


const fetchRoutineById = async (routineId) => {
  
  const url = `https://kommitly-backend.onrender.com/api/routines/${routineId}/`;
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
    console.error(`Error fetching Routine with ID ${routineId}:`, error.response?.data || error.message);
    throw error;
  }
}


const updateRoutineById = async (routineId, updatedData) => {
  console.log ( "for routine with ID:", routineId, "with data:", updatedData);
  const url = `https://kommitly-backend.onrender.com/api/routines/${routineId}/`;
 
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
    console.error(`Error updating routine with ID ${routineId}:`, error.response?.data || error.message);
    throw error;
  }
}

const deleteRoutineById = async (routineId) => {
  const url = `https://kommitly-backend.onrender.com/api/routines/${routineId}/`;
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
    console.error(`Error deleting routine with ID ${routineId}:`, error.response?.data || error.message);
    throw error;
  }
};



const fetchDailyTemplates = async () => {
  const url = "https://kommitly-backend.onrender.com/api/daily-templates/";
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
    console.error("Error fetching Daily Templates:", error.response?.data || error.message);
    throw error;
  }
}

const fetchDailyActivities = async (view = "today") => {
  const url = `https://kommitly-backend.onrender.com/api/daily-activities/?view=${view}`;
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
    console.error("Error fetching Daily Activities:", error.response?.data || error.message);
    throw error;
  }
};


const createDailyTemplates = async (template_data)=> {
  const url = "https://kommitly-backend.onrender.com/api/daily-templates/";
  try {
    const token = getToken();
    const response = await axios.post(url, template_data, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating Daily Templates:", error.response?.data || error.message);
    throw error;
  }
}


const createDailyActivities = async (activities_data)=> {
  const url = "https://kommitly-backend.onrender.com/api/daily-activities/";
  try {
    const token = getToken();
    const response = await axios.post(url, activities_data, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating Daily Activities:", error.response?.data || error.message);
    throw error;
  }
}


const fetchTemplatesById = async (templateId) => {
  
  const url = `https://kommitly-backend.onrender.com/api/daily-templates/${templateId}/`;
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
    console.error(`Error fetching Template with ID ${templateId}:`, error.response?.data || error.message);
    throw error;
  }
}



const fetchActivitiesById = async (activitiesId) => {
  
  const url = `https://kommitly-backend.onrender.com/api/daily-activities/${activitiesId}/`;
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
    console.error(`Error fetching Daily activity with ID ${activitiesId}:`, error.response?.data || error.message);
    throw error;
  }
}


const updateTemplatesById = async (templateId, templateData) => {
  console.log ( "for template with ID:", templateId, "with data:", templateData);
  const url = `https://kommitly-backend.onrender.com/api/daily-templates/${templateId}/`;
 
  try {
    const token = getToken();
    const response = await axios.patch(url, templateData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
    
  } catch (error) {
    console.error(`Error updating template with ID ${templateId}:`, error.response?.data || error.message);
    throw error;
  }
}


const updateActivitiesById = async (activitiesId, activitiesData) => {
  console.log ( "for template with ID:", activitiesId, "with data:", activitiesData);
  const url = `https://kommitly-backend.onrender.com/api/daily-activities/${activitiesId}/`;
 
  try {
    const token = getToken();
    const response = await axios.patch(url, activitiesData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
    
  } catch (error) {
    console.error(`Error updating Daily activity with ID ${activitiesId}:`, error.response?.data || error.message);
    throw error;
  }
}



const deleteTemplatesById = async (templateId) => {
  const url = `https://kommitly-backend.onrender.com/api/daily-templates/${templateId}/`;
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
    console.error(`Error deleting template with ID ${templateId}:`, error.response?.data || error.message);
    throw error;
  }
};


const deleteActivitiesById = async (activitiesId) => {
  const url = `https://kommitly-backend.onrender.com/api/daily-activities/${activitiesId}/`;
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
    console.error(`Error deleting daily activity  with ID ${activitiesId}:`, error.response?.data || error.message);
    throw error;
  }
};

const markDailyActivityComplete = async (activityId, completed = true) => {
  const url = `https://kommitly-backend.onrender.com/api/daily-activities/${activityId}/complete/`;
  try {
    const token = getToken();
    const response = await axios.patch(
      url,
      { completed },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error marking activity ${activityId} complete:`, error.response?.data || error.message);
    throw error;
  }
};




const fetchTemplatesSuggestions = async () => {
  const url = "https://kommitly-backend.onrender.com/api/daily-templates/suggestions/";
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
    console.error("Error fetching daily template suggestions:", error.response?.data || error.message);
    throw error;
  }
}

const saveTemplateSuggestion = async (templateData ) => {
  const url = "https://kommitly-backend.onrender.com/api/daily-templates/save-suggestion/";
  try {
    const token = getToken();
    const response = await axios.post(url, templateData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error triggering AI subtask reminder:", error.response?.data || error.message);
    throw error;
  }
}



const fetchDashboardStats = async () => {
  const url = "http://127.0.0.1:8000/api/users/stats/";
  try {
    
    const response = await axios.get(url, {
      
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error.response?.data || error.message);
    throw error;
  }
}





const updateUserProfile = async (updatedData) => {
  const url = `https://kommitly-backend.onrender.com/api/users/user/update/`;
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
    console.error(`Error updating user profile:`, error.response?.data || error.message);
    throw error;
  }
}








export { 
  generateInsights,
  fetchTaskById,
  updateSubtask,
  updateTaskById, 
  updateGoalById,
  createSubtask,
  createAISubtask,
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
  updateAiSubtaskById,
  triggerAiSubtaskReminder,
  deleteAiSubtaskById,
  getAiSubtaskById,
  fetchAllNotifications,
  markNotificationAsRead,
  answerAiSubtask,
  loginWithGoogle,
  createRoutine,
  fetchRoutines,
  fetchRoutineById,
  updateRoutineById,
  deleteRoutineById,
  fetchDailyTemplates,
  fetchDailyActivities,
  createDailyTemplates,
  createDailyActivities,
  fetchTemplatesById,
  fetchActivitiesById,
  updateTemplatesById,
  updateActivitiesById,
  deleteTemplatesById,
  deleteActivitiesById,
  markDailyActivityComplete,
  fetchTemplatesSuggestions,
  saveTemplateSuggestion,
  markAllNotificationAsRead,
  fetchDashboardStats,
  updateUserProfile


};