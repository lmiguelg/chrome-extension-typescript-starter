import {
  AppBar,
  Avatar,
  Box,
  Container,
  CssBaseline,
  Grid,
  Toolbar,
  Typography
} from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import NewEpisodes from './components/NewEpisodes/NewEpisodes'
import { ThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import theme from './styles/theme'

interface User {
  display_name: string
  id: string
  images: {
    url: string
  }[]
}

const Popup = () => {
  const [user, setUser] = useState<User | undefined>(undefined)
  const [token, setToken] = useState<string>()

  const getUserData = (accessToken: string) => {
    return axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    })
  }

  useEffect(() => {
    if (!token)
      chrome.runtime.sendMessage({ message: 'login' }, function (response) {
        if (response.message === 'success') setToken(response.token)
        chrome.storage.local.set({ authToken: response.token })
      })
  }, [])

  useEffect(() => {
    if (token) {
      getUserData(token)
        .then((res) => {
          setUser(res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [token])

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          minWidth: '700px',
          minHeight: '700px'
        }}
      >
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <AppBar position='static' color='primary'>
            <Toolbar variant='dense'>
              <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                Daily Pods
              </Typography>
              {user && (
                <>
                  <Box mr={2}>
                    <Typography variant='body1'>{`Hello, ${
                      user.display_name.split(' ')[0]
                    }`}</Typography>
                  </Box>
                  <Avatar
                    src={user.images[0]?.url}
                    style={{ border: '4px solid white' }}
                  />
                </>
              )}
            </Toolbar>
          </AppBar>
          <Container>
            <Grid container>
              <Grid item xs={12}>
                {user && token && <NewEpisodes token={token} />}
              </Grid>
            </Grid>
          </Container>
        </LocalizationProvider>
      </div>
    </ThemeProvider>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('root')
)
