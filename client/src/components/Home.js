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
  const [filteredPlants, setFilteredPlants] = useState([])

  const [filters, setFilters] = useState({
    flowerColorFilter: [],
    searchTerm: '',
  })


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
    //changes box to blue border
    colors.includes(e.target.textContent) ? e.target.classList.toggle('styled') : ''
    let newObj
    //set filters for search term
    if (e.target.name === 'searchTerm') {
      newObj = {
        ...filters,
        [e.target.name]: e.target.value,
      }
      //set filters for colors
    } else {
      newObj = {
        ...filters,
      }
      newObj.flowerColorFilter.includes(e.target.textContent) ? newObj.flowerColorFilter.splice(newObj.flowerColorFilter.indexOf(e.target.textContent), 1) : newObj.flowerColorFilter.push(e.target.textContent)
    }
    setFilters(newObj)
  }

  // filter plants by colors and searchTerm
  useEffect(() => {
    //regexp search term for testing
    const regExpSearch = new RegExp(filters.searchTerm, 'i')
    const filteredArray = plants.filter(plant => regExpSearch.test(plant.name))

    //if there are colors in the filters obj 
    //basically the same code philip wrote
    const colorFilterArray = []
    if (filters.flowerColorFilter.length) {
      filters.flowerColorFilter.forEach(color => {
        filteredArray.forEach(plant => {
          if (plant.flowerColor.includes(color)) {
            !colorFilterArray.includes(plant) ? colorFilterArray.push(plant) : ''
          }
        })
      })
      setFilteredPlants(colorFilterArray)
      
    } else {
      //if just search term
      setFilteredPlants(filteredArray)
    }

  }, [filters, plants])



  return (
    <>
      {/* search bar */}
      <Container maxWidth='lg' >
        <TextField fullWidth name='searchTerm' autoComplete='off' placeholder='Search by name...'
          onChange={handleInput} value={filters.searchTerm} sx={{ pt: 3 }} />
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
                            name='chip'
                            value='red'
                            onClick={handleInput}
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
                {(filteredPlants.length ? filteredPlants : plants).map(plant => {
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