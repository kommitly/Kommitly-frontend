import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

import theme from './theme';
import { GoalsProvider } from './context/GoalsContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'


createRoot(document.getElementById('root')).render(
  <StrictMode>
   <BrowserRouter>

      <GoalsProvider> 
      <LocalizationProvider dateAdapter={AdapterDayjs}>
         <App />
      </LocalizationProvider>
      </GoalsProvider>
        
    
        </BrowserRouter>
  </StrictMode>,
)
