import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.scss'
import App from './App'
import { theme } from './helpers/theme.js'
import { ThemeProvider } from '@mui/material/styles'

createRoot(document.getElementById('root')).render(<ThemeProvider theme={theme}> <App /></ThemeProvider> )