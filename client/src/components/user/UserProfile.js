import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

//mui
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import Typography from '@mui/material/Typography'
import Masonry from '@mui/lab/Masonry'
import IconButton from '@mui/material/IconButton'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Grid from '@mui/material/Grid'

import philip from '../../images/philip.png'



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
          <Typography>{children}</Typography>
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

  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    console.log('handle change runs')
    console.log('event is: ', event)
    console.log('new value is: ', newValue)
    setValue(newValue)
  }

  return (
    <>
      <Container maxWidth='lg' sx={{ flexGrow: 1, justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
        <Box sx={{ flexGrow: 1, justifyContent: 'center', display: 'flex', mt: 4 }}>
          {/* Profile Picture */}
          <Grid xs={4} >
            <Avatar alt="Philip Sopher" src={philip} sx={{ width: 96, height: 96 }} />
          </Grid>

          {/* About Me */}
          <Grid xs={6} sx={{ ml: 8 }} >
            <Stack spacing={0} >
              <Box sx={{ flexGrow: 1, justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
                <Typography align="center">username</Typography>
                <Button href="#">Edit</Button>
              </Box>
              <Box>
                <Typography sx={{ mt: 0, mb: 0 }}><strong>12</strong> posts </Typography>
              </Box>
              <Box sx={{ flexGrow: 1, display: 'flex', flexWrap: 'wrap', maxWidth: '350px' }} >
                <Typography sx={{ mt: 0, mb: 0, pr: 2, width: '100%' }}>33 yo cactus lover ...and cherry plum <em>lover</em>.</Typography>
              </Box>
            </Stack>
          </Grid>
        </Box>

        {/* Tabs */}
        <Box sx={{ mt: 2 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="secondary tabs example"
          >
            <Tab value="0" label="Item One" {...a11yProps(0)} />
            <Tab value="1" label="Item Two" {...a11yProps(1)} />
            <Tab value="2" label="Item Three" {...a11yProps(2)} />
          </Tabs>
        </Box>

        {/* Image Lists */}
        <TabPanel value={value} index={0}>
          Item One
        </TabPanel>
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel>

      </Container>
    </>
  )
}

export default UserProfile