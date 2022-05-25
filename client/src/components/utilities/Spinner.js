import React from 'react'

// Import spinner image
import spinner from '../../images/plant-growing.gif'

import Box from '@mui/material/Box'

const Spinner = () => (
  <Box sx={{ width: 200 }}>
    <Box component='img' src={spinner} alt="Spinner" className="spinner" />
  </Box>
)

export default Spinner