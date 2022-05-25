import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { getTokenFromLocalStorage, userIsAuthenticated, userIsOwner } from '../../helpers/auth.js'
import { useNavigate, useParams } from 'react-router-dom'
import { form, colors, regions, waterTypes, soilTypes, sunTypes, lifespanTypes, moodTypes } from '../../helpers/plantFormOptions'
import { handleUnitChange, handleSizeChange, handleChange, handleImageUpload, handleDelete } from '../../helpers/plantForm.js'

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
import IconButton from '@mui/material/IconButton'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import { styled } from '@mui/material/styles'

const PlantEdit = () => {

  // Styling Input so it won't display
  const Input = styled('input')({
    display: 'none',
  })

  // Cloudinary URL and Preset
  const uploadURL = process.env.REACT_APP_CLOUDINARY_URL
  const preset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET

  // params and navigate
  const { plantId } = useParams()
  const navigate = useNavigate()

  // for image display centering
  const windowInnerWidth = window.innerWidth
  const marginImageLeft = windowInnerWidth > 700 ? 4 : 0

  // Tells if the form is loaded
  const [ formLoaded, setFormLoaded ] = useState(false)

  // The form data
  const [ formData, setFormData ] = useState(form)
  
  // Error Handling
  const [ errors, setErrors ] = useState(false) // GET request errors
  const [ putErrors, setPutErrors ] = useState(false) // PUT or Delete request errors

  // For image handling
  const [ displayImage, setDisplayImage ] = useState('')

  // Setting units for height/width
  const [ matureSize, setMatureSize ] = useState({ height: formData.height, width: formData.width })
  const [ unit, setUnit ] = useState('in')
  const [ max, setMax ] = useState(150)
  const [ step, setStep ] = useState(10)

  // Get existing form data from API and populate in form
  useEffect(() => {
    const getFormData = async () => {
      try {
        const { data } = await axios.get(`/api/plants/${plantId}`)
        setFormData(data)
        setFormLoaded(true)
        setMatureSize({ height: data.height, width: data.width })
      } catch (error) {
        console.log(error)
        setErrors(true)
      }
    }
    getFormData()
  }, [plantId])

  // Navigate back to the plant if the user is not logged in
  useEffect(() => {
    if (formLoaded) {
      !userIsAuthenticated(formData) && navigate(`/plants/${plantId}`)
    }
  }, [formData, formLoaded, plantId])

  // Submitting the form
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Create a new form in case there is a new image to upload
    let newForm = { ...formData }

    // If there is a new image, upload it to Cloudinary and save the results
    // Doing this hear instead of in handleImageUpload so that only submitted images are uploaded to the database
    if (displayImage) {
      const data = new FormData()
      data.append('file', formData.images)
      data.append('upload_preset', preset)
      const res = await axios.post(uploadURL, data)
      setFormData({ ...formData, images: res.data.url })
      newForm = { ...newForm, images: res.data.url }
    }

    // Update plant data with info from newForm
    try {
      const response = await axios.put(`/api/plants/${plantId}`, newForm, {
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      })
      console.log(response)

      // Navigate back to the edited plant when the update is complete
      navigate(`/plants/${plantId}`)
    } catch (error) {
      console.log(error)

      // update the setPutErrors state if the update fails
      setPutErrors(true)
    }
  }

  return (
    <>
      {/* If there are errors getting the data, give an error message */}
      {errors ?
        <>
          <Grid item xs={12} sx={{ my: '10%' }} >
            <Container sx={{ display: 'flex', justifyContent: 'center' }}>
              <Typography sx={{ color: 'red' }}>Error. Failed fetch plant data.</Typography>
            </Container>
          </Grid>
        </>
        :

        // If no errors, load the plant edit form
        <>
          <Container sx={{ display: 'flex', justifyContent: 'center' }}>
            <Paper elevation={6} sx={{ m: 5, py: 3, backgroundColor: 'cream', maxWidth: 'sm' }} >
              <Box
                component='form'
                sx={{ width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center' }}
                onSubmit={handleSubmit}
              >

                {/* Header: Edit a Plant */}
                <Typography variant='h3' sx={{ pb: 2 }}>Edit a Plant</Typography>
                <Grid
                  container
                  sx={{ width: .90 }}
                  rowSpacing={1}
                  columnSpacing={1}>

                  {/* This must be first input So that the file upload only fires when you press the button */}
                  <>
                    <Input type="text" autoFocus="autoFocus" />
                  </>
                  
                  {/* Plant Name */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      id='name'
                      label='Common Name'
                      variant='outlined'
                      name='name'
                      value={formData.name}
                      required
                      onChange={(e) => handleChange(e, setPutErrors, setFormData, formData)}
                      fullWidth />
                  </Grid>

                  {/* Scientific Name */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      id='scientificName' 
                      label='Scientific Name'
                      variant='outlined'
                      name='scientificName'
                      value={formData.scientificName}
                      required
                      onChange={(e) => handleChange(e, setPutErrors, setFormData, formData)}
                      fullWidth />
                  </Grid>

                  {/* Description */}
                  <Grid item xs={12}>
                    <TextField
                      id='description' 
                      label='Description'
                      variant='outlined'
                      name='description'
                      value={formData.description}
                      required
                      multiline
                      inputProps={{ maxLength: 1000 }}
                      minRows={2}
                      maxRows={4}
                      onChange={(e) => handleChange(e, setPutErrors, setFormData, formData)}
                      fullWidth />
                  </Grid>

                  {/* Images */}
                  <Grid item xs={12} sx={{ my: 2, ml: marginImageLeft, textAlign: 'center' }} >

                    {/* If there is a new image to display, then display it */}
                    {displayImage ? 
                      <Box component='img' src={displayImage} alt='Image to upload' sx={{ height: '300px', width: '300px', objectFit: 'cover' }} />
                      :
                      // Else if there's an image on formData, display that one
                      <>
                        {formData.images ? 
                          <Box component='img' src={formData.images} alt='Image to upload' sx={{ height: '300px', width: '300px', objectFit: 'cover' }} />
                          :
                          <></>
                        }
                      </>
                    }

                    {/* The upload image button */}
                    <label htmlFor="contained-button-file">
                      <Input accept="image/*" id="contained-button-file" multiple type="file" onChange={(e) => handleImageUpload(e, setDisplayImage, setFormData, formData)} />
                      
                      {/* If there's an image on formData, display upload button as an icon, else make it a button with "Upload Image" as the prompt */}
                      {formData.images ? 
                        <IconButton aria-label="upload picture" component="span" sx={{ bottom: 25, right: 50, border: 2, borderColor: 'white', boxShadow: 3, backgroundColor: 'rgba(170,170,170,0.5)' }} >
                          <PhotoCamera />
                        </IconButton>
                        :
                        <Button variant="contained" component="span">
                          Upload Image
                        </Button>
                      }
                    </label>
                  </Grid>

                  {/* Water Requirements */}
                  <Grid item xs={12} md={4}>
                    <FormControl required fullWidth>
                      <InputLabel id="water-label">Water</InputLabel>
                      <Select
                        labelId="water-label"
                        id="water"
                        name='watering'
                        value={formData.watering}
                        label='water'
                        onChange={(e) => handleChange(e, setPutErrors, setFormData, formData)}
                      >
                        {waterTypes.map(type => <MenuItem value={type} key={type}>{type}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Sun Exposure */}
                  <Grid item xs={12} md={4}>
                    <FormControl required fullWidth>
                      <InputLabel id="sunExposure-label">Sun Exposure</InputLabel>
                      <Select
                        labelId="sunExposure-label"
                        id="sunExposure"
                        name='sunExposure'
                        value={formData.sunExposure}
                        label='sunExposure'
                        onChange={(e) => handleChange(e, setPutErrors, setFormData, formData)}
                      >
                        {sunTypes.map(type => <MenuItem value={type} key={type}>{type}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Soil Type */}
                  <Grid item xs={12} md={4}>
                    <FormControl required fullWidth>
                      <InputLabel id="soilType-label">Soil Type</InputLabel>
                      <Select
                        labelId="soilType-label"
                        id="soilType"
                        name='soilType'
                        value={formData.soilType}
                        label='soilType'
                        onChange={(e) => handleChange(e, setPutErrors, setFormData, formData)}
                      >
                        {soilTypes.map(type => <MenuItem value={type} key={type}>{type}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Lifespan */}
                  <Grid item xs={12} md={6}>
                    <FormControl required fullWidth>
                      <InputLabel id="lifespan-label">Lifespan</InputLabel>
                      <Select
                        labelId="lifespan-label"
                        id="lifespan"
                        name='lifespan'
                        value={formData.lifespan}
                        label='lifespan'
                        onChange={(e) => handleChange(e, setPutErrors, setFormData, formData)}
                      >
                        {lifespanTypes.map(type => <MenuItem value={type} key={type}>{type}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Mood */}
                  <Grid item xs={12} md={6}>
                    <FormControl required fullWidth>
                      <InputLabel id="mood-label">Mood</InputLabel>
                      <Select
                        labelId="mood-label"
                        id="mood"
                        name='mood'
                        value={formData.mood}
                        label='soilType'
                        onChange={(e) => handleChange(e, setPutErrors, setFormData, formData)}
                      >
                        {moodTypes.map(type => <MenuItem value={type} key={type}>{type}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Flower Colors */}
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="flowerColor">Flower Color</InputLabel>
                      <Select
                        labelId="flowerColor"
                        id="flowerColor"
                        multiple
                        name="flowerColor"
                        value={formData.flowerColor}
                        onChange={(e) => handleChange(e, setPutErrors, setFormData, formData)}
                        input={<OutlinedInput id="color" label="Color" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                      >
                        {colors.map((color) => (
                          <MenuItem
                            key={color}
                            value={color}
                          >
                            {color}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Height */}
                  <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography id="height-slider" gutterBottom>
                      Height: {matureSize.height} {unit}
                    </Typography>
                    <Slider
                      value={matureSize.height}
                      onChange={(e) => handleSizeChange(e, setMatureSize, matureSize, setFormData, formData, unit)}
                      valueLabelDisplay="auto"
                      name='height'
                      size="small"
                      min={1}
                      max={max}
                      marks
                      step={step}
                      sx={{ width: .9, align: 'center' }}
                    />
                  </Grid>

                  {/* Width */}
                  <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography id="width-slider" gutterBottom>
                      Width: {matureSize.width} {unit}
                    </Typography>
                    <Slider
                      value={matureSize.width}
                      onChange={(e) => handleSizeChange(e, setMatureSize, matureSize, setFormData, formData, unit)}
                      valueLabelDisplay="auto"
                      name='width'
                      size="small"
                      min={1}
                      max={max}
                      marks
                      step={step}
                      sx={{ width: .9, align: 'center' }}
                    />
                  </Grid>

                  {/* Unit Toggler */}
                  <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Container>
                      <ToggleButtonGroup value={unit} exclusive onChange={(e) => handleUnitChange(e, matureSize, setMatureSize, setMax, setStep, setUnit)} aria-label="measurement unit">
                        <ToggleButton value="in" aria-label="inches" size="small">
                          in
                        </ToggleButton>
                        <ToggleButton value="cm" aria-label="centimeter" size="small">
                          cm
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </Container>
                  </Grid>

                  {/* Native Area */}
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="nativeArea">Native Area</InputLabel>
                      <Select
                        labelId="nativeArea"
                        id="nativeArea"
                        multiple
                        name="nativeArea"
                        value={formData.nativeArea}
                        onChange={(e) => handleChange(e, setPutErrors, setFormData, formData)}
                        input={<OutlinedInput id="regions" label="Regions" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                      >
                        {regions.map((region) => (
                          <MenuItem
                            key={region}
                            value={region}
                          >
                            {region}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Is Indoor? */}
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <FormControlLabel control={
                      <Checkbox value={formData.isIndoor} onChange={(e) => handleChange(e, setPutErrors, setFormData, formData)} />
                    } label="Can Be Indoor Plant?" />
                  </Grid>

                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Button variant="contained" type="submit" size='large' sx={{ width: .70, mx: 2 }}>Submit</Button>
                      { !formLoaded ? '' : userIsOwner(formData) ? <Button variant="contained" onClick={(e) => handleDelete(e, navigate, setPutErrors, plantId)} size='small' sx={{ width: .70, mx: 2, backgroundColor: 'red' }}>Delete</Button> : ''}
                    </Container>
                  </Grid>
                      

                  {/* Error message under submit if updating the plant fails */}
                  {putErrors && 
                    <Grid item xs={12}>
                      <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography sx={{ color: 'red' }}>Error. Failed to upload updated plant.</Typography>
                      </Container>
                    </Grid>
                  }
                </Grid>
              </Box>
            </Paper>
          </Container>
        </>
      }
    </>
  )
}

export default PlantEdit