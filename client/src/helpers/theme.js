import { yellow, deepOrange, grey, teal, green } from '@mui/material/colors'

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
        // palette values for light mode
        primary: green,
        secondary: deepOrange,
        text: {
          primary: grey[900],
          secondary: grey[900],
        },
        background: {
          paper: '#fff',
        },
      }
      : {
        // palette values for dark mode
        primary: yellow,
        secondary: green,
        text: {
          primary: grey[100],
          secondary: grey[100],
        },
        background: {
          default: teal[800],
          paper: deepOrange[900],
        },
      }),
  },
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
})

export default getDesignTokens