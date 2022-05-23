import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { getTokenFromLocalStorage, userIsAuthenticated, userIsOwner } from '../../helpers/auth.js'
import { useNavigate, useParams } from 'react-router-dom'
import { form, colors, regions, waterTypes, soilTypes, sunTypes, lifespanTypes, moodTypes } from '../../helpers/plantFormOptions'

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

  const Input = styled('input')({
    display: 'none',
  })

  const uploadURL = process.env.REACT_APP_CLOUDINARY_URL
  const preset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET

  const { plantId } = useParams()
  const navigate = useNavigate()

  const [ formLoaded, setFormLoaded ] = useState(false)
  const [ formData, setFormData ] = useState(form)

  // For image handling
  const [ displayImage, setDisplayImage ] = useState('')

  // Setting units for height/width
  const [ matureSize, setMatureSize ] = useState({ height: formData.height, width: formData.width })
  const [ unit, setUnit ] = useState('in')
  const [ max, setMax ] = useState(150)
  const [ step, setStep ] = useState(10)
  
  const handleUnitChange = (e) => {
    const { height, width } = matureSize
    setUnit(e.target.value)
    if (e.target.value === 'in') {
      setMatureSize({ height: Math.ceil(height / 2.54), width: Math.ceil(width / 2.54) })
      setMax(150)
      setStep(10)
    } else if (e.target.value === 'cm') {
      setMatureSize({ height: Math.ceil(height * 2.54), width: Math.ceil(width * 2.54) })
      setMax(380)
      setStep(20)
    }
  }

  const handleSizeChange = (e) => {
    const { name, value } = e.target
    setMatureSize({ ...matureSize, [name]: value })
    if (unit === 'cm') {
      setFormData({ ...formData, [name]: Math.ceil(value / 2.54) })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

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
      }
    }
    getFormData()
  }, [plantId])

  useEffect(() => {
    if (formLoaded) {
      !userIsAuthenticated(formData) && navigate(`/plants/${plantId}`)
    }
  }, [formData, formLoaded, plantId])

  const handleSubmit = async (e) => {
    e.preventDefault()

    let newForm = { ...formData }

    if (displayImage) {
      const data = new FormData()
      data.append('file', formData.images)
      data.append('upload_preset', preset)
      const res = await axios.post(uploadURL, data)
      console.log('cloudinary response: ', res.data)
      setFormData({ ...formData, images: res.data.url })
      newForm = { ...newForm, images: res.data.url }
    }

    try {
      const response = await axios.put(`/api/plants/${plantId}`, newForm, {
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      })
      console.log(response)
      navigate(`/plants/${plantId}`)
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (e) => {
    try {
      await axios.delete(`/api/plants/${plantId}`, {
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      })
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  const handleImageUpload = async e => {

    const urlString = URL.createObjectURL(e.target.files[0])
    setDisplayImage(urlString)

    const img = new Image()
    img.src = urlString

    img.onload = async function() {
      const widthMoreThanHeight = img.width > img.height ? true : false
      const widthOverHeight = img.width / img.height
      let scale
      let startX
      let startY
      let sideLength
      if (widthMoreThanHeight) {
        scale = img.height / 300
        startX = -(img.width - img.height) / 2
        startY = 0
        sideLength = img.height
      } else if (widthOverHeight === 1){
        scale = img.height / 300
        startX = 0
        startY = 0
        sideLength = img.height
      } else {
        scale = img.width / 300
        startX = 0
        startY = -(img.height - img.width) / 2
        sideLength = img.width
      }

      const canvas = document.createElement('canvas')
      canvas.width = sideLength
      canvas.height = sideLength

      const ctx = canvas.getContext('2d')
      ctx.drawImage(
        img, //image
        startX,
        startY
      )

      const squareImageURL = canvas.toDataURL('image/jpg', 1)
      setFormData({ ...formData, images: squareImageURL })
    }
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
          <Typography variant='h3' sx={{ pb: 2 }}>Edit a Plant</Typography>
          <Grid
            container
            sx={{ width: .90 }}
            rowSpacing={1}
            columnSpacing={1}>

            {/* This must be first input So that the file upload only fires when you press the button */}
            <>
              <Input type="text" autofocus="autofocus" />
            </>
            
            {/* Name */}
            <Grid item xs={12} md={6}>
              <TextField
                id='name'
                label='Common Name'
                variant='outlined'
                name='name'
                value={formData.name}
                required
                onChange={handleChange}
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
                onChange={handleChange}
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
                minRows={2}
                maxRows={4}
                onChange={handleChange}
                fullWidth />
            </Grid>
            {/* Images */}
            <Grid item xs={12} sx={{ my: 2, textAlign: 'center' }} >
              {displayImage ? 
                <Box component='img' src={displayImage} alt='Image to upload' sx={{ height: '300px', width: '300px', objectFit: 'cover' }} />
                :
                <>
                  {formData.images ? 
                    <Box component='img' src={formData.images} alt='Image to upload' sx={{ height: '300px', width: '300px', objectFit: 'cover' }} />
                    :
                    <></>
                  }
                </>
              }
              <label htmlFor="contained-button-file">
                <Input accept="image/*" id="contained-button-file" multiple type="file" onChange={handleImageUpload} />
                {formData.images ? 
                  // <Button variant="contained" component="span">
                  //   Change Image
                  // </Button>
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                onChange={handleSizeChange}
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
                onChange={handleSizeChange}
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
                <ToggleButtonGroup value={unit} exclusive onChange={handleUnitChange} aria-label="measurement unit">
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
                  onChange={handleChange}
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
                <Checkbox value={formData.isIndoor} onChange={handleChange} />
              } label="Can Be Indoor Plant?" />
            </Grid>
            {/* Submit Button */}
            <Grid item xs={12}>
              <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="contained" type="submit" size='large' sx={{ width: .70, mx: 2 }}>Submit</Button>
                { !formLoaded ? '' : userIsOwner(formData) ? <Button variant="contained" onClick={handleDelete} size='small' sx={{ width: .70, mx: 2, backgroundColor: 'red' }}>Delete</Button> : ''}
              </Container>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  )
}

export default PlantEdit