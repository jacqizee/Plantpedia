import React from 'react'
import { Link } from 'react-router-dom'

import sadPlant from '../../images/sad-plant.gif'

import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const NotFound = () => {
  return (
    <Container sx={{ height: '85vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Box component='img' src={sadPlant} alt='sad plant gif' sx={{ width: 150 }} />
      <Typography variant='h4'>Error! Could not fetch data!</Typography>
      <Typography as={Link} to="/" sx={{ textDecoration: 'underline' }}>Back to Home</Typography>
    </Container>
  )
}

export default NotFound