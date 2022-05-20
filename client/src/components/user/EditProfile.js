import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

import { getPayload, getTokenFromLocalStorage, userIsOwner } from '../../helpers/auth'

// MUI Imports
import Container from '@mui/material/InputLabel'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import Slider from '@mui/material/Slider'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import OutlinedInput from '@mui/material/OutlinedInput'
import Chip from '@mui/material/Chip'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Paper from '@mui/material/Paper'

const EditProfile = () => {

  const { username } = useParams()
  console.log('username from params is: ', username)

  const payload = getPayload()

  const navigate = useNavigate()

  const [ formData, setFormData ] = useState({
    username: username,
    image: payload.profilePicture,
    bio: payload.bio,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put(`/api/profile/${payload.sub}`, formData, {
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      })
      console.log(response)
      navigate(`/profile/${username}`)
    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleCancel = async (e) => {
    e.preventDefault()
    navigate(`/profile/${username}`)
  }


  return (
    <Container maxWidth='sm' sx={{ display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ m: 5, py: 3, backgroundColor: 'cream' }} >
        <Box
          component='form'
          sx={{ width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center' }}
          onSubmit={handleSubmit}
        >
          <Typography variant='h3' sx={{ pb: 2 }}>Edit Profile</Typography>
          <Grid
            container
            sx={{ width: .90 }}
            rowSpacing={1}
            columnSpacing={1}>
            {/* Username */}
            <Grid item xs={12}>
              <TextField
                id='username'
                placeholder='Username * (max 30 characters)'
                variant='outlined'
                name='username'
                value={formData.username}
                required
                onChange={handleChange}
                fullWidth />
            </Grid>
            {/* Bio */}
            <Grid item xs={12}>
              <TextField
                id='bio' 
                placeholder='Bio * (max 150 characters)'
                variant='outlined'
                name='bio'
                value={formData.bio}
                required
                onChange={handleChange}
                fullWidth />
            </Grid>
            {/* Images */}
            <Grid item xs={12}>
              <TextField id='image'
                placeholder='Image URL *'
                variant='outlined'
                name='image'
                value={formData.image}
                required
                onChange={handleChange}
                fullWidth />
            </Grid>
            {/* Submit Button */}
            <Grid item xs={12}>
              <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="contained" type="submit" size='large' sx={{ width: .70, mx: 2 }}>Submit</Button>
                <Button variant="contained" onClick={handleCancel} size='small' sx={{ width: .70, mx: 2, backgroundColor: 'red' }}>Cancel</Button>
              </Container>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  )
}

export default EditProfile