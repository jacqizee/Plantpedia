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

const PlantShow = () => {

  const { id } = useParams()

  const [plant, setPlant] = useState(false)
  const [favorite, setFavorite] = useState(false)

  useEffect(() => {
    const getPlant = async () => {
      try {
        const { data } = await axios.get(`/api/plants/${id}`)
        setPlant(data)
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


  return (

    <Container maxWidth='lg' >
      {plant ?
        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid item xs={12} sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant='h4'>
              {plant.name}
            </Typography>
          </Grid>
          <Grid item md={6}>
            <img src={plant.images} alt={plant.name} sx={{ position: 'relative' }} />
            <IconButton sx={{ color: 'white', position: 'relative', bottom: '90%', left: 0 }} onClick={() => toggleFavorite(plant)} >
              {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Grid>
          <Grid item md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, border: '1px solid grey', borderRadius: 1 }}>
                <Typography>
                  Name
                </Typography>
                <Typography>
                  Description
                </Typography>
              </Box>
              <Box mt={2}>
                hello
              </Box>
            </Box>
          </Grid>
        </Grid> :
        <h1>hello</h1>}
    </Container>
  )
}

export default PlantShow