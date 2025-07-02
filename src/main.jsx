import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ProSidebarProvider } from 'react-pro-sidebar';


import { GoalsProvider } from './context/GoalsContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { TasksProvider } from './context/TasksContext.jsx'  
import { AuthProvider } from './context/AuthContext.jsx'
import { ProfileProvider } from './context/ProfileContext.jsx'
import { ImportContactsRounded } from '@mui/icons-material'
import { GoogleOAuthProvider } from '@react-oauth/google';


const clientId= "501169252647-til0o67ldlrpmnbd08td1o4anhnkjpr8.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <GoogleOAuthProvider clientId={clientId}>
  <BrowserRouter> {/* Router comes first */}
  <ProSidebarProvider>
 
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
    </ProSidebarProvider>


   
  </BrowserRouter>
  </GoogleOAuthProvider>
</StrictMode>,
)
