import { PlayCircleOutlined } from '@mui/icons-material'
import {
  AccordionDetails,
  Avatar,
  Box,
  Grid,
  IconButton,
  Theme,
  Typography
} from '@mui/material'
import Accordion from '@mui/material/Accordion/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary/AccordionSummary'

import React, { FC, useCallback } from 'react'
import makeStyles from '@mui/styles/makeStyles/makeStyles'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export interface IEpisode {
  id: string
  name: string
  description: string
  release_date: string
  resume_point: {
    fully_played: boolean
    resume_position_ms: number
  }
  images: {
    url: string
  }[]
  uri: string
  showName: string
}

interface Props {
  episodes: IEpisode[]
}

const useStyles = makeStyles((theme: Theme) => ({
  row: {
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: theme.palette.action.hover
    }
  },
  title: {
    fontWeight: 'bold'
  },
  description: {
    backgroundColor: theme.palette.action.hover
  }
}))

const EpisodesAccordion: FC<Props> = ({ episodes }) => {
  const classes = useStyles()
  const handleRedirectEpisode = useCallback((uri: string) => {
    window.location.href = uri
  }, [])
  return (
    <>
      {episodes.map((episode) => (
        <Accordion key={episode.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box p={1}>
              <Avatar
                alt={episode.name}
                variant='rounded'
                src={episode.images[0].url}
                sx={{ width: 70, height: 70 }}
              />
            </Box>
            <Grid container>
              <Grid container item xs={10}>
                <Grid item xs={12}>
                  <Typography variant='caption'>
                    {episode.release_date}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography className={classes.title} variant='body2'>
                    {episode.name}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='caption'>{episode.showName}</Typography>
                </Grid>
              </Grid>
              <Grid
                container
                direction='column'
                item
                xs={2}
                justifyContent='center'
              >
                <Grid item>
                  <IconButton
                    size='small'
                    onClick={() => handleRedirectEpisode(episode.uri)}
                  >
                    <PlayCircleOutlined />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails className={classes.description}>
            <Typography variant='caption'>{episode.description}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  )
}

export default EpisodesAccordion
