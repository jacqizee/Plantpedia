import React from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Import Components
import PageNavbar from './components/common/PageNavbar'
import Home from './components/Home'
import PlantShow from './components/plants/PlantShow'
import PlantAdd from './components/plants/PlantAdd'
import PlantEdit from './components/plants/PlantEdit'
import NotFound from './components/common/NotFound'

// Auth components
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import UserProfile from './components/user/UserProfile'

const App = () => {

  return (
    <main className='site-wrapper'>
      <BrowserRouter>
        <PageNavbar />
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

          
          {/* The following path matches any path specified, so it needs to come last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </main>
  )
}

export default App
