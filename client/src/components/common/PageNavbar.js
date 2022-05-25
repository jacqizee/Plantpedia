import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import AddIcon from '@mui/icons-material/Add'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'

// Import logo image
import logo from '../../images/logo.png'
import { getPayload, userIsAuthenticated } from '../../helpers/auth'




const pagesNoLogin = ['Login', 'Register']
const settings = ['Profile', 'Logout']

const PageNavbar  = ({ mode, setMode }) => {
  
  //light/dark
  const handleChangeMode = () => {
    mode === 'light' ? setMode('dark') : setMode('light')
  }

  // Navigate
  const navigate = useNavigate()

  // Payload
  const payload = getPayload()

  // Keeps track of menu
  const [anchorElUser, setAnchorElUser] = useState(null)

  // Navigate to the add plant page when + is pressed
  const handleAdd = (event) => {
    navigate('/plants/add')
  }

  //Navigate to different pages depending on which menu item is clicked
  const handleNavClick = (event) => {

    // converting page name to lower case
    const pageName = event.currentTarget.innerText.toLowerCase()

    if (pageName === 'login' || pageName === 'register') {
      handleCloseUserMenu()

      //If login or register navigate to thos pages
      navigate(`/${pageName}`)
    } else if (pageName === 'profile') {
      handleCloseUserMenu()

      //If profile, navigate to the user's profile
      navigate(`/${pageName}/${payload.username}`, { replace: true })
      
      
    } else if (pageName === 'logout') {
      handleCloseUserMenu()

      //Remove token from local storage upon logout
      window.localStorage.removeItem('plantpedia')

      //Navigate to the login screen upon logout
      navigate('/login')
    }
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  // Closes the user menu on the right hand side
  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl" sx={{ fontFamily: 'Domine' }}>
        <Toolbar disableGutters>
          
          {/* Logo */}
          <Container sx={{ display: 'flex', alignItems: 'flex-end' }}>

            {/* Icon image */}
            <Box as={Link} to="/" sx={{ width: 35 }}>
              <Box component='img' src={logo} alt="Logo" />
            </Box>

            {/* Plantpedia text */}
            <Typography as={Link} to='/'
              variant='h6'
              component='h1'
              sx={{ ml: 2, color: 'white', fontFamily: 'Josefin Sans',
                fontWeight: 600, letterSpacing: 1, textDecoration: 'none' }}>
                  Plantpedia
            </Typography>
          </Container>

          {/* Dark Mode or Light Mode Toggle */}
          <IconButton onClick={handleChangeMode}>
            {mode === 'light' ? <DarkModeIcon sx={{ color: 'white' }} /> : <LightModeIcon />}
            
          </IconButton>
          
          {/* If user is logged in, shows user menu, otherwise it shows login and register options on right side of navbar */}
          {userIsAuthenticated() ? 
            <>

              {/* If user is logged in... */}

              {/* + Button */}
              <Box sx={{ flexGrow: 1, justifyContent: 'end', display: 'flex', mr: 1 }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleAdd}
                  color="inherit"
                >
                  <AddIcon />
                </IconButton>
              </Box>

              {/* Profile image */}
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, mr: 3, boxShadow: 2 }}>
                    <Avatar alt={payload.username} src={payload.profilePicture} />
                  </IconButton>
                </Tooltip>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {/* Settings on Profile Click */}
                  {settings.map((setting, i) => (
                    <MenuItem key={i} onClick={handleNavClick}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </>
            :
            <>
              {/* If user is not logged in */}

              {/* Login and Register Pages Shown */}
              <Box sx={{ flexGrow: 1, justifyContent: 'end', display: 'flex', mr: 3 }}>
                {pagesNoLogin.map((page, index) => (
                  <Button
                    key={index}
                    onClick={handleNavClick}
                    sx={{ my: 2, color: 'white', display: 'block', fontFamily: 'Raleway' }}
                  >
                    {page}
                  </Button>
                ))}
              </Box>
            </>
          }
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default PageNavbar