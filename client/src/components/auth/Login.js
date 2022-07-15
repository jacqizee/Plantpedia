import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'


const theme = createTheme()

const Login = () => {
  // Navigate
  const navigate = useNavigate()

  // Form data passed by user
  const [ formData, setFormData ] = useState({
    email: '',
    password: '',
  })

  //Error Handling
  const [ errors, setErrors ] = useState(false)


  //Save to local storage
  const setTokenToLocalStorage = (token) => {
    window.localStorage.setItem('plantpedia', token)
  }

  //Submit request
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.email && formData.password) {
      try {
        const { data } = await axios.post('api/login', formData)
        
        setTokenToLocalStorage(data.token)
        
        navigate('/')
      } catch (err) {
        console.log(err)
        setErrors(true)
      }
    } else {
      setErrors(true)
    }
  }

  // ? Handle change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors(false)
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: 'calc(100vh - 100px)',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Log In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email} 
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password} 
            onChange={handleChange}
          />
          {errors && 
            <Grid item xs={12}>
              <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography sx={{ color: 'red' }}>Unauthorised.</Typography>
              </Container>
            </Grid>  
          }
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/register" variant="body2">
                {'No account yet? Sign Up'}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}

export default Login