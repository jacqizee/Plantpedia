import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

// components
import { getPayload, getTokenFromLocalStorage, userIsAuthenticated } from '../../helpers/auth'
import Spinner from '../utilities/Spinner'
import NotFound from '../common/NotFound'

// moment for timestamps
import moment from 'moment'

//mui
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import Chip from '@mui/material/Chip'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Pagination from '@mui/material/Pagination'
import Paper from '@mui/material/Paper'

//icon images
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import wateringCan from '../../images/icons/watering-can.png'
import sun from '../../images/icons/sun.png'
import soil from '../../images/icons/soil.png'
import LocalFloristIcon from '@mui/icons-material/LocalFlorist'
import globe from '../../images/icons/globe.png'
import calendar from '../../images/icons/calendar.png'
import emotions from '../../images/icons/emotions.png'
import ruler from '../../images/icons/ruler.png'
import width from '../../images/icons/width.png'

const PlantShow = () => {

  // Get Params
  const { id } = useParams()

  const navigate = useNavigate()
  const payload = getPayload()
  const token = getTokenFromLocalStorage()

  // States for Main Section
  const [plant, setPlant] = useState(false)
  const [favorite, setFavorite] = useState(false)

  // States for Comment Section
  const [commentCount, setCommentCount] = useState()
  const [commentDropdown, setCommentDropdown] = useState('newest')
  const [showComments, setShowComments] = useState(false)
  const [page, setPage] = useState(1)
  const [pageResults, setPageResults] = useState(false)
  const commentsPerPage = 3
  const [formData, setFormData] = useState({
    text: '',
  })

  // State for editing status
  const [userCanEdit, setUserCanEdit] = useState(false)

  // Error Handling
  const [errors, setErrors] = useState(false) // GET request errors
  const [postErrors, setPostErrors] = useState(false) // POST request errors (for comments)

  // get plant data & set initial comments and pagination
  useEffect(() => {
    const getPlant = async () => {
      try {
        const { data } = await axios.get(`/api/plants/${id}`)
        setPlant({ ...data, comments: data.comments.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)) })
        setCommentCount(data.comments.length)
        setPageResults(data.comments.slice(0, commentsPerPage))

        if (payload) {
          const { data: userData } = await axios.get(`/api/profile/${payload.sub}`, {
            headers: {
              Authorization: `Bearer ${getTokenFromLocalStorage()}`,
            },
          })
          setUserCanEdit(userData.canEdit)
        }
      } catch (error) {
        console.log(error)
        setErrors(true)
      }
    }
    getPlant()
  }, [id])

  // ? Comment Functions

  // comment dropdown menu
  const handleDropdown = (e) => {
    setCommentDropdown(e.target.value)
    // If oldest is selected, display oldest -> newest, and vice versa
    if (e.target.value === 'oldest') {
      setPlant({ ...plant, comments: plant.comments.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)) })
    } else if (e.target.value === 'newest') {
      setPlant({ ...plant, comments: plant.comments.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)) })
    }
    updatePageResults(page, plant)
  }

  //input for comment data
  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // submit comment
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Resetting errors
    setPostErrors(false)

    if (!formData.text.length) return

    // Add owner and username to comment form data
    setFormData({ ...formData, owner: payload.sub, username: payload.username })

    // Submit post request to API
    try {
      await axios.post(`/api/plants/${plant._id}/comments`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      //get new plant comments
      const { data } = await axios.get(`/api/plants/${id}`)

      // update plant data with new comments and sort
      commentDropdown === 'newest' ? setPlant({ ...data, comments: data.comments.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)) })
        : setPlant(data)
      setCommentCount(data.comments.length)

      // update pagination
      updatePageResults(page, data)

      //reset form
      setFormData({
        text: '',
      })

      // hide comment text area
      toggleShowOff()
    } catch (err) {
      console.log(err)
      setPostErrors(true)
    }
  }

  //unfocus comment section after comment is sent
  const shouldBlur = (e) => {
    if ((e.keyCode === 13)) {
      e.target.blur()
    }
  }

  // show comment buttons
  const toggleShowOn = () => {
    setShowComments(true)
  }

  // hide comment buttons
  const toggleShowOff = () => {
    setShowComments(false)
    setFormData({
      text: '',
      owner: '',
    })
  }

  //disable comment button until user has typed message
  const isAddDisabled = formData.text.length === 0

  // handle page change
  const handlePageChange = (e) => {
    const { dataset, innerText } = e.target
    let pageNumber
    // Check what button was pressed, a number or an icon (ex right/left arrows)
    if (!innerText) {
      dataset.testid === 'NavigateBeforeIcon' ? pageNumber = page - 1 : pageNumber = page + 1
    } else {
      pageNumber = parseInt(innerText)
    }
    setPage(pageNumber)
    updatePageResults(pageNumber, plant)
  }

  // Update commnent results based on page number
  const updatePageResults = (pageNumber, data) => {
    if (pageNumber === 1) {
      setPageResults(data.comments.slice(0, commentsPerPage))
    } else {
      const start = commentsPerPage * (pageNumber - 1)
      setPageResults(data.comments.slice(start, start + commentsPerPage))
    }
  }

  // ? Favorite Functions

  //update state when user clicks fav icon and on page render
  useEffect(() => {
    const isFavorite = (singlePlant) => {
      if (!payload || !singlePlant) return
      setFavorite(singlePlant.favorites.includes(payload.sub))
    }
    isFavorite(plant)
  }, [plant])

  //send request to favorites
  const toggleFavorite = async (plant) => {
    try {
      await axios.put(`/api/plants/${plant._id}/favorite`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      favorite ? setFavorite(false) : setFavorite(true)
    } catch (error) {
      console.log(error)
    }
  }

  // Handle when a user presses edit
  const handleEditPressed = () => {
    if (userCanEdit || plant.owner === payload.sub) {
      navigate(`/plants/${plant._id}/edit`)
    } else {
      navigate('/become-editor')
    }
  }

  return (

    <>
      {errors ?
        <>
          <NotFound />
        </>
        :
        <>
          <Container maxWidth='lg' >
            {plant ?
              <Container>
                {/* Main Section */}
                <Container sx={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: 2, my: 5, borderRadius: 1 }}>
                  <Grid container spacing={2} sx={{ my: 1 }}>
                    {/* Title */}
                    <Grid item xs={12} sx={{ textAlign: 'center', my: 1, ml: 2, pb: 1, backgroundColor: 'rgba(0,0,0,0.25)' }}>
                      <Typography variant='h4'>
                        {plant.name}
                      </Typography>
                      <Typography variant='subtitle1' fontStyle='italic' sx={{ mt: -1 }}>
                        {plant.scientificName}
                      </Typography>
                    </Grid>

                    {/* Image and Favorite Button */}
                    <Grid item md={6} sx={{ textAlign: 'right' }}>
                      <Box component='img' src={plant.images} alt={plant.name} sx={{ height: '70vw', maxHeight: 500, objectFit: 'cover' }} />
                      <IconButton
                        sx={{ bottom: 55, right: 5, border: 2, borderColor: 'white', boxShadow: 3, backgroundColor: 'rgba(170,170,170,0.5)' }}
                        onClick={() => toggleFavorite(plant)} >
                        {favorite ? <FavoriteIcon sx={{ color: 'red' }} /> : <FavoriteBorderIcon sx={{ color: 'white' }} />}
                      </IconButton>
                    </Grid>

                    {/* Accordion Column */}
                    <Grid item md={6} sx={{ textAlign: 'center', flexGrow: 1 }}>
                      {/* Description Accordion */}
                      <Accordion defaultExpanded>
                        <AccordionSummary
                          sx={{ backgroundColor: 'rgba(0,0,0,0.15)' }}
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="description-content"
                          id="description-header"
                        >
                          <Typography>Description</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography variant='body1' sx={{ textAlign: 'left' }}>{plant.description}</Typography>
                        </AccordionDetails>
                      </Accordion>

                      {/* Upkeep Accordion */}
                      <Accordion defaultExpanded>
                        <AccordionSummary
                          sx={{ backgroundColor: 'rgba(0,0,0,0.15)' }}
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="upkeep-content"
                          id="upkeep-header"
                          square='false'
                        >
                          <Typography>Care</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container
                            rowSpacing={1}
                            columnSpacing={1}
                            sx={{ mt: 1 }}>
                            {/* Watering */}
                            <Grid item xs md={4}>
                              <Box sx={{
                                backgroundColor: '#98bac3', borderRadius: 10, textAlign: 'center',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                              }}>
                                <Typography>Watering</Typography>
                                <Box>{plant.ownerUsername.username}</Box>
                                <Chip
                                  label={plant.watering}
                                  icon={<Box as='img' src={wateringCan} sx={{ width: '24px' }} />}
                                  sx={{ width: '120px', mb: 1 }}
                                />
                              </Box>
                            </Grid>
                            {/* Sun Exposure */}
                            <Grid item xs md={4}>
                              <Box sx={{
                                backgroundColor: '#d5cd9f', borderRadius: 10, textAlign: 'center',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                              }}>
                                <Typography>Sun</Typography>
                                <Chip
                                  label={plant.sunExposure}
                                  icon={<Box as='img' src={sun} sx={{ width: '24px' }} />}
                                  variant="filled"
                                  sx={{ width: '120px', mb: 1 }}
                                />
                              </Box>
                            </Grid>
                            {/* Soil Type */}
                            <Grid item xs md={4}>
                              <Box sx={{
                                backgroundColor: '#c3ab98', borderRadius: 10, textAlign: 'center',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                              }}>
                                <Typography>Soil Type</Typography>
                                <Chip
                                  label={plant.soilType}
                                  icon={<Box as='img' src={soil} sx={{ width: '24px' }} />}
                                  variant="filled"
                                  sx={{ width: '120px', mb: 1 }}
                                />
                              </Box>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>

                      {/* Characteristics Accordion */}
                      <Accordion>
                        <AccordionSummary
                          sx={{ backgroundColor: 'rgba(0,0,0,0.15)' }}
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="characteristics-content"
                          id="characteristics-header"
                        >
                          <Typography>Characteristics</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container rowSpacing={1} columnSpacing={1} sx={{ mt: 1 }}>
                            {/* Lifecycle */}
                            <Grid item xs={12} md={6}>
                              <Box sx={{
                                backgroundColor: '#98bac3', borderRadius: 2, textAlign: 'center',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                              }}>
                                <Typography>
                                  Lifecycle
                                </Typography>
                                <Chip
                                  label={plant.lifespan}
                                  icon={<Box as='img' src={calendar} sx={{ width: '24px' }} />}
                                  variant="filled"
                                  sx={{ mb: 1 }}
                                />
                              </Box>
                            </Grid>
                            {/* Mood */}
                            <Grid item xs={12} md={6}>
                              <Box sx={{
                                backgroundColor: '#98bac3', borderRadius: 2, textAlign: 'center',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                              }}>
                                <Typography>
                                  Mood
                                </Typography>
                                <Chip
                                  label={plant.mood}
                                  icon={<Box as='img' src={emotions} sx={{ width: '24px' }} />}
                                  variant="filled"
                                  sx={{ mb: 1 }}
                                />
                              </Box>
                            </Grid>
                            {/* Mature Size (Height/Width) */}
                            <Grid item xs={12} md={12}>
                              <Box sx={{
                                backgroundColor: '#d5cd9f', borderRadius: 2, textAlign: 'center',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                              }}>
                                <Typography>Mature Size</Typography>
                                <Box>
                                  <Chip
                                    label={`Length: ${plant.height}"`}
                                    icon={<Box as='img' src={ruler} sx={{ width: '24px' }} />}
                                    variant="filled"
                                    sx={{ mb: 1, mr: '2px' }}
                                  />
                                  <Chip
                                    label={`Width: ${plant.width}"`}
                                    icon={<Box as='img' src={width} sx={{ width: '24px' }} />}
                                    variant="filled"
                                    sx={{ mb: 1, ml: '2px' }}
                                  />
                                </Box>
                              </Box>
                            </Grid>
                            {/* Native Area */}
                            {plant.nativeArea.length ? <Grid item xs={12} md={12}>
                              <Box sx={{
                                backgroundColor: '#c3ab98', borderRadius: 2, textAlign: 'center',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                              }}>
                                <Typography>
                                  Native to
                                </Typography>
                                <Box>
                                  {plant.nativeArea.map((area, i) => {
                                    return (
                                      <Chip
                                        key={i}
                                        label={area}
                                        icon={<Box as='img' src={globe} sx={{ width: '24px' }} />}
                                        variant="filled"
                                        sx={{ mb: 1, mr: 1 }}
                                      />
                                    )
                                  })}
                                </Box>
                              </Box>
                            </Grid> : null}
                            {/* Flower Color */}
                            {plant.flowerColor.length ? <Grid item xs={12} md={12}>
                              <Box sx={{
                                backgroundColor: '#7fa283', borderRadius: 2, textAlign: 'center',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                              }}>
                                <Typography>
                                  Flower Color
                                </Typography>
                                <Box>
                                  {plant.flowerColor.map((color, i) => {
                                    return (
                                      <Chip
                                        key={i}
                                        label={color}
                                        icon={<LocalFloristIcon sx={{ width: '24px' }} />}
                                        variant="filled"
                                        sx={{ width: '120px', mb: 1, mr: 1, color: [color] }}
                                      />
                                    )
                                  })}
                                </Box>
                              </Box>
                            </Grid> : null}
                          </Grid>
                        </AccordionDetails>
                      </Accordion>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          {/* Plant Owner */}
                          <Typography variant='caption' sx={{ mt: 1, mb: -.75 }} >Original Creator:
                            <Typography sx={{ ml: '5px', fontWeight: 'bold', fontSize: '13px' }} as='span'>
                              <Link to={payload ? `/profile/${plant.ownerUsername[0].username}` : '/login'}>
                                {plant.ownerUsername[0].username.charAt(0).toUpperCase() + plant.ownerUsername[0].username.slice(1)}
                              </Link>
                            </Typography>
                          </Typography>
                          {/* Last Editor */}
                          <Typography variant='caption'>Last Edit:
                            <Typography as='span' sx={{ ml: '5px', fontWeight: 'bold', fontSize: '13px' }}>
                              <Link to={payload ? `/profile/${plant.lastEditUsername[0].username}` : '/login'}>
                                {plant.lastEditUsername[0].username.charAt(0).toUpperCase() + plant.lastEditUsername[0].username.slice(1)}
                              </Link>
                            </Typography>
                          </Typography>
                        </Box>
                        {/* Edit Chip */}
                        {userIsAuthenticated() ? <Chip
                          label="Edit"
                          onClick={handleEditPressed}
                          icon={<EditRoundedIcon sx={{ width: 15 }} />}
                          variant="outlined"
                          sx={{ float: 'right', mt: 1 }}
                        /> : null}
                      </Box>


                    </Grid>
                  </Grid>
                </Container>

                {/* Comment Section */}
                <Container sx={{ backgroundColor: 'rgba(0,0,0,0.1)', height: '100%', p: { xs: 2, md: 5 }, pt: 5 }}>
                  {/* Total Comment Count */}
                  <Box display='flex' mb={3} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant='overline' sx={{ borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.25)', py: 1, px: 3, ml: 3 }}>{commentCount} comments</Typography>

                    {/* Comment Sort Select */}
                    <Box sx={{ minWidth: { xs: 90, md: 120 } }} >
                      <FormControl variant='standard' fullWidth size='small'>
                        <InputLabel id="sort-comments">Sort by</InputLabel>
                        <Select
                          labelId="sort-comments"
                          id="sort-comments"
                          value={commentDropdown}
                          label="sort"
                          onChange={handleDropdown}
                          sx={{ p: 'none' }}
                        >
                          <MenuItem value='newest'>Newest</MenuItem>
                          <MenuItem value='oldest'>Oldest</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>

                  {/* Comment Display Section */}
                  {pageResults ?
                    pageResults.map((comment, index) => {
                      const { username, _id, text, createdAt } = comment
                      const date = new Date(createdAt)
                      return (
                        <Stack
                          key={_id}
                          direction='row'
                          my={{ xs: 1, md: 2 }}
                          p={{ xs: 1, md: 2 }}
                          sx={{ backgroundColor: 'rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', boxShadow: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {/* User Avatar */}
                            <Box component='img'
                              src={plant.comments[index].image[0].image}
                              sx={{ width: { xs: 25, md: 35 }, height: { xs: 25, md: 35 }, borderRadius: 5, mr: 1 }} />
                            {/* Username */}
                            <Typography sx={{ fontSize: 14, fontWeight: 'bold' }}>
                              <Link to={`/profile/${username}`}>
                                {username.charAt(0).toUpperCase() + username.slice(1)}
                              </Link>
                            </Typography>
                            {/* Date */}
                            <Typography as='span' sx={{
                              ml: 1,
                              fontSize: 10,
                              color: '#9c9c9c',
                            }}>
                              {moment(date).fromNow()}
                            </Typography>
                          </Box>

                          <Paper sx={{ display: 'flex', flexDirection: 'column', mt: 1, mx: { sx: 1, md: 2 } }}>
                            {/* Comment Text */}
                            <Typography
                              variant='body1'
                              p={{ xs: .5, md: 2 }}
                              sx={{ width: '100%' }}>
                              {text}
                            </Typography>
                          </Paper>
                        </Stack>
                      )
                    })
                    :
                    <Box mt={4}>
                      No comments!
                    </Box>
                  }

                  {/* add commment */}
                  {userIsAuthenticated() ?
                    <Stack direction='row' spacing={2} sx={{ mt: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '25%' }}>
                      <Avatar
                        sx={{ width: { xs: 30, md: 50 }, height: { xs: 30, md: 50 } }}
                        alt={payload.username}
                        src={payload.profilePicture} />
                      <Box width='95%'
                        as='form'
                        onSubmit={handleSubmit}
                        sx={{ p: { xs: 1, md: 3 } }}>
                        <TextField
                          name='text'
                          value={formData.text}
                          size='small'
                          variant='standard'
                          autoComplete='off'
                          fullWidth
                          placeholder='Add a comment...'
                          onChange={handleInput}
                          onKeyUp={shouldBlur}
                          onFocus={toggleShowOn}
                          sx={{ backgroundColor: 'rgba(255,255,255,0.5)', px: 1, py: 3 }} />
                        {showComments ?
                          <Box mt={{ xs: 2, md: 3 }}>
                            <Button
                              type="submit"
                              variant="contained"
                              color='primary'
                              sx={{ float: 'right', display: showComments }}
                              disabled={isAddDisabled}
                            >
                              Comment
                            </Button>
                            <Button
                              variant="contained"
                              color='error'
                              sx={{ mr: 2, float: 'right', display: showComments }}
                              onClick={toggleShowOff}
                            >
                              Cancel
                            </Button>
                            {postErrors &&
                              <Grid item xs={12}>
                                <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                                  <Typography sx={{ color: 'red' }}>Error. Failed to post comment.</Typography>
                                </Container>
                              </Grid>
                            }
                          </Box>
                          : null}

                      </Box>
                    </Stack> : null}

                  {/* Pagination */}
                  <Pagination page={page}
                    count={Math.ceil(commentCount / commentsPerPage)}
                    variant="outlined"
                    onChange={handlePageChange}
                    sx={{ mt: 5, mb: -2 }} />
                </Container>
              </Container>
              :
              <Box sx={{ height: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner /></Box>
            }
          </Container >

        </>
      }
    </>
  )
}

export default PlantShow