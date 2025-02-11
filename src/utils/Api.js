import axios from 'axios';

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM5MDYzMjA1LCJpYXQiOjE3Mzg0NTg0MDUsImp0aSI6IjI5NjRiYzE2MjQ2YjRlMjE5ZDYwOGQ2YTAxZjQzYzA0IiwidXNlcl9pZCI6Ijg3OWJmOGIxLTkzYWItNDIzOC1iZTJjLWRlNjViZTQwZDk1ZSJ9.9lhn5Fsm9TPKYJOkpYEyX89tBqiC_2yJV-abIjVIca4";


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

export { generateInsights, createGoal, fetchGoals, fetchGoalById };