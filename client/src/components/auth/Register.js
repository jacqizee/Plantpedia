import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const theme = createTheme()

const Register = () => {

  // Navigate
  const navigate = useNavigate()

  // Form data passed by user
  const [ formData, setFormData ] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  })

  // State that tracks errors on specific fields
  const [ errors, setErrors ] = useState({})

  // Update formData
  const handleChange = (e) => {
    console.log('handle change fires')
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log('submit pressed')

    if (formData.username && formData.email && formData.password && formData.passwordConfirmation) {
      try {
        console.log('form data is: ', formData)
        await axios.post('/api/register', formData)
        navigate('/login')
      } catch (err) {
        console.log('err: ', err)
        const errorObj = err.response.data.errors
        // console.log(Object.keys(errorObj)[0], errorObj[Object.keys(errorObj)[0]].message)
        setErrors({ ...errors, [Object.keys(errorObj)[0]]: errorObj[Object.keys(errorObj)[0]].message })
      }
    } else {
      setErrors({ ...errors, passwordConfirmation: 'All fields are required' })
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="username"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                  value={formData.username} 
                  onChange={handleChange}
                />
              </Grid>
              {errors.username && <Typography variant='p'>{errors.username}</Typography>}

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email} 
                  onChange={handleChange}
                />
              </Grid>
              {errors.email && <Typography variant='p'>{errors.email}</Typography>}

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password} 
                  onChange={handleChange}
                />
              </Grid>
              {errors.password && <Typography variant='p'>{errors.password}</Typography>}

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="passwordConfirmation"
                  label="Password Confirmation"
                  type="password"
                  id="passwordConfirmation"
                  autoComplete="new-password"
                  value={formData.passwordConfirmation} 
                  onChange={handleChange}
                />
              </Grid>
              {errors.passwordConfirmation && <Typography variant='p'>{errors.passwordConfirmation}</Typography>}

            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Log in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  )
}

export default Register