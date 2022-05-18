import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

import Spinner from './utilities/Spinner.js'

//mui
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import { Typography } from '@mui/material'

const Home = () => {

  //loading and error state
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(false)


  //plant arrays  
  const [plants, setPlants] = useState([])


  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get('/api/plants/')
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

      <Container maxWidth='md' >
        <TextField sx={{ mt: 4 }} fullWidth placeholder='Search...' />
      </Container>
      {loading ?
        <Spinner />
        : errors ?
          <Container>
            <Typography>
              Error! Could not fetch data!
            </Typography>
          </Container>
          :
          <Container maxWidth='md' sx={{ my: 4 }}>
            <ImageList cols={3} gap={10}>
              {plants.map(plant => {
                return (
                  <>
                    <ImageListItem key={plant._id}  >
                      <Box as={Link} to={`/plants/${plant._id}`} >
                        <img
                          src={`${plant.images}`}
                          alt={plant.name}
                          loading="lazy"
                        />
                      </Box>
                      <ImageListItemBar
                        title={plant.name}
                        sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
                      />
                    </ImageListItem>
                  </>
                )
              })}
            </ImageList>
          </Container>
      }
    </>
  )
}

export default Home