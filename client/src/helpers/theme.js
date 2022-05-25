import { amber, deepOrange, grey, teal, green } from '@mui/material/colors'

const getDesignTokens = (mode) => ({
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
    mode,
    primary: {
      main: green[800],
      ...(mode === 'dark' && {
        main: amber[300],
      }),
    },
    secondary: {
      main: deepOrange[400],
      ...(mode === 'dark' && {
        main: amber[300],
      }),
    },
    ...(mode === 'dark' && {
      background: {
        default: teal[900],
        paper: deepOrange[900],
      },
    }),
    text: {
      ...(mode === 'light'
        ? {
          primary: grey[900],
          secondary: grey[800],
        }
        : {
          primary: '#fff',
          secondary: grey[500],
        }),
    },
  },
})

export default getDesignTokens