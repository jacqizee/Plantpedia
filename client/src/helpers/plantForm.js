import axios from 'axios'
import { getTokenFromLocalStorage } from './auth.js'

// Handles basic form input changes
export const handleChange = (e, setErrors, setFormData, formData) => {
  const { name, value } = e.target
  setErrors(false)
  setFormData({ ...formData, [name]: value })
}

// Handles deleting a plant
export const handleDelete = async (e, navigate, setPutErrors, plantId) => {
  try {
    await axios.delete(`/api/plants/${plantId}`, {
      headers: {
        Authorization: `Bearer ${getTokenFromLocalStorage()}`,
      },
    })
    navigate('/')
  } catch (error) {
    console.log(error)
    setPutErrors(true)
  }
}

// Handles change in units for height/width sliders
export const handleUnitChange = (e, matureSize, setMatureSize, setMax, setStep, setUnit) => {
  const { height, width } = matureSize
  setUnit(e.target.value)
  if (e.target.value === 'in') {
    setMatureSize({ height: Math.ceil(height / 2.54), width: Math.ceil(width / 2.54) })
    setMax(150)
    setStep(10)
  } else if (e.target.value === 'cm') {
    setMatureSize({ height: Math.ceil(height * 2.54), width: Math.ceil(width * 2.54) })
    setMax(380)
    setStep(20)
  }
}

// Handles sliding on the height/width sliders
export const handleSizeChange = (e, setMatureSize, matureSize, setFormData, formData, unit) => {
  const { name, value } = e.target
  setMatureSize({ ...matureSize, [name]: value })
  if (unit === 'cm') {
    setFormData({ ...formData, [name]: Math.ceil(value / 2.54) })
  } else {
    setFormData({ ...formData, [name]: value })
  }
}

// Handles image upload
export const handleImageUpload = async (e, setDisplayImage, setFormData, formData) => {
  const urlString = URL.createObjectURL(e.target.files[0])
  setDisplayImage(urlString)

  const img = new Image()
  img.src = urlString

  img.onload = async function() {
    const widthMoreThanHeight = img.width > img.height ? true : false
    const widthOverHeight = img.width / img.height
    let scale
    let startX
    let startY
    let sideLength
    if (widthMoreThanHeight) {
      scale = img.height / 300
      startX = -(img.width - img.height) / 2
      startY = 0
      sideLength = img.height
    } else if (widthOverHeight === 1){
      scale = img.height / 300
      startX = 0
      startY = 0
      sideLength = img.height
    } else {
      scale = img.width / 300
      startX = 0
      startY = -(img.height - img.width) / 2
      sideLength = img.width
    }

    const canvas = document.createElement('canvas')
    canvas.width = sideLength
    canvas.height = sideLength

    const ctx = canvas.getContext('2d')
    ctx.drawImage(
      img, //image
      startX,
      startY
    )

    const squareImageURL = canvas.toDataURL('image/jpg', 1)
    setFormData({ ...formData, images: squareImageURL })
  }
}