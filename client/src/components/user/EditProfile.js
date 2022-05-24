import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

import { getPayload, getTokenFromLocalStorage } from '../../helpers/auth'

// MUI Imports
import Container from '@mui/material/InputLabel'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/src/ReactCrop.scss'

const EditProfile = () => {

  // Styling Input so it won't display
  const Input = styled('input')({
    display: 'none',
  })

  // Params, Payload, and Navigate
  const { username } = useParams()
  const payload = getPayload()
  const navigate = useNavigate()

  // Cloudinary URL and Preset
  const uploadURL = process.env.REACT_APP_CLOUDINARY_URL
  const preset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET

  //loading and error state
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(false) //Get Data Error
  const [putErrors, setPutErrors] = useState(false) //Upload Data Error

  //Cropping States
  const [isUndersized, setIsUndersized] = useState(false)
  const [srcImg, setSrcImg] = useState(null) //The image thats being displayed
  const [image, setImage] = useState(null) // The image that gets cropped and saved
  const [crop, setCrop] = useState({ // Crop parameters
    unit: 'px', // Can be 'px' or '%'
    x: 10,
    y: 25,
    width: 300,
    height: 300,
    aspect: 1,
    keepSelection: true,
  })

  // User bio to update
  const [ formData, setFormData ] = useState({
    username: username,
    image: payload.profilePicture,
    bio: '',
  })

  // Getting User Data
  useEffect(() => {
    const getData = async () => {
      try {
        // If not logged in, can't edit anything
        if (!payload) {
          navigate('/login')
        }

        // Get user data by ID
        const { data } = await axios.get(`/api/profile/${payload.sub}`, {
          headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          },
        })

        // Making sure the bio autopopulates with the user's most recently saved bio
        setFormData(
          { 
            ...formData,
            bio: data.bio,
          }
        )

      } catch (error) {
        console.log(error)
        setErrors(true)
      }
      setLoading(false)
    }
    getData()
  }, [])

  const handleImageUpload = async e => {
    
    // Setting the x and y start values of the crop slightly more than zero so user knows its a crop window
    setCrop({
      ...crop,
      x: 10,
      y: 25,
    })

    // Creating an object URL for the uploaded image and saving it as a string to srcImg and image
    const urlString = URL.createObjectURL(e.target.files[0])
    setSrcImg(urlString)
    setImage(urlString)

    // Creating a new image to determine if it's undersized
    // The cropper will behave differently depending on whether the srcImg fills the 350x350 square
    const img = new Image()
    img.src = urlString
    img.onload = function() {
      const w = img.width
      const h = img.height
      const heightMoreThan350px = img.height > 350 ? true : false
      const widthMoreThan350px = img.width > 350 ? true : false
      setIsUndersized(!heightMoreThan350px || !widthMoreThan350px )
    }
  }

  //Called in Handle Submit
  //Getting a Data URL for images that are too small to be cropped
  const getBase64Image = (img) => {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    return canvas.toDataURL('image/jpg', 1)
  }

  //Called in Handle Submit
  //Saves the image that's in the crop window as a data URL
  const getCroppedImg = async () => {
    const img = new Image()
    img.src = image

    const heightMoreThan350px = img.height > 350 ? true : false

    try {
      const canvas = document.createElement('canvas')
      let scale
      if (heightMoreThan350px) {
        scale = img.height / 350
      } else {
        scale = 1
      }
      canvas.width = crop.width
      canvas.height = crop.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(
        img,
        crop.x * scale,
        crop.y * scale,
        crop.width * scale,
        crop.height * scale,
        0,
        0,
        crop.width,
        crop.height
      )

      return canvas.toDataURL('image/jpg', 1)
      
    } catch (e) {
      console.log('error cropping the image: ', e)
      return ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Create a new form so that you can pass up the Cloudinary URL
    let newForm = { ...formData }
    let imageURL //Data URL to be passed into Cloudinary

    //Only do this if the user has actually changed the profile picture
    if (srcImg) {
      //Get the data URL of the full image if it's undersized
      if (isUndersized) {
        const img = new Image()
        img.src = image
        imageURL = await getBase64Image(img)
      } else {
        //Get the data URL of the part inside the crop window if it is not undersized
        imageURL = await getCroppedImg()
      }
      
      // If there is a data URL, create a new form and upload the new image to Cloudinary
      // Then add the result to formData and newForm
      // Doing this here and adding newForm so that only the submitted image is uploaded to Cloudinary
      if (imageURL) {
        const data = new FormData()
        data.append('file', imageURL)
        data.append('upload_preset', preset)
        const res = await axios.post(uploadURL, data)
        console.log('cloudinary response: ', res.data)
        setFormData({ ...formData, image: res.data.url })
        newForm = { ...newForm, image: res.data.url }
      }
    }
    
    // Updating the data base with the new profile
    try {
      const response = await axios.put(`/api/profile/${payload.sub}`, newForm, {
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      })

      //Resetting the token with the new profile picture URL
      const token = response.data.token

      //Updating the token that's in local storage
      window.localStorage.removeItem('plantpedia')
      localStorage.setItem('plantpedia', token)

      //Navigate back to the user's profile
      navigate(`/profile/${formData.username}`)
    } catch (error) {
      console.log(error)
      setPutErrors(true)
    }
  }

  // Update the formData when the user changes username or bio
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Navigate back to user profile if the user clicks cancel
  const handleCancel = async (e) => {
    e.preventDefault()
    navigate(`/profile/${username}`)
  }


  return (
    <Container width='sm' sx={{ display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ m: 5, py: 3, backgroundColor: 'cream' }} >
        <Box
          component='form'
          sx={{ width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center' }}
          onSubmit={handleSubmit}
        >
          <Typography variant='h3' sx={{ pb: 2 }}>Edit Profile</Typography>
          <Grid
            container
            sx={{ width: .90 }}
            rowSpacing={1}
            columnSpacing={1}>
            
            {/* This must be first input So that the file upload only fires when you press the button */}
            <>
              <Input type="text" autofocus="autofocus" />
            </>
              
            {/* Images */}
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              {!srcImg ? 
                <>
                  <Box component='img' src={formData.image} alt='Image to upload' sx={{ height: '300px', width: '300px', objectFit: 'cover' }} />
                  <label htmlFor="icon-button-file">
                    <Input accept="image/*" id="icon-button-file" type="file" onChange={handleImageUpload} />
                    <IconButton aria-label="upload picture" component="span" sx={{ bottom: 25, right: 50, border: 2, borderColor: 'white', boxShadow: 3, backgroundColor: 'rgba(170,170,170,0.5)' }} >
                      <PhotoCamera />
                    </IconButton>
                  </label>
                </>
                :
                !isUndersized ? 
                  <>
                    <Box >
                      <ReactCrop
                        style={{ maxHeight: '350px' }}
                        onImageLoaded={(image) => setImage(image)}
                        crop={crop}
                        onChange={c => setCrop(c)}
                        className='ReactCrop--locked'
                        locked={true}
                      >
                        <img src={srcImg} />
                      </ReactCrop>
                    
                    </Box>
                    <label htmlFor="icon-button-file">
                      <Input accept="image/*" id="icon-button-file" type="file" onChange={handleImageUpload} />
                      <IconButton textAlign="center" aria-label="upload picture" component="span" sx={{ bottom: 0, border: 2, borderColor: 'white', boxShadow: 3, backgroundColor: 'rgba(170,170,170,0.5)' }} >
                        <PhotoCamera />
                      </IconButton>
                    </label>
                  </>
                  :
                  <>
                    <Box component='img' src={srcImg} alt='Uploaded' sx={{ height: '300px', objectFit: 'contain' }} />
                    <label htmlFor="icon-button-file">
                      <Input accept="image/*" id="icon-button-file" type="file" onChange={handleImageUpload} />
                      <IconButton textAlign="center" aria-label="upload picture" component="span" sx={{ bottom: 25, right: '55%', border: 2, borderColor: 'white', boxShadow: 3, backgroundColor: 'rgba(170,170,170,0.5)' }} >
                        <PhotoCamera />
                      </IconButton>
                    </label>
                  </>
              }
            </Grid>

            {/* Bio */}
            <Grid item xs={12} sx={{ my: 1 }}>
              <TextField
                id='bio' 
                placeholder='Bio * (max 150 characters)'
                variant='outlined'
                name='bio'
                inputProps={{ maxLength: 150 }}
                value={formData.bio}
                required
                onChange={handleChange}
                fullWidth />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Container sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                <Button variant="contained" type="submit" size='large' sx={{ width: .48, mx: 0 }}>Submit</Button>
                <Button variant="contained" onClick={handleCancel} size='small' sx={{ width: .48, mx: 0, backgroundColor: 'red' }}>Cancel</Button>
              </Container>
            </Grid>
                
            {putErrors && 
              <Grid item xs={12}>
                <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Typography sx={{ color: 'red' }}>Error. Failed to upload updated profile.</Typography>
                </Container>
              </Grid>
            }
          </Grid>
        </Box>
      </Paper>
    </Container>
  )
}

export default EditProfile