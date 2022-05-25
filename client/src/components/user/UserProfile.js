import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Spinner from '../utilities/Spinner.js'

import { getPayload, getTokenFromLocalStorage } from '../../helpers/auth'
import { getImageList } from '../../helpers/imageHandling'

//mui
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Grid from '@mui/material/Grid'


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
          <Box>{children}</Box>
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

  // Navigate
  const navigate = useNavigate()

  //Params
  const { username } = useParams()

  //Payload
  const payload = getPayload()

  //Keeps track of which tab we are in, default is My Plants at index 0
  const [value, setValue] = useState(0)

  //loading and error state
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(false)

  //plant arrays  
  const [myPlants, setMyPlants] = useState([])
  const [favoritePlants, setFavoritePlants] = useState([])
  const [editedPlants, setEditedPlants] = useState([])
  
  // User data
  const [user, setUser] = useState({
    username: username,
    numberOfPosts: 0,
    bio: '',
    image: '',
  })

  // Called in the Use Effect, populates the favorites and myEdits arrays
  const getFavoritesOrEdits = async (arrayOfIndexes) => { 
    const newArray = []
    for (let i = 0; i < arrayOfIndexes.length; i++) {
      const plant = await axios.get(`/api/plants/${arrayOfIndexes[i]}`)
      newArray.push(plant.data)
    }
    return newArray
  }
  
  // Get User Data
  useEffect(() => {
    const getData = async () => {
      try {

        // User must have an account to view profiles
        if (!payload) {
          navigate('/login')
        }

        // Get data for specified user, by username
        const { data } = await axios.get(`/api/profile/user/${username}`, {
          headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          },
        })
        const retrievedUser = data[0]

        // Set My Plants
        setMyPlants(retrievedUser.createdPlants)

        // Search for favorite plants and set it
        if (retrievedUser.favorites.length > 0) {
          setFavoritePlants(await getFavoritesOrEdits(retrievedUser.favorites))
        }

        // Search for edited plants and set it
        if (retrievedUser.myEdits.length > 0) {
          setEditedPlants(await getFavoritesOrEdits(retrievedUser.myEdits))
        }
        
        //Update user
        setUser(
          { 
            ...user, 
            numberOfPosts: retrievedUser.createdPlants.length,
            bio: retrievedUser.bio,
            image: retrievedUser.image,
          }
        )

      } catch (error) {
        console.log(error)
        setErrors(true)
      }
      setLoading(false)
    }
    getData()
  }, [navigate])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleEdit = (e) => {
    e.preventDefault()
    if (username === payload.username) {
      navigate(`/profile/${username}/edit`)
    }
  }

  return (
    <>
      <Container maxWidth='lg' sx={{ flexGrow: 1, justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
        <Box sx={{ flexGrow: 1, justifyContent: 'center', display: 'flex', mt: 4 }}>
          {/* Profile Picture */}
          <Grid item xs={4} >
            <Avatar alt={user.username} src={user.image} sx={{ width: 96, height: 96, boxShadow: 4 }} />
          </Grid>

          {/* About Me */}
          <Grid item xs={6} sx={{ ml: 8 }} >
            <Stack spacing={0} >

              {/* Username ;if it's a user's own profile, an edit button will show beside it */}
              {username === payload.username ?
                <>
                  <Box sx={{ flexGrow: 1, justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
                    <Typography variant="h6">{user.username.charAt(0).toUpperCase() + user.username.slice(1)}</Typography>
                    <Button onClick={handleEdit}>Edit</Button>
                  </Box>
                </>
                :
                <>
                  <Typography variant="h6">{user.username.charAt(0).toUpperCase() + user.username.slice(1)}</Typography>
                </>
              }

              {/* Number of Posts */}
              <Box>
                <Typography sx={{ mt: 0, mb: 0 }}><strong>{user.numberOfPosts}</strong> posts </Typography>
              </Box>

              {/* Bio */}
              <Box sx={{ flexGrow: 1, display: 'flex', flexWrap: 'wrap', maxWidth: '350px' }} >
                {errors ? 
                  <Typography sx={{ mt: 0, mb: 0, pr: 2, width: '100%', color: 'red' }}> Error! Could not fetch bio </Typography>
                  :
                  <Typography sx={{ mt: 0, mb: 0, pr: 2, width: '100%' }}>{user.bio}</Typography>
                }
              </Box>
              
            </Stack>
          </Grid>
        </Box>

        {/* Tabs */}
        <Box sx={{ mt: 2 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            sx={{ borderTop: 1, borderColor: 'divider' }}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="secondary tabs example"
          >
            <Tab label="My Plants" {...a11yProps(0)} />
            <Tab label="Favorites" {...a11yProps(1)} />
            <Tab label="My Edits" {...a11yProps(2)} />
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
                <Typography variant='p' sx={{ color: 'red' }}>
                  Error! Could not fetch data!
                </Typography>
              </Container>
              : myPlants.length > 0 ?
                <>
                  {getImageList(myPlants, 1, 2, 3, 4)}
                </>
                : username === payload.username ?
                  <>
                    <Typography variant='p'>
                      Click the + button to add your first plant
                    </Typography>
                  </>
                  :
                  <>
                    <Typography variant='p'>
                      {username} has not posted any plants 
                    </Typography>
                  </>
          }
        </TabPanel>

        {/* Favorite Plants */}
        <TabPanel value={value} index={1}>
          {loading ?
            <Container maxWidth='md' sx={{ display: 'flex', justifyContent: 'center', my: '10%' }}>
              <Spinner />
            </Container>
            : errors ?
              <Container maxWidth='md' sx={{ display: 'flex', justifyContent: 'center', my: '10%' }} >
                <Typography variant='p' sx={{ color: 'red' }}>
                  Error! Could not fetch data!
                </Typography>
              </Container>
              : favoritePlants.length > 0 ?
                <>
                  {getImageList(favoritePlants, 1, 2, 3, 4)}
                </>
                : username === payload.username ?
                  <>
                    <Typography variant='p'>
                      Tap the 🤍 button to add your first favorite
                    </Typography>
                  </>
                  :
                  <>
                    <Typography variant='p'>
                      {username} has not favorited any plants 
                    </Typography>
                  </>
          }
        </TabPanel>

        {/* Edit History */}
        <TabPanel value={value} index={2}>
          {loading ?
            <Container maxWidth='md' sx={{ display: 'flex', justifyContent: 'center', my: '10%' }}>
              <Spinner />
            </Container>
            : errors ?
              <Container maxWidth='md' sx={{ display: 'flex', justifyContent: 'center', my: '10%' }} >
                <Typography variant='p' sx={{ color: 'red' }}>
                  Error! Could not fetch data!
                </Typography>
              </Container>
              : editedPlants.length > 0 ?
                <>
                  {getImageList(editedPlants, 1, 2, 3, 4)}
                </>
                : username === payload.username ?
                  <>
                    <Typography variant='p'>
                      Plants that you edit will appear here
                    </Typography>
                  </>
                  :
                  <>
                    <Typography variant='p'>
                      {username} has not edited any plants 
                    </Typography>
                  </>
          }
        </TabPanel>
      </Container>
    </>
  )
}

export default UserProfile