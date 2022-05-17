import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useNavigate, useParams } from 'react-router-dom'

//mui
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'

const Home = () => {

  const [plants, setPlants] = useState([])


  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get('/api/plants/')
        setPlants(data)
      } catch (error) {
        console.log(error)
      }
    }
    getData()
  }, [])


  const handleFavorite = async (plantId) => {
    try {
      await axios.put(`/api/plants/${plantId}/favorites`)
    } catch (err) {
      console.log(err)
    }

  }

  return (
    <>
      <Container maxWidth='md' >
        <TextField sx={{ mt: 4 }} fullWidth placeholder='Search...' />
      </Container>
      <Container maxWidth='md' sx={{ my: 4 }}>
        <Grid container spacing={2}>
          {plants.map(plant => {
            return (
              <>
                <Grid key={plant._id} item md={3} sm={6} xs={12}>
                  <Card variant="outlined" >
                    <Box as={Link} to={`/plants/${plant._id}`}>
                      <img src={plant.images} alt={plant.name} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mx: 1 }}>
                      <Box sx={{ my: 1 }}>
                        {plant.name}
                      </Box>
                      <IconButton onClick={() => handleFavorite(plant._id)}>
                        {/* plant.favorites.inlcudes(userId) ? <FavoriteIcon/> : <FavouriteBorderIcon /> */}
                        <FavoriteBorderIcon />
                      </IconButton>
                    </Box>

                  </Card>
                </Grid>
              </>
            )
          })}
        </Grid>
      </Container>

    </>
  )
}

export default Home