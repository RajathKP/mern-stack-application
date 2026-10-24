import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import CreateUser from './CreateUser.jsx'

import LoginPage from './LoginPage.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
   {/* <App/> */}

  <LoginPage/>

  </StrictMode>,
)
