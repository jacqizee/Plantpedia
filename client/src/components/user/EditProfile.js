import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

import { getPayload, getTokenFromLocalStorage, userIsOwner } from '../../helpers/auth'

// MUI Imports
import Container from '@mui/material/InputLabel'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import Slider from '@mui/material/Slider'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import OutlinedInput from '@mui/material/OutlinedInput'
import Chip from '@mui/material/Chip'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Paper from '@mui/material/Paper'
import AddIcon from '@mui/icons-material/Add'
import { styled } from '@mui/material/styles'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/src/ReactCrop.scss'

const EditProfile = () => {

  const Input = styled('input')({
    display: 'none',
  })

  const { username } = useParams()

  const payload = getPayload()

  const navigate = useNavigate()

  const uploadURL = process.env.REACT_APP_CLOUDINARY_URL
  const preset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET

  //loading and error state
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(false)

  //Cropping
  const [isUndersized, setIsUndersized] = useState(false)
  const [srcImg, setSrcImg] = useState(null)
  const [image, setImage] = useState(null)
  const [crop, setCrop] = useState({
    unit: 'px', // Can be 'px' or '%'
    x: 10,
    y: 25,
    width: 300,
    height: 300,
    aspect: 1,
    keepSelection: true,
    // locked: true,
  })
  const [result, setResult] = useState(null)

  const [ formData, setFormData ] = useState({
    username: username,
    image: payload.profilePicture,
    bio: '',
  })

  useEffect(() => {
    const getData = async () => {
      try {
        if (!payload) {
          navigate('/login')
        }

        const { data } = await axios.get(`/api/profile/${payload.sub}`, {
          headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          },
        })

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
    setResult(null)
    setCrop({
      ...crop,
      x: 10,
      y: 25,
    })
    const urlString = URL.createObjectURL(e.target.files[0])
    setSrcImg(urlString)
    setImage(urlString)

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

  const getBase64Image = (img) => {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    return canvas.toDataURL('image/jpg', 1)
  }

  const getCroppedImg = async () => {

    const img = new Image()
    img.src = image

    const heightMoreThan350px = img.height > 350 ? true : false
    const widthMoreThan350px = img.width > 350 ? true : false

    try {
      const canvas = document.createElement('canvas')
      let scale
      if (heightMoreThan350px) {
        scale = img.height / 350
      } else {
        scale = 1
      }
      const scaleX = img.naturalWidth / img.width
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

    let newForm = { ...formData }
    let imageURL

    if (srcImg) {
      if (isUndersized) {
        const img = new Image()
        img.src = image
        imageURL = await getBase64Image(img)
      } else {
        imageURL = await getCroppedImg()
      }
      
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
    

    try {
      const response = await axios.put(`/api/profile/${payload.sub}`, newForm, {
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      })


      const token = response.data.token


      window.localStorage.removeItem('plantpedia')
      localStorage.setItem('plantpedia', token)

      navigate(`/profile/${username}`)
    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

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
                        // src={srcImg}
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
                    {/* <Button className="cropButton" onClick={getCroppedImg}>
                      Crop
                    </Button> */}
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
          </Grid>
        </Box>
      </Paper>
    </Container>
  )
}

export default EditProfile