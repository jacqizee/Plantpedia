import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

//mui
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import ImageListItem from '@mui/material/ImageListItem'
import Masonry from '@mui/lab/Masonry'

export const getImageList = (imagesArray, xsColumns = 3, smColumns = 3, mdColumns = 3, marginY = 0) => {
  return (
    <Container maxWidth='lg' sx={{ my: marginY }}>
      <Masonry columns={{ xs: xsColumns, sm: smColumns, md: mdColumns }} spacing={1}>
        {imagesArray.map(plant => {
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
  )
}