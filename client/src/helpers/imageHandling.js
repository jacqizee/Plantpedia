import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

//mui
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import Typography from '@mui/material/Typography'
import Masonry from '@mui/lab/Masonry'

import IconButton from '@mui/material/IconButton'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'

export const getImageList = (imagesArray, xsColumns = 3, smColumns = 3, mdColumns = 3, marginY = 0, fromHome = false) => {
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
                {fromHome &&
                  <ImageListItemBar
                    title={plant.name}
                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
                    actionIcon={
                      <>
                        <IconButton
                          sx={{ color: 'white' }}
                          aria-label={`favorites for ${plant.name}`}
                        >
                          <FavoriteIcon />
                        </IconButton>
                        <Typography sx={{ display: 'inline', mr: 2, color: 'white' }}>
                          {plant.favorites.length}
                        </Typography>
                        <IconButton
                          sx={{ color: 'white' }}
                          aria-label={` comments for ${plant.name}`}
                        >
                          <ChatBubbleIcon />
                        </IconButton>
                        <Typography sx={{ display: 'inline', mr: 2, color: 'white' }}>
                          {plant.comments.length}
                        </Typography>
                      </>
                    }
                  />
                }
              </ImageListItem>
            </>
          )
        })}
      </Masonry>
    </Container>
  )
}