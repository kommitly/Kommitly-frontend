import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

import theme from './theme';
import { GoalsProvider } from './context/GoalsContext';


createRoot(document.getElementById('root')).render(
  <StrictMode>
   <BrowserRouter>

      <GoalsProvider> 
         <App />
      </GoalsProvider>
        
    
        </BrowserRouter>
  </StrictMode>,
)
