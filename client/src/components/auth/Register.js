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

  // Post request to server containing formData inputs
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
      // If there's an error, pass this message
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

          {/* Lock Avatar */}
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>

          {/* Register Header */}
          <Typography component="h1" variant="h5">
            Register
          </Typography>

          {/* User Inputs Form */}
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              
              {/* Username */}
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

              {/* Error message under username if it's a username error */}
              {errors.username && 
                <Grid item xs={12}>
                  <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography variant='p' sx={{ color: 'red' }}>{errors.username}</Typography>
                  </Container>
                </Grid>  
              }

              {/* Email */}
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

              {/* Error message under email if it's an email error */}
              {errors.email && 
                <Grid item xs={12}>
                  <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography variant='p' sx={{ color: 'red' }}>{errors.email}</Typography>
                  </Container>
                </Grid>  
              }

              {/* Password */}
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

              {/* Error message under password if it's a password error */}
              {errors.password && 
                <Grid item xs={12}>
                  <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography variant='p' sx={{ color: 'red' }}>{errors.password}</Typography>
                  </Container>
                </Grid>  
              }

              {/* Password Confirmation */}
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

              {/* Error message under password confirmation if it's a password confirmation error */}
              {errors.passwordConfirmation && 
                <Grid item xs={12}>
                  <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography variant='p' sx={{ color: 'red' }}>{errors.passwordConfirmation}</Typography>
                  </Container>
                </Grid>  
              }

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
      </Container>
    </ThemeProvider>
  )
}

export default Register