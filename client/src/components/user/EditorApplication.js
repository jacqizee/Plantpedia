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

import { getPayload, getTokenFromLocalStorage, userIsOwner } from '../../helpers/auth'

const EditorApplication = () => {

  const navigate = useNavigate()
  const [ formData, setFormData ] = useState({
    text: '',
  })

  const payload = getPayload()


  useEffect(() => {
    const getData = async () => {
      try {
        if (!payload) {
          navigate('/login')
        }

        const { data } = await axios.get(`/api/profile/user/${payload.username}`, {
          headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          },
        })

        const retrievedUser = data[0]

        // Set My Plants
        setMyPlants(retrievedUser.createdPlants)

        // Search for favorite plants and set it
        if (retrievedUser.favorites.length > 0) {
          const favoritesArray = []
          for (let i = 0; i < retrievedUser.favorites.length; i++) {
            const plant = await axios.get(`/api/plants/${retrievedUser.favorites[i]}`)
            console.log('plant value is: ', plant.data)
            favoritesArray.push(plant.data)
            console.log('favoritesArray is: ', favoritesArray)
          }
          console.log('favorites array: ', favoritesArray)
          setFavoritePlants(favoritesArray)
        }

        // Search for edited plants and set it
        if (retrievedUser.myEdits.length > 0) {
          const editsArray = []
          for (let i = 0; i < retrievedUser.myEdits.length; i++) {
            const plant = await axios.get(`/api/plants/${retrievedUser.myEdits[i]}`)
            console.log('plant value is: ', plant.data)
            editsArray.push(plant.data)
            console.log('editsArray is: ', editsArray)
          }
          console.log('edits array: ', editsArray)
          setEditedPlants(editsArray)
        }
        
        //Update user image
        const newUser = {
          numberOfPosts: retrievedUser.createdPlants.length,
          bio: retrievedUser.bio,
          image: retrievedUser.image,
        }
        // setUser({ ...user, newUser })
        setUser(
          { 
            ...user, 
            numberOfPosts: retrievedUser.createdPlants.length,
            bio: retrievedUser.bio,
            image: retrievedUser.image,
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

  return (
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
            <Grid item xs={12} sx={{ mt: 2, textAlign: 'center' }} >
              {formData.images ? 
                <Box component='img' src={formData.images} alt='Image to upload' sx={{ height: '300px', width: '300px', objectFit: 'cover' }} />
                :
                <></>
              }
              <label htmlFor="contained-button-file">
                <Input accept="image/*" id="contained-button-file" multiple type="file" onChange={handleImageUpload} />
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

export default EditorApplication