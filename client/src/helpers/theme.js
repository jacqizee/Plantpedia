import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  typography: {
    fontFamily: 'Raleway, Arial',
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: 'h1',
          h2: 'h1',
          h3: 'h1',
          h4: 'h2',
          h5: 'h2',
          h6: 'h2',
          subtitle1: 'p',
          subtitle2: 'p',
          body1: 'span',
          body2: 'span',
        },
      },
    },
  },
  palette: {
    background: {
      default: '#1a202c',
    },
  },
})