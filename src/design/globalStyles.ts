import { createTheme } from '@mui/material/styles'
import { enUS } from '@mui/material/locale'

import { palette } from './colors'

declare module '@mui/material/styles' 

const background = '#E0E1DD'

const theme = createTheme({
	palette,
	typography: {
		fontFamily: 'Quicksand',
	},
	components: {
		MuiTypography: {
			styleOverrides: {
				root: {
					color: 'primary'
				}
			}
		},
		MuiCssBaseline: {
			styleOverrides: {
				body:  {
					backgroundColor: background,
					minHeight: '100vh'
				}
			}
		},
		MuiButton: {
			defaultProps: {
				variant: 'contained'
			},
			styleOverrides: {
				root: {
					fontSize: '1rem',
					borderRadius: '5px',
					marginTop: '10px',
					marginBottom: '10px',
					display: 'flex'
				}
			}
		},
		MuiTextField: {
			defaultProps: {
				variant: 'outlined', 
			},
			styleOverrides: {
				root: {
					margin: '5px'
				}
			}
		}
	}
}, enUS)

export default theme