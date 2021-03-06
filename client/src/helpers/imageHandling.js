import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

//mui
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import Typography from '@mui/material/Typography'
import Masonry from '@mui/lab/Masonry'

import FavoriteIcon from '@mui/icons-material/Favorite'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'

export const getImageList = (imagesArray, xsColumns = 3, smColumns = 3, mdColumns = 3, marginY = 0, fromHome = false) => {
  return (
    <Container key={'1'} maxWidth='lg' sx={{ my: marginY }}>
      <Box sx={{ marginLeft: '6px' }}>
        <Masonry key={'2'} columns={{ xs: xsColumns, sm: smColumns, md: mdColumns }} spacing={1}>
          {imagesArray.map(plant => {
            return (
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
                        <Box sx={{ display: 'flex', alignItems: 'center' }} >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FavoriteIcon sx={{ color: 'white' }}
                              aria-label={`favorites for ${plant.name}`} />
                            <Typography sx={{ display: 'inline', mr: 2, ml: 1, color: 'white' }}>
                              {plant.favorites.length}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ChatBubbleIcon sx={{ color: 'white' }}
                              aria-label={` comments for ${plant.name}`} />
                            <Typography sx={{ display: 'inline', mr: 2, ml: 1, color: 'white' }}>
                              {plant.comments.length}
                            </Typography>
                          </Box>
                        </Box>
                      </>
                    }
                  />
                }
              </ImageListItem>
            )
          })}
        </Masonry>
      </Box>
    </Container>
  )
}