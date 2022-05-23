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
import Autocomplete from '@mui/material/Autocomplete'
import CircleIcon from '@mui/icons-material/Circle'



const Home = () => {

  //loading and error state
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(false)


  //plant arrays  
  const [plants, setPlants] = useState([])
  const [filteredPlants, setFilteredPlants] = useState()


  //search bar
  const [searchTerm, setSearchTerm] = useState([])
  const [show, setShow] = useState(false)

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
  //filterSearch by search term
  const handleSearch = (event, value) => {
    if (value) {
      /\s/g.test(value[0]) ? value[0] = value[0].trim() : value
      setSearchTerm(/\s/g.test(value[0]) ? value[0].split(' ') : value)
    }
  }

  // works for typing in a color and pressing enter
  useEffect(() => {
    if (!searchTerm.length) return
    const filterArray = plants.filter(plant => searchTerm.some(item => plant.flowerColor.includes(item) || plant.soilType.includes(item) || plant.mood.includes(item)))
    setFilteredPlants(filterArray)
  }, [searchTerm])


  //! WIP
  const handleFocus = (e) => {
    setShow(true)
  }

  const stopProp = (e) => {
    e.stopPropagation()
  }
  const handleClose = () => {
    setShow(false)
  }

  const handleChipClick = (e, chip) => {
    e.stopPropagation()
    const searchArr = [...searchTerm]
    searchArr.push(chip)
    setSearchTerm(searchArr)
  }



  return (
    <>
      {/* search bar */}
      <Container maxWidth='lg' onClick={handleClose}>
        <Box onClick={stopProp}>
          <Autocomplete
            sx={{ pt: 3 }}
            multiple
            id="tags-filled"
            options={[]}
            freeSolo
            value={searchTerm}
            onFocus={handleFocus}
            onChange={(event, value) => handleSearch(event, value)}
            renderTags={(items, getTagProps) => {
              items[0] = items[0].trim()

              return (/\s/g.test(items[0]) ? items[0].split(' ') : items).map((item, i) => {
                const newItem = item.charAt(0).toUpperCase() + item.slice(1)
                if (colors.includes(newItem)) {
                  return (
                    <Chip
                      key={i}
                      icon={<CircleIcon sx={{ '&&': { color: [item], width: '15px' } }} />}
                      label={newItem}
                      sx={{ width: '110px' }}
                      {...getTagProps({ i })}
                    />
                  )
                } else {
                  return (
                    <Chip
                      key={i}
                      label={item.charAt(0).toUpperCase() + item.slice(1)}
                      sx={{ width: '110px' }}
                      {...getTagProps({ i })}
                    />
                  )
                }
              })
            }

            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={searchTerm.length ? 'Add tag' : 'Search by flower color, soil type or mood...'}
              />
            )}
          />
        </Box>
        {show ?
          <Grid container textAlign='center'>
            <Grid item md={4}>
              <h2>Flower Colors</h2>
              <Box>
                {colors.map((chip, i) => {
                  return (
                    <Chip
                      onClick={(e) => handleChipClick(e, chip)}
                      key={i}
                      label={chip}
                      icon={<CircleIcon sx={{ '&&': { color: [chip], width: '15px' } }} />}
                      sx={{ width: '100px', mb: 1, mr: 1 }}
                    />
                  )
                })}
              </Box>
            </Grid>
            <Grid item md={4}>
              <h2>Soil Type</h2>
              <Box>
                {soilType.map((chip, i) => {
                  return (
                    <Chip
                      onClick={(e) => handleChipClick(e, chip)}
                      key={i}
                      label={chip}
                      sx={{ width: '100px', mb: 1, mr: 1 }}
                    />
                  )
                })}
              </Box>
            </Grid>
            <Grid item md={4}>
              <h2>Mood</h2>
              <Box>
                {mood.map((chip, i) => {
                  return (
                    <Chip
                      onClick={(e) => handleChipClick(e, chip)}
                      key={i}
                      label={chip}
                      sx={{ width: '100px', mb: 1, mr: 1 }}
                    />
                  )
                })}
              </Box>
            </Grid>
          </Grid>
          : null}

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
          // images
          <Container maxWidth='lg' sx={{ my: 4 }}>
            <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={1}>
              {(filteredPlants && searchTerm.length ? filteredPlants : plants).map(plant => {
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