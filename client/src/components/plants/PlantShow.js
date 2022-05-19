import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

import { getPayload, getTokenFromLocalStorage, userIsOwner } from '../../helpers/auth'

//mui
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import Chip from '@mui/material/Chip'
import wateringCan from '../../images/icons/watering-can.png'
import sun from '../../images/icons/sun.png'
import soil from '../../images/icons/soil.png'


const PlantShow = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [plant, setPlant] = useState(false)
  const [favorite, setFavorite] = useState(false)
  const [plantComments, setPlantComments] = useState(false)

  const [show, setShow] = useState(false)

  const [formData, setFormData] = useState({
    text: '',
    owner: '',
    username: '',
  })

  useEffect(() => {
    const getPlant = async () => {
      try {
        const { data } = await axios.get(`/api/plants/${id}`)
        setPlant(data)
        setPlantComments(data.comments.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)))

      } catch (error) {
        console.log(error)
        // setErrors(true)
      }
    }
    getPlant()
  }, [id])

  const plantIsFavorite = (singlePlant) => {
    const payload = getPayload()
    if (!payload) return
    if (!singlePlant) return
    return singlePlant.favorites.includes(payload.sub)
  }


  useEffect(() => {
    const isFavorite = (singlePlant) => {
      setFavorite(plantIsFavorite(singlePlant))
    }
    isFavorite(plant)
  }, [plant])

  const toggleFavorite = async (plant) => {
    try {
      await axios.put(`/api/plants/${plant._id}/favorite`, null, {
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      })
      favorite ? setFavorite(false) : setFavorite(true)

    } catch (error) {
      console.log(error)
    }
  }

  const handleEdit = () => {
    navigate(`/plants/${plant._id}/edit`)
  }

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.text.length) return
    setFormData({ ...formData, owner: getPayload().sub, username: getPayload().username })
    try {
      await axios.post(`/api/plants/${plant._id}/comments`, formData, {
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      })
      const { data } = await axios.get(`/api/plants/${id}`)
      setPlantComments(data.comments.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)))
      setFormData({
        text: '',
        owner: '',
      })
      toggleShowOff()
    } catch (err) {
      console.log(err)
    }
  }

  const shouldBlur = (e) => {
    if ((e.keyCode === 13)) {
      e.target.blur()
    }

  }



  const toggleShowOn = () => {
    setShow(true)
  }
  const toggleShowOff = () => {
    setShow(false)
    setFormData({
      text: '',
      owner: '',
    })
  }

  const isTextDisabled = formData.text.length === 0





  return (

    <Container maxWidth='lg' >
      {plant ?
        <>
          <Grid container spacing={2} sx={{ my: 1 }}>

            {/* Title */}
            <Grid item xs={12} sx={{ textAlign: 'center', mb: 1 }}>
              <Typography variant='h4'>
                {plant.name}
              </Typography>
            </Grid>

            {/* Image and favorite */}
            <Grid item md={6} sx={{ position: 'relative' }}>
              <img src={plant.images} alt={plant.name} sx={{ position: 'relative' }} />
              <IconButton sx={{ color: 'white', position: 'absolute', bottom: '1%', right: 0 }}
                onClick={() => toggleFavorite(plant)} >
                {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Grid>

            {/* description and content */}
            <Grid item md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ p: 2, border: '1px solid grey', borderRadius: 1 }}>
                  <Typography>
                    Description
                  </Typography>
                </Box>
                <Box mt={2} sx={{
                  p: 2,
                  border: '1px solid grey',
                  borderRadius: 1,
                  flexGrow: 1,
                  display: 'flex',
                }}>
                  <Box width='50%'>
                    <Typography mb={3} >
                      Scientific Name:
                      <br />
                      {plant.scientificName}
                    </Typography>
                    <Typography>
                      Upkeep
                      <br />
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Chip
                          label={plant.upkeep.watering}
                          icon={<Box as='img' src={wateringCan} sx={{ width: '24px' }} />}
                          variant="outlined"
                          sx={{ width: '120px', mb: 1 }}
                        />
                        <Chip
                          label={plant.upkeep.sunExposure}
                          icon={<Box as='img' src={sun} sx={{ width: '24px' }} />}
                          variant="outlined"
                          sx={{ width: '120px',  mb: 1 }}
                        />
                        <Chip
                          label={plant.upkeep.soilType}
                          icon={<Box as='img' src={soil} sx={{ width: '24px' }} />}
                          variant="outlined"
                          sx={{ width: '120px',  mb: 1 }}
                        />
                      </Box>
                      <Box>
                        Flower Colour
                       
                      </Box>

                    </Typography>
                  </Box>
                  <Box width='50%'>
                    2
                  </Box>
                </Box>
              </Box>
              <Chip
                label="Edit"
                onClick={handleEdit}
                icon={<EditRoundedIcon sx={{ width: 15 }} />}
                variant="outlined"
                sx={{ float: 'right', mt: 1 }}
              />
            </Grid>
          </Grid>

          {/* comment info */}
          <Box display='flex' mb={3} alignItems='flex-end'>
            <Typography> {plant.comments.length} comments</Typography>

            {/* comment sort select */}
            <Box sx={{ minWidth: 120, mx: 3 }} >
              <FormControl variant='standard' fullWidth size='small'>
                <InputLabel id="sort-comments">Sort by</InputLabel>
                <Select
                  labelId="sort-comments"
                  id="sort-comments"
                  value=''
                  label="sort"
                  sx={{ p: 'none' }}
                >
                  <MenuItem value='Newest' >Newest</MenuItem>
                  <MenuItem value='Oldest'>Oldest</MenuItem>
                  <MenuItem value='Popular'>Popular</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* add commment */}
          <Stack direction='row' spacing={2}>
            <Avatar sx={{ width: 24, height: 24 }} alt="" src="" />
            <Box width='100%' as='form' onSubmit={handleSubmit}>
              <TextField
                name='text'
                value={formData.text}
                size='small'
                variant='standard'
                fullWidth
                placeholder='Add comment'
                autoComplete='off'
                onChange={handleInput}
                onKeyUp={shouldBlur}
                onFocus={toggleShowOn} />
              {show ?
                <>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, float: 'right', display: show }}
                    disabled={isTextDisabled}
                  >
                    Add comment
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mr: 2, mt: 3, float: 'right', display: show }}
                    onClick={toggleShowOff}
                  >
                    Cancel
                  </Button>
                </>
                : null}

            </Box>
          </Stack>

          {/* comment section */}
          {plantComments.length ?
            plantComments.map(comment => {
              const { username, _id, text, createdAt } = comment
              const date = new Date(createdAt)
              return (
                <Stack key={_id} direction='row' spacing={2} my={3}>
                  <Avatar sx={{ width: 24, height: 24 }} />
                  <Box >
                    <Typography sx={{ fontSize: 14, fontWeight: 'bold' }}>
                      {username.charAt(0).toUpperCase() + username.slice(1)}
                      <Typography as='span' sx={{
                        ml: 1,
                        fontSize: 10,
                        color: '#9c9c9c',
                      }}>{date.getUTCMonth() + 1}/{date.getUTCDate()}/{date.getUTCFullYear()}
                      </Typography>
                    </Typography>
                    <Typography>
                      {text}
                    </Typography>
                  </Box>
                </Stack>
              )
            })
            :
            <Box mt={4}>
              No comments!
            </Box>
          }

        </>


        :
        <Box>Loading</Box>
      }
    </Container >
  )
}

export default PlantShow