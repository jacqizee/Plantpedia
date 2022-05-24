import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import Container from '@mui/material/InputLabel'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import TextareaAutosize from '@mui/material/TextareaAutosize'

import { getPayload, getTokenFromLocalStorage } from '../../helpers/auth'
import { maxWidth } from '@mui/system'
import Spinner from '../utilities/Spinner.js'

const EditorApplication = () => {

  const navigate = useNavigate()
  const [ formData, setFormData ] = useState({
    firstName: '',
    lastName: '',
    text: 'I would like editing permissions because: ',
  })
  const [hasApplied, setHasApplied] = useState(false)

  //loading and error state
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(false) // Get data errors
  const [postErrors, setPostErrors] = useState(false) // Post data errors

  const payload = getPayload()

  //Download user data to see if the user has already applied
  useEffect(() => {
    const getData = async () => {
      try {
        if (!payload) {
          navigate('/login')
        }

        const { data } = await axios.get(`/api/profile/${payload.sub}`, {
          headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          },
        })
        setHasApplied(data.hasApplied)

      } catch (error) {
        console.log(error)
        setErrors(true)
      }
      setLoading(false)
    }
    getData()
  }, [])

  //Update the state each time any of the fields are changed
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  //Submit application form to the /editor-application root
  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('form data is: ', formData)

    //Throw an error if fields aren't populated
    if (!formData.first || !formData.lastName || !formData.text) {
      console.log('this runs 🏃🏻‍♂️')
    } 

    try {
      const response = await axios.post('/api/editor-application', formData, {
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      })
      console.log(response)
      navigate(-1)
    } catch (error) {
      console.log(error)
      console.log('this runs 🏃🏻‍♂️')
      setPostErrors(true)
    }
  }

  return (
    <Container maxWidth='lg' sx={{ display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ m: 5, py: 3, backgroundColor: 'cream', maxWidth: 'sm' }} >
        <Box
          component='form'
          sx={{ width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center' }}
          onSubmit={handleSubmit}
        >
          <Typography variant='h4' sx={{ pb: 2 }}>Get Editor Permissions</Typography>
          
          {!hasApplied ? 
            <>
              <Grid
                container
                sx={{ width: .90 }}
                rowSpacing={1}
                columnSpacing={1}>
                {/* First Name */}
                <Grid item xs={12} md={6}>
                  <TextField
                    id='firstName'
                    label='First Name'
                    variant='outlined'
                    name='firstName'
                    value={formData.firstName}
                    required
                    onChange={handleChange}
                    fullWidth />
                </Grid>

                {/* Last Name */}
                <Grid item xs={12} md={6}>
                  <TextField
                    id='lastName' 
                    label='Last Name'
                    variant='outlined'
                    name='lastName'
                    value={formData.lastName}
                    required
                    onChange={handleChange}
                    fullWidth />
                </Grid>

                {/* TextArea: Tell Us Why */}
                <Grid item xs={12} >
                  <TextareaAutosize
                    name='text'
                    minRows={4}
                    maxRows={10}
                    maxLength={1000}
                    aria-label="maximum height"
                    placeholder="Maximum 4 rows"
                    defaultValue={formData.text}
                    required
                    onChange={handleChange}
                    style={{ width: '100%' }}
                  />
                </Grid>
                {/* Submit Button */}
                <Grid item xs={12}>
                  <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" type="submit" size='large' sx={{ width: .70 }}>Submit</Button>
                  </Container>
                </Grid>

                {postErrors && <Typography>Error. Failed to submit application. All fields must be filled out.</Typography>}
              </Grid>
            </>
            :
            <>
              <Grid
                container
                sx={{ width: .90, display: 'flex', justifyContent: 'center' }}
                rowSpacing={1}
                columnSpacing={1}>
                <Grid item xs={12} >
                  <Typography align='center'>Your application is being processed</Typography>
                </Grid>
                <Container maxWidth='md' sx={{ display: 'flex', justifyContent: 'center', my: '10%' }}>
                  <Spinner />
                </Container>
              </Grid>
            </>
          }
        </Box>
      </Paper>
    </Container>
  )
}

export default EditorApplication