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
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import CircleIcon from '@mui/icons-material/Circle'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'



const Home = () => {

  //loading and error state
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(false)




  //plant state 
  const [plants, setPlants] = useState([])
  const [searchPlant, setSearchPlant] = useState([])
  const [filteredPlants, setFilteredPlants] = useState([])
  const [searchTerm, setSearchTerm] = useState([])
  const colorFilter = []


  const colors = [
    'Red',
    'Purple',
    'Pink',
    'Blue',
    'Yellow',
    'Violet',
    'White',
    'Orange'
  ]

  const soilType = [
    'Loamy',
    'Chalky',
    'Peaty',
    'Silty',
    'Sandy',
    'Clay'
  ]

  const mood = [
    'Cheerful',
    'Emo',
    'Mysterious',
    'Classy',
    'Bright'
  ]

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


  //! WIP
  //get search value
  const handleInput = (e) => {
    setSearchTerm(e.target.value)
  }

  // works for typing in a color and pressing enter
  useEffect(() => {
    const regexp = new RegExp(searchTerm, 'i')
    const filteredArray = plants.filter(plant => regexp.test(plant.name))
    setSearchPlant(filteredArray)
  }, [searchTerm])


  const handleChipClick = (e, chip) => {
    e.target.classList.toggle('styled')
    if (colors.includes(chip)) {
      colorFilter.includes(chip) ? colorFilter.splice(colorFilter.indexOf(chip), 1) : colorFilter.push(chip)
      console.log(colorFilter)
      const filteredArray = plants.filter(plant => colorFilter.some(color => plant.flowerColor.includes(color)))
      // console.log(filteredArray)
      // console.log(colorFilter)
      setFilteredPlants(filteredArray)
    }
  }




  return (
    <>
      {/* search bar */}
      <Container maxWidth='lg' >
        <TextField fullWidth autoComplete='off' placeholder='Search by name...' onChange={handleInput} value={searchTerm} sx={{ pt: 3 }} />
        <Accordion disableGutters>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="Search-tags"
            id="search-tags-header"
            square='false'
          >
            <Typography>Search by tags</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={1} textAlign='center'>
              {/* flower color */}
              <Grid item xs={4}>
                <Box>
                  <Typography pb={3}>Flower Color</Typography>
                  <Grid container spacing={1}>
                    {colors.map((chip) => {
                      return (
                        <Grid item xs={4} key={chip}>
                          <Box
                            as='span'
                            onClick={(e) => handleChipClick(e, chip)}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#ebebeb',
                              borderRadius: 10,
                              p: 1,
                              color: [chip],
                              '&:hover': {
                                cursor: 'pointer',
                                backgroundColor: '#e0e0e0',
                              },
                            }}>
                            {chip}
                          </Box>
                        </Grid>
                      )
                    })}
                  </Grid>

                </Box>
              </Grid>
              {/* Soil type */}
              <Grid item xs={4}>
                <Box>
                  <Typography pb={3}>Soil Type</Typography>
                  <Grid container spacing={1}>
                    {soilType.map((chip) => {
                      return (
                        <Grid item xs={4} key={chip}>
                          <Box
                            as='span'
                            onClick={(e) => handleChipClick(e, chip)}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#ebebeb',
                              borderRadius: 10,
                              p: 1,
                              color: [chip],
                              '&:hover': {
                                cursor: 'pointer',
                                backgroundColor: '#e0e0e0',
                              },
                            }}>
                            {chip}
                          </Box>
                        </Grid>
                      )
                    })}
                  </Grid>

                </Box>
              </Grid>
              {/* Mood*/}
              <Grid item xs={4}>
                <Box>
                  <Typography pb={3}>Mood</Typography>
                  <Grid container spacing={1}>
                    {mood.map((chip) => {
                      return (
                        <Grid item xs={4} key={chip}>
                          <Box
                            as='span'
                            onClick={(e) => handleChipClick(e, chip)}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#ebebeb',
                              borderRadius: 10,
                              p: 1,
                              color: [chip],
                              '&:hover': {
                                cursor: 'pointer',
                                backgroundColor: '#e0e0e0',
                              },
                            }}>
                            {chip}
                          </Box>
                        </Grid>
                      )
                    })}
                  </Grid>

                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

      </Container >
      {
        loading ?
          <Container maxWidth='md' sx={{ display: 'flex', justifyContent: 'center', my: '10%' }
          } >
            <Spinner />
          </Container >
          : errors ?
            <Container maxWidth='md' sx={{ display: 'flex', justifyContent: 'center', my: '10%' }} >
              <Typography>
                Error! Could not fetch data!
              </Typography>
            </Container>
            :
            // images
            <Container maxWidth='lg' sx={{ my: 4 }}>
              <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={1}>
                {(searchTerm.length ? searchPlant : filteredPlants.length ? filteredPlants : plants).map(plant => {
                  return (
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
                  )
                })}
              </Masonry>
            </Container>
      }
    </>
  )
}

export default Home