import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import GitHubIcon from '@mui/icons-material/GitHub'

const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'secondary.light', color: 'secondary.contrastText', position: 'relative', bottom: 0, width: '100vw', textAlign: 'center', py: 2 }}>
      <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Made with ❤️ by 
        Jacqueline <Box component='a' href='https://github.com/jacqizee/' target='__blank__' sx={{ display: 'flex', '&:hover': { cursor: 'pointer', color: 'secondary.dark' } }}><GitHubIcon sx={{ height: '1rem' }} /></Box>, 
        Philip <Box component='a' href='https://github.com/psopher' target='__blank__' sx={{ display: 'flex', '&:hover': { cursor: 'pointer', color: 'secondary.dark' } }}><GitHubIcon sx={{ height: '1rem' }} /></Box>, 
        Rob <Box component='a' href='https://github.com/greezyBob/' target='__blank__' sx={{ display: 'flex', '&:hover': { cursor: 'pointer', color: 'secondary.dark' } }}><GitHubIcon sx={{ height: '1rem' }} /></Box>
      </Typography>
    </Box>
  )
}

export default Footer