import React, { FC } from 'react'
import Typography from '@mui/material/Typography/Typography'
import Grid from '@mui/material/Grid/Grid'
import Button from '@mui/material/Button/Button'
import { ReplayCircleFilledOutlined } from '@mui/icons-material'
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb'
import Box from '@mui/material/Box/Box'

const NoEpisodes: FC = () => {
  return (
    <Box mt={6}>
      <Grid container direction='column' alignItems='center'>
        <Grid item>
          <DoNotDisturbIcon />
        </Grid>
        <Grid item>
          <Typography variant='subtitle1'>
            There are no episodes. Come back later!
          </Typography>
        </Grid>
      </Grid>
    </Box>
  )
}

export default NoEpisodes
