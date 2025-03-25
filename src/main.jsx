import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'


import { GoalsProvider } from './context/GoalsContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { TasksProvider } from './context/TasksContext.jsx'  
import { AuthProvider } from './context/AuthContext.jsx'
import { ProfileProvider } from './context/ProfileContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter> {/* Router comes first */}
    <AuthProvider> {/* Now inside the Router */}
      <ProfileProvider>
      <GoalsProvider> 
        <TasksProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <App />
          </LocalizationProvider>
        </TasksProvider>
      </GoalsProvider>
      </ProfileProvider>
    </AuthProvider>
  </BrowserRouter>
</StrictMode>,
)
