import React, { useState } from 'react'
import axios from 'axios'
import { getTokenFromLocalStorage } from '../../helpers/auth.js'
import { useNavigate } from 'react-router-dom'

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
import Paper from '@mui/material/Paper'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

const PlantAdd = () => {

  const navigate = useNavigate()
  const [ formData, setFormData ] = useState({
    name: '',
    scientificName: '',
    images: '',
    watering: '',
    sunExposure: '',
    soilType: '',
    flowerColor: [],
    mood: '',
    lifespan: '',
    isIndoor: false,
    height: 0,
    width: 0,
    nativeArea: [],
  })

  // Setting units for height/width
  const [ matureSize, setMatureSize ] = useState({ height: 50, width: 50 })
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/plants', formData, {
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      })
      console.log(response)
      navigate(`/plants/${response.data._id}`)
    } catch (error) {
      console.log(error)
    }
  }

  const colors = [
    'Red',
    'Orange',
    'Yellow',
    'Blue',
    'Pink',
    'Purple',
    'Violet',
    'White'
  ]

  const regions = [
    'North America',
    'South America',
    'Europe',
    'Middle East',
    'Africa',
    'Asia',
    'Australia'
  ]

  const waterTypes = ['Daily', 'Weekly', 'Bi-Weekly', 'Monthly']
  const sunTypes = ['Full sun', 'Partial sun', 'Shade']
  const soilTypes = ['Loamy', 'Chalky', 'Peaty', 'Silty', 'Sandy', 'Clay']
  const lifespanTypes = ['Perennial', 'Biennial', 'Annual']
  const moodTypes = ['Cheerful', 'Emo', 'Mysterious', 'Classy', 'Bright']

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ m: 5, py: 3, backgroundColor: 'cream' }} >
        <Box
          component='form'
          sx={{ width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center' }}
          onSubmit={handleSubmit}
        >
          <Typography variant='h3' sx={{ pb: 2 }}>Add a Plant</Typography>
          <Grid
            container
            sx={{ width: .90 }}
            rowSpacing={1}
            columnSpacing={1}>
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
            {/* Images */}
            <Grid item xs={12}>
              <TextField id='images'
                label='Image URL'
                variant='outlined'
                name='images'
                value={formData.images}
                required
                onChange={handleChange}
                fullWidth />
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
                <Button variant="contained" type="submit" size='large' sx={{ width: .70 }}>Submit</Button>
              </Container>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  )
}

export default PlantAdd