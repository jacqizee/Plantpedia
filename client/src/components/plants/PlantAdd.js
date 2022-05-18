import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { getTokenFromLocalStorage } from '../../helpers/auth.js'
import { Link } from 'react-router-dom'

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
import Autocomplete from '@mui/material/Autocomplete'
import Slider from '@mui/material/Slider'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'


const PlantAdd = () => {
  const [ formData, setFormData ] = useState({
    name: '',
    scientificName: '',
    images: '',
    upkeep: {
      watering: '',
      sunExposure: '',
      soilType: '',
    },
    characteristics: {
      flowerColor: [],
      mood: '',
      lifespan: '',
      isIndoor: false,
      matureSize: {
        height: 0,
        width: 0,
      },
      nativeArea: [],
    },
  })

  // Nested Objects and Their Keys
  const upkeep = ['watering', 'sunExposure', 'soilType']
  const chars = ['mood', 'lifespan', 'isIndoor']

  const handleNestedChange = (objectName, keyName, value) => {
    setFormData({ ...formData, [objectName]: {
      ...formData[objectName],
      [keyName]: value,
    } })
  }

  const handleMultiChange = (selected, objectName, keyName) => {
    console.log(selected.target, objectName, keyName)
    console.log(selected)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (upkeep.includes(name)) {
      handleNestedChange('upkeep', name, value)
    } else if (chars.includes(name)) {
      handleNestedChange('characteristics', name, value)
    } else {
      setFormData({ ...formData, [name]: value })
    }
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
    'Cream',
    'White'
  ]

  const regions = [
    'North America',
    'South America',
    'Europe',
    'Middle East',
    'Africa',
    'Asia'
  ]

  return (
    <Container>
      <Box
        component='form'
        sx={{ minWidth: '100vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center' }}
        onSubmit={handleSubmit}
      >
        <Typography variant='h3'>Add a Plant</Typography>
        <Grid
          container
          sx={{ width: .5 }}
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
            <FormControl fullWidth>
              <InputLabel id="water-label">Water</InputLabel>
              <Select
                labelId="water-label"
                id="water"
                name='watering'
                value={formData.upkeep.watering}
                label='water'
                onChange={handleChange}
              >
                <MenuItem value={'Daily'}>Daily</MenuItem>
                <MenuItem value={'Weekly'}>Weekly</MenuItem>
                <MenuItem value={'Bi-Weekly'}>Bi-Weekly</MenuItem>
                <MenuItem value={'Monthly'}>Monthly</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {/* Sun Exposure */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="sunExposure-label">Sun Exposure</InputLabel>
              <Select
                labelId="sunExposure-label"
                id="sunExposure"
                name='sunExposure'
                value={formData.upkeep.sunExposure}
                label='sunExposure'
                onChange={handleChange}
              >
                <MenuItem value={'Full sun'}>Full Sun</MenuItem>
                <MenuItem value={'Partial sun'}>Partial Sun</MenuItem>
                <MenuItem value={'Shade'}>Shade</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {/* Soil Type */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="soilType-label">Soil Type</InputLabel>
              <Select
                labelId="soilType-label"
                id="soilType"
                name='soilType'
                value={formData.upkeep.soilType}
                label='soilType'
                onChange={handleChange}
              >
                <MenuItem value={'Loamy'}>Loamy</MenuItem>
                <MenuItem value={'Chalky'}>Chalky</MenuItem>
                <MenuItem value={'Peaty'}>Peaty</MenuItem>
                <MenuItem value={'Silty'}>Silty</MenuItem>
                <MenuItem value={'Sandy'}>Sandy</MenuItem>
                <MenuItem value={'Clay'}>Clay</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {/* Flower Colors */}
          <Grid item xs={12} md={6}>
            <Autocomplete
              disablePortal
              id='colors'
              name='flowerColor'
              options={colors}
              fullWidth
              multiple
              onChange={(selected) => handleMultiChange(selected, 'characteristics', 'flowerColor')}
              renderInput={(params) => <TextField {...params} label="Flower Color" />}
            />
          </Grid>
          {/* Mood */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="mood-label">Mood</InputLabel>
              <Select
                labelId="mood-label"
                id="mood"
                name='mood'
                value={formData.characteristics.mood}
                label='soilType'
                onChange={handleChange}
              >
                <MenuItem value={'Cheerful'}>Cheerful</MenuItem>
                <MenuItem value={'Emo'}>Emo</MenuItem>
                <MenuItem value={'Mysterious'}>Mysterious</MenuItem>
                <MenuItem value={'Classy'}>Classy</MenuItem>
                <MenuItem value={'Bright'}>Bright</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {/* Lifespan */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="lifespan-label">Lifespan</InputLabel>
              <Select
                labelId="lifespan-label"
                id="lifespan"
                name='lifespan'
                value={formData.characteristics.lifespan}
                label='lifespan'
                onChange={handleChange}
              >
                <MenuItem value={'Perennial'}>Perennial</MenuItem>
                <MenuItem value={'Biennial'}>Biennial</MenuItem>
                <MenuItem value={'Annual'}>Annual</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {/* Height */}
          <Grid item xs={12} md={6}>
            <Typography id="height-slider" gutterBottom>
              Height:
            </Typography>
            <Slider
              // value={value}
              onChange={handleChange}
              valueLabelDisplay="auto"
              name="height"
              size="small"
              min={1}
              max={100}
              sx={{ width: .9, align: 'center' }}
            />
          </Grid>
          {/* Width */}
          <Grid item xs={12} md={6}>
            <Typography id="width-slider" gutterBottom>
              Width: 
            </Typography>
            <Slider
              // value={value}
              onChange={handleChange}
              valueLabelDisplay="auto"
              name='width'
              size="small"
              min={1}
              max={100}
              sx={{ width: .9, align: 'center' }}
            />
          </Grid>
          {/* Native Area */}
          <Grid item xs={12} md={9}>
            <Autocomplete
              disablePortal
              id='nativeArea'
              options={regions}
              fullWidth
              multiple
              onChange={(selected) => handleMultiChange(selected, 'characteristics', 'nativeArea')}
              renderInput={(params) => <TextField {...params} label="Native Area" />}
            />
          </Grid>
          {/* Is Indoor? */}
          <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel control={<Checkbox defaultChecked />} label="Indoor Plant" />
          </Grid>
          {/* Submit Button */}
          <Grid item xs={12}>
            <Container sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" type="submit" size='large' sx={{ width: .70 }}>Submit</Button>
            </Container>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default PlantAdd