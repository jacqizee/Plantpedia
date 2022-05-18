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


const PlantShow = () => {

  const { id } = useParams()

  const [plant, setPlant] = useState(false)
  const [favorite, setFavorite] = useState(false)

  const [formData, setFormData] = useState({
    subject: '',
    text: '',
    owner: '',
  })

  useEffect(() => {
    const getPlant = async () => {
      try {
        const { data } = await axios.get(`/api/plants/${id}`)
        setPlant(data)
        console.log(data)
      } catch (error) {
        console.log(error)
        // setErrors(true)
      }
    }
    getPlant()
  }, [id])

  const plantIsFavorite = (singlePlant) => {
    // get payload and check it has a value
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

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.subject.length || !formData.text.length) return
    setFormData({ ...formData, owner: getPayload().sub })
    try {
      await axios.post(`/api/plants/${plant._id}/comments`, formData, {
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      })
      setFormData({
        subject: '',
        text: '',
        owner: '',
      })
    } catch (err) {
      console.log(err)
    }
  }




  return (

    <Container maxWidth='lg' >
      {plant ?
        <>
          <Grid container spacing={2} sx={{ mt: 4 }}>

            {/* Title */}
            <Grid item xs={12} sx={{ textAlign: 'center', mb: 2 }}>
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
                    Name
                  </Typography>
                  <Typography>
                    Description
                  </Typography>
                </Box>
                <Box mt={2} sx={{ p: 2, border: '1px solid grey', borderRadius: 1, flexGrow: 1 }}>
                  hello
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* comment info */}
          <Box display='flex' my={2} alignItems='center'>
            <Typography> {plant.comments.length} comments</Typography>

            {/* comment sort select */}
            <Box sx={{ minWidth: 120, mx: 3 }} >
              <FormControl fullWidth size='small'>
                <InputLabel id="sort-comments">Sort by</InputLabel>
                <Select
                  labelId="sort-comments"
                  id="sort-comments"
                  value=''
                  label="sort"
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
                name='subject'
                value={formData.subject}
                size='small'
                placeholder='Subject'
                onChange={handleInput}
                sx={{ mb: 2 }} />
              <TextField
                name='text'
                value={formData.text}
                size='small'
                variant='standard'
                fullWidth
                placeholder='Add comment'
                onChange={handleInput} />
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, float: 'right' }}
              >
                Add comment
              </Button>
            </Box>
          </Stack>

          {/* comment section */}
          <Stack direction='row' spacing={2} mt={3}>
            <Avatar sx={{ width: 24, height: 24 }} />
            <Box >
              <Typography>
                Username
              </Typography>
              <Typography>
                This is awesome
              </Typography>
            </Box>
          </Stack>

        </>


        :
        <Box>Loading</Box>
      }
    </Container>
  )
}

export default PlantShow