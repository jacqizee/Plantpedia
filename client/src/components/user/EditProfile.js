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
import IconButton from '@mui/material/IconButton'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import OutlinedInput from '@mui/material/OutlinedInput'
import Chip from '@mui/material/Chip'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Paper from '@mui/material/Paper'
import AddIcon from '@mui/icons-material/Add'
import { styled } from '@mui/material/styles'

const EditProfile = () => {

  const Input = styled('input')({
    display: 'none',
  })

  const { username } = useParams()
  // console.log('username from params is: ', username)

  const payload = getPayload()

  const navigate = useNavigate()

  const uploadURL = process.env.REACT_APP_CLOUDINARY_URL
  const preset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET

  console.log(uploadURL, preset)

  //loading and error state
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(false)

  const [ formData, setFormData ] = useState({
    username: username,
    image: payload.profilePicture,
    bio: '',
  })

  useEffect(() => {
    const getData = async () => {
      try {
        if (!payload) {
          navigate('/login')
        }
        console.log('payload is: ', payload)
        console.log('payload.sub is: ', payload.sub)

        const { data } = await axios.get(`/api/profile/${payload.sub}`, {
          headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          },
        })

        console.log('retrieved data is: ', data)

        setFormData(
          { 
            ...formData,
            bio: data.bio,
          }
        )

      } catch (error) {
        console.log(error)
        setErrors(true)
      }
      setLoading(false)
    }
    getData()
  }, [])

  const handleImageUpload = async e => {
    
    const data = new FormData()


    // console.log('e target file 0 is: ', e.target.files[0])
    console.log('upload preset is: ', preset)
    
    data.append('file', e.target.files[0])
    data.append('upload_preset', preset)

    const res = await axios.post(uploadURL, data)

    console.log(res.data)
    // Set the profileImage url to state
    setFormData({ ...formData, image: res.data.url })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put(`/api/profile/${payload.sub}`, formData, {
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      })
      console.log(response)

      console.log('response token is: ', response.data.token)

      const token = response.data.token


      window.localStorage.removeItem('plantpedia')
      localStorage.setItem('plantpedia', token)

      console.log('this fires')
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
            {/* <Grid item xs={12}>
              <TextField
                id='username'
                placeholder='Username * (max 30 characters)'
                variant='outlined'
                name='username'
                value={formData.username}
                required
                onChange={handleChange}
                fullWidth />
            </Grid> */}
            {/* Images */}
            <Grid item xs={12} sx={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
              <Box component='img' src={formData.image} alt='Image to upload' sx={{ height: '300px', width: '300px', objectFit: 'cover' }} />
              <label htmlFor="icon-button-file">
                <Input accept="image/*" id="icon-button-file" type="file" onChange={handleImageUpload} />
                <IconButton aria-label="upload picture" component="span" sx={{ position: 'absolute', top: 145, left: 315 }} >
                  <PhotoCamera />
                </IconButton>
              </label>
            </Grid>

            {/* Bio */}
            <Grid item xs={12} sx={{ my: 1 }}>
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

            {/* Submit Button */}
            <Grid item xs={12}>
              <Container sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                <Button variant="contained" type="submit" size='large' sx={{ width: .48, mx: 0 }}>Submit</Button>
                <Button variant="contained" onClick={handleCancel} size='small' sx={{ width: .48, mx: 0, backgroundColor: 'red' }}>Cancel</Button>
              </Container>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  )
}

export default EditProfile