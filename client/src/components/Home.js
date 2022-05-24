import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Spinner from './utilities/Spinner.js'
import { getImageList } from '../helpers/imageHandling'
import { handleOpen, handleClose } from '../helpers/home.js'

//mui
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'

//filterarrays
import { colors } from '../helpers/plantFormOptions.js'

const Home = () => {

  //loading and error state
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(false)

  const [show, setShow] = useState('none')

  //plant state 
  const [plants, setPlants] = useState([])
  const [filteredPlants, setFilteredPlants] = useState([])

  const [filters, setFilters] = useState({
    flowerColorFilter: [],
    searchTerm: '',
  })

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

  //get search value
  const handleInput = (e) => {
    e.stopPropagation()

    let newObj
    //set filters for search term
    if (e.target.name === 'searchTerm') {
      newObj = {
        ...filters,
        [e.target.name]: e.target.value,
      }

      //set filters for colors
    } else if (colors.includes(e.target.textContent)) {
      //changes box to blue border
      e.target.classList.toggle('styled')
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
    regExpSearch.lastIndex = 0
    const filteredArray = plants.filter(plant => regExpSearch.test(plant.name))

    //if there are colors in the filters obj 
    //basically the same code philip wrote
    const colorFilterArray = []
    if (filters.flowerColorFilter.length) {
      filters.flowerColorFilter.forEach(color => {
        (filteredArray.length ? filteredArray : plants).forEach(plant => {
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

  const handleOpen = (e) => {
    e.stopPropagation()
    setShow('')
  }
  
  const handleClose = (e) => {
    setShow('none')
  }

  return (
    <>
      {/* search bar */}
      <Box onClick={handleClose}>
        <Container maxWidth='lg' >
          <Box onClick={handleOpen}>
            <TextField fullWidth name='searchTerm' autoComplete='off' placeholder='Search by name...'
              onChange={handleInput} value={filters.searchTerm} sx={{ pt: 3 }} />
          </Box>

          <Card sx={{ display: [show], p: 2 }}>
            <Typography >Search by color...</Typography>
            <Container>
              {/* flower color */}
              <Box textAlign='center'>
                <Typography>Flower Color</Typography>
                <Grid container spacing={1}>
                  {colors.map((color) => {
                    return (
                      <Grid item xs={4} key={color}>
                        <Box
                          onClick={handleInput}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#ebebeb',
                            borderRadius: 10,
                            p: 1,
                            color: [color],
                            '&:hover': {
                              cursor: 'pointer',
                              backgroundColor: '#e0e0e0',
                            },
                          }}>
                          {color}
                        </Box>
                      </Grid>
                    )
                  })}
                </Grid>
              </Box>
            </Container>
          </Card>
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
              <>
                {getImageList((filteredPlants.length ? filteredPlants : plants), 1, 2, 3, 4, true)}
              </>
        }
      </Box>

    </>
  )
}

export default Home