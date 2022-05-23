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
    console.log(searchTerm)
    const filteredArray = plants.filter(plant => regexp.test(plant.name))
    setSearchPlant(filteredArray)
    console.log(searchPlant)
  }, [searchTerm])

  useEffect(() => {
    console.log(searchPlant)
  }, [searchPlant])


  //! WIP


  const handleChipClick = (e, chip) => {
    // e.target.className = 'styled'
    if (colors.includes(chip)) {
      const filteredArray = plants.filter(plant => chip === plant.flowerColor)
      setFilteredPlants(filteredArray)
    } else if (soilType.includes(chip)) {
      const filteredArray = plants.filter(plant => chip === plant.soilType)
      setFilteredPlants(filteredArray)
    } else if (mood.includes(chip)) {
      const filteredArray = plants.filter(plant => chip === plant.mood)
      setFilteredPlants(filteredArray)
    }
  }




  return (
    <>
      {/* search bar */}
      <Container maxWidth='lg' >
        <TextField fullWidth placeholder='Search by name...' onChange={handleInput} value={searchTerm} sx={{ pt: 3 }} />
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
            {/* flower color */}
            <Grid container textAlign='center'>
              <Grid item xs={4}>
                <Box>
                  <Typography pb={3}>Flower Color</Typography>
                  <Grid container>
                    {colors.map((chip) => {
                      return (
                        <Grid item xs={4} spacing key={chip}>
                          <Box                            
                            onClick={(e) => handleChipClick(e, chip)}
                            sx={{ display: 'inline', backgroundColor: '#98bac3', borderRadius: 10 }}>
                            <CircleIcon sx={{ '&&': { color: [chip], width: '15px' } }} />
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
                  {soilType.map((chip) => {
                    return (
                      <Chip
                        onClick={(e) => handleChipClick(e, chip)}
                        key={chip}
                        label={chip}
                        sx={{ width: '100px', mb: 1, mr: 1 }}
                      />
                    )
                  })}
                </Box>
              </Grid>
              {/* Mood*/}
              <Grid item xs={4}>
                <Box>
                  <Typography pb={3}>Mood</Typography>
                  {mood.map((chip) => {
                    return (
                      <Chip
                        onClick={(e) => handleChipClick(e, chip)}
                        key={chip}
                        label={chip}
                        sx={{ width: '100px', mb: 1, mr: 1 }}
                      />
                    )
                  })}
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
                {(searchTerm.length ? searchPlant : plants).map(plant => {
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