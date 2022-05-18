import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

import Spinner from './utilities/Spinner.js'

//mui
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import Typography from '@mui/material/Typography'
import Masonry from '@mui/lab/Masonry'
import IconButton from '@mui/material/IconButton'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'


const Home = () => {

  //loading and error state
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(false)


  //plant arrays  
  const [plants, setPlants] = useState([])


  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get('/api/plants')
        setPlants(data)
      } catch (error) {
        console.log(error)
        setErrors(true)
      }
      setLoading(false)
    }
    getData()
  }, [])

  return (
    <>

      <Container maxWidth='lg' >
        <TextField sx={{ mt: 4 }} fullWidth placeholder='Search...' />
      </Container >
      {loading ?
        <Container maxWidth='md' sx={{ display: 'flex', justifyContent: 'center', my: '10%' }}>
          <Spinner />
        </Container>
        : errors ?
          <Container maxWidth='md' sx={{ display: 'flex', justifyContent: 'center', my: '10%' }} >
            <Typography>
              Error! Could not fetch data!
            </Typography>
          </Container>
          :
          <Container maxWidth='lg' sx={{ my: 4 }}>
            <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={1}>
              {plants.map(plant => {
                return (
                  <>
                    <ImageListItem key={plant._id} >
                      <Box as={Link} to={`/plants/${plant._id}`} >
                        <img
                          src={`${plant.images}`}
                          alt={plant.name}
                          loading='lazy'
                        />
                      </Box>
                      <ImageListItemBar
                        title={plant.name}
                        sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
                        actionIcon={
                          <>
                            <IconButton
                              sx={{ color: 'white' }}
                              aria-label={`favorites for ${plant.name}`}
                            >
                              <FavoriteIcon />
                            </IconButton>
                            <Typography sx={{ display: 'inline', mr: 2, color: 'white' }}>
                              {plant.favorites.length}
                            </Typography>
                            <IconButton
                              sx={{ color: 'white' }}
                              aria-label={` comments for ${plant.name}`}
                            >
                              <ChatBubbleIcon />
                            </IconButton>
                            <Typography sx={{ display: 'inline', mr: 2, color: 'white' }}>
                              {plant.comments.length}
                            </Typography>
                          </>
                        }
                      />
                    </ImageListItem>
                  </>
                )
              })}
            </Masonry>

          </Container>
      }
    </>
  )
}

export default Home