import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import Container from '@mui/material/InputLabel'

const PlantAdd = () => {

  const [ formData, setFormData ] = useState({
    name: '',
    scientificName: '',
    images: '',
    upkeep: {
      watering: 'Daily',
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

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    // post to api
  }

  return (
    <Container>
      <Box component='form' sx={{ minWidth: '100vw', margin: 2 }} display='flex' direction='column'
        alignItems='center'
        justify-content='center'>
        <Grid
          container
          spacing={1}
          fullWidth>
          <Typography variant='h3'>Add a Plant</Typography>
          {/* Name */}
          <Grid item xs={12}>
            <TextField
              id='name'
              label='Common Name'
              variant='outlined'
              name='name'
              value={formData.name}
              required
              onChange={handleChange} />
          </Grid>
          {/* Scientific Name */}
          <Grid item xs={12}>
            <TextField
              id='scientificName' 
              label='Scientific Name'
              variant='outlined'
              name='scientificName'
              value={formData.scientificName}
              required
              onChange={handleChange} />
          </Grid>
          {/* Images */}
          <Grid item xs={12}>
            <TextField id='images'
              label='Image
              URL'
              variant='outlined'
              name='images'
              value={formData.images}
              required
              onChange={handleChange} />
          </Grid>
          {/* Water Requirements */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="water-label">Water Requirements</InputLabel>
              <Select
                labelId="water-label"
                id="water"
                name='watering'
                value={formData.upkeep.watering}
                label='water'
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value={'Daily'}>Daily</MenuItem>
                <MenuItem value={'Weekly'}>Weekly</MenuItem>
                <MenuItem value={'Bi-Weekly'}>Bi-Weekly</MenuItem>
                <MenuItem value={'Monthly'}>Monthly</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {/* Sun Exposure */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="sunExposure-label">Sun Exposure</InputLabel>
              <Select
                labelId="sunExposure-label"
                id="sunExposure"
                name='sunExposure'
                value={formData.upkeep.sunExposure}
                label='sunExposure'
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value={'Full sun'}>Full Sun</MenuItem>
                <MenuItem value={'Partial sun'}>Partial Sun</MenuItem>
                <MenuItem value={'Shade'}>Shade</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {/* Soil Type */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="soilType-label">Soil Type</InputLabel>
              <Select
                labelId="soilType-label"
                id="soilType"
                name='soilType'
                value={formData.upkeep.soilType}
                label='soilType'
                onChange={handleChange}
                fullWidth
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
          <Grid item xs={12}>
            <FormControl fullWidth>
              {/* need to add some kind of chip element */}
            </FormControl>
          </Grid>
          {/* Mood */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="mood-label">Mood</InputLabel>
              <Select
                labelId="mood-label"
                id="mood"
                name='mood'
                value={formData.characteristics.mood}
                label='soilType'
                onChange={handleChange}
                fullWidth
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
                fullWidth
              >
                <MenuItem value={'Cheerful'}>Cheerful</MenuItem>
                <MenuItem value={'Emo'}>Emo</MenuItem>
                <MenuItem value={'Mysterious'}>Mysterious</MenuItem>
                <MenuItem value={'Classy'}>Classy</MenuItem>
                <MenuItem value={'Bright'}>Bright</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default PlantAdd