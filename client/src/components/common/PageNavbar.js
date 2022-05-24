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

// Import logo image
import logo from '../../images/logo.png'
import { getPayload, userIsAuthenticated } from '../../helpers/auth'

const pagesNoLogin = ['Login', 'Register']
const settings = ['Profile', 'Logout']

const PageNavbar  = () => {

  // Navigate
  const navigate = useNavigate()

  // Payload
  const payload = getPayload()

  const [anchorElNav, setAnchorElNav] = useState(null)
  const [anchorElUser, setAnchorElUser] = useState(null)

  const handleAdd = (event) => {
    setAnchorElNav(event.currentTarget)
    navigate('/plants/add')
  }

  const handleNavClick = (event) => {
    const pageName = event.currentTarget.innerText.toLowerCase()
    if (pageName === 'login' || pageName === 'register') {
      handleCloseUserMenu()

      navigate(`/${pageName}`)
    } else if (pageName === 'profile') {
      handleCloseUserMenu()

      navigate(`/${pageName}/${payload.username}`, { replace: true })
      window.location.reload()
    } else if (pageName === 'logout') {
      handleCloseUserMenu()

      window.localStorage.removeItem('plantpedia')
      navigate('/login')
    }
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl" sx={{ fontFamily: 'Domine' }}>
        <Toolbar disableGutters>
          
          {/* Logo */}
          <Container sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <Box as={Link} to="/" sx={{ width: 35 }}>
              <Box component='img' src={logo} alt="Logo" />
            </Box>
            <Typography as={Link} to='/'
              variant='h6'
              component='h1'
              sx={{ ml: 2, color: 'white', fontFamily: 'Josefin Sans',
                fontWeight: 600, letterSpacing: 1, textDecoration: 'none' }}>
                  Plantpedia
            </Typography>
          </Container>
          

          {userIsAuthenticated() ? 
            <>
              {/* Menu Items */}
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
              {/* Pages Shown */}
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