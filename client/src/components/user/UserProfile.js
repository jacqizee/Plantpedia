import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Spinner from '../utilities/Spinner.js'

//mui
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import Typography from '@mui/material/Typography'
import Masonry from '@mui/lab/Masonry'
import IconButton from '@mui/material/IconButton'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Grid from '@mui/material/Grid'

import philip from '../../images/philip.png'



function TabPanel(props) {
  const { children, value, index, ...other } = props
  const numberValue = parseFloat(value)

  return (
    <div
      role="tabpanel"
      hidden={numberValue !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {numberValue === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const UserProfile = () => {

  const [value, setValue] = useState(0)

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

  const handleChange = (event, newValue) => {
    console.log('handle change runs')
    console.log('event is: ', event)
    console.log('new value is: ', newValue)
    setValue(newValue)
  }

  return (
    <>
      <Container maxWidth='lg' sx={{ flexGrow: 1, justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
        <Box sx={{ flexGrow: 1, justifyContent: 'center', display: 'flex', mt: 4 }}>
          {/* Profile Picture */}
          <Grid item xs={4} >
            <Avatar alt="Philip Sopher" src={philip} sx={{ width: 96, height: 96 }} />
          </Grid>

          {/* About Me */}
          <Grid item xs={6} sx={{ ml: 8 }} >
            <Stack spacing={0} >
              <Box sx={{ flexGrow: 1, justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
                <Typography variant="h6">philipsopher</Typography>
                <Button href="#">Edit</Button>
              </Box>
              <Box>
                <Typography sx={{ mt: 0, mb: 0 }}><strong>12</strong> posts </Typography>
              </Box>
              <Box sx={{ flexGrow: 1, display: 'flex', flexWrap: 'wrap', maxWidth: '350px' }} >
                <Typography sx={{ mt: 0, mb: 0, pr: 2, width: '100%' }}>33 yo cactus lover ...and cherry plum <em>lover</em>.</Typography>
              </Box>
            </Stack>
          </Grid>
        </Box>

        {/* Tabs */}
        <Box sx={{ mt: 2 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="secondary tabs example"
          >
            <Tab label="My Plants" {...a11yProps(0)} />
            <Tab label="Favorites" {...a11yProps(1)} />
            <Tab label="Comments" {...a11yProps(2)} />
          </Tabs>
        </Box>

        {/* Image Lists */}

        {/* My Plants  */}
        <TabPanel value={value} index={0}>
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
              <Container maxWidth='lg' sx={{ my: 0 }}>
                <Masonry columns={{ xs: 3, sm: 3, md: 3 }} spacing={1}>
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
                        </ImageListItem>
                      </>
                    )
                  })}
                </Masonry>

              </Container>
          }
        </TabPanel>

        {/* Favorite Plants */}
        <TabPanel value={value} index={1}>
          No Favorites yet
        </TabPanel>

        {/* Comment History */}
        <TabPanel value={value} index={2}>
          No comments yet
        </TabPanel>

      </Container>
    </>
  )
}

export default UserProfile