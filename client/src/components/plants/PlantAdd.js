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
import Slider from '@mui/material/Slider'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import OutlinedInput from '@mui/material/OutlinedInput'
import Chip from '@mui/material/Chip'

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
        height: 25,
        width: 25,
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

  const handleNestedNestedChange = (objectName, nestedObjectName, keyName, value) => {
    setFormData({ ...formData, [objectName]: {
      ...formData[objectName],
      [nestedObjectName]: { ...formData[objectName][nestedObjectName], [keyName]: value },
    } })
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
    'Asia',
    'Australia'
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
            <FormControl required fullWidth>
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
            <FormControl required fullWidth>
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
            <FormControl required fullWidth>
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
          {/* Lifespan */}
          <Grid item xs={12} md={6}>
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
          {/* Mood */}
          <Grid item xs={12} md={6}>
            <FormControl required fullWidth>
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
          {/* Flower Colors */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="flowerColor">Flower Color</InputLabel>
              <Select
                labelId="flowerColor"
                id="flowerColor"
                multiple
                value={formData.characteristics.flowerColor}
                onChange={(e) => handleNestedChange('characteristics', 'flowerColor', e.target.value)}
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
          <Grid item xs={12} md={6}>
            <Typography id="height-slider" gutterBottom>
              Height:
            </Typography>
            <Slider
              value={formData.characteristics.matureSize.height}
              onChange={(e) => handleNestedNestedChange('characteristics', 'matureSize', 'height', e.target.value)}
              valueLabelDisplay="auto"
              name="height"
              size="small"
              min={1}
              max={50}
              marks
              step={5}
              sx={{ width: .9, align: 'center' }}
            />
          </Grid>
          {/* Width */}
          <Grid item xs={12} md={6}>
            <Typography id="width-slider" gutterBottom>
              Width: 
            </Typography>
            <Slider
              value={formData.characteristics.matureSize.width}
              onChange={(e) => handleNestedNestedChange('characteristics', 'matureSize', 'width', e.target.value)}
              valueLabelDisplay="auto"
              name='width'
              size="small"
              min={1}
              max={50}
              marks
              step={5}
              sx={{ width: .9, align: 'center' }}
            />
          </Grid>
          {/* Native Area */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="nativeArea">Native Area</InputLabel>
              <Select
                labelId="nativeArea"
                id="nativeArea"
                multiple
                value={formData.characteristics.nativeArea}
                onChange={(e) => handleNestedChange('characteristics', 'nativeArea', e.target.value)}
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
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel control={
              <Checkbox value={formData.characteristics.isIndoor} onChange={(e) => handleNestedChange('characteristics', 'isIndoor', e.target.checked)} />
            } label="Indoor Plant" />
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