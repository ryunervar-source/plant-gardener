import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { PlantsProvider } from './hooks/usePlants.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <PlantsProvider>
        <App />
      </PlantsProvider>
    </HashRouter>
  </React.StrictMode>,
)
