import { React, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import getDesignTokens from './helpers/theme.js'

// Import Components
import PageNavbar from './components/common/PageNavbar'
import Home from './components/Home'
import PlantShow from './components/plants/PlantShow'
import PlantAdd from './components/plants/PlantAdd'
import PlantEdit from './components/plants/PlantEdit'
import NotFound from './components/common/NotFound'
import Footer from './components/common/Footer'
import UserProfile from './components/user/UserProfile'
import EditProfile from './components/user/EditProfile'
import EditorApplication from './components/user/EditorApplication'

// Auth components
import Register from './components/auth/Register'
import Login from './components/auth/Login'

//MUI
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Box from '@mui/material/Box'

const App = () => {
  const [mode, setMode] = useState('light')
  const darkTheme = createTheme(getDesignTokens(mode))

  return (
    <ThemeProvider theme={darkTheme}>
      <Box id='wrapper-box' bgcolor='background.default' color='text.primary'>
        <BrowserRouter>
          <PageNavbar setMode={setMode} mode={mode} />
          <Routes>
            {/* Homepage */}
            <Route path="/" element={<Home />} />

            {/* Auth routes - starting with register */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Plant routes */}
            <Route path="/plants/:id" element={<PlantShow />} />
            <Route path="/plants/add" element={<PlantAdd />} />
            <Route path="/plants/:plantId/edit" element={<PlantEdit />} />

            {/* User routes */}
            <Route path="/profile/:username" element={<UserProfile />} />
            <Route path="/profile/:username/edit" element={<EditProfile />} />
            <Route path="/become-editor" element={<EditorApplication />} />


            {/* The following path matches any path specified, so it needs to come last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  )
}

export default App
// primary: {
//   main: '#1b5e20',
// },
// secondary: {
//   main: '#689f38',
// },