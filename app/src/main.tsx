import { AlertDialog } from '@radix-ui/react-alert-dialog'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { StatusComponent } from './components/status.tsx'
import './globals.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(

  <React.StrictMode>
    <AlertDialog>
      <App />
      <StatusComponent />
    </AlertDialog>
  </React.StrictMode>,
)
