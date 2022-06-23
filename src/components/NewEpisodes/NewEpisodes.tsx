import React, { FC, useCallback, useEffect, useState } from 'react'
import moment from 'moment'
import { Box, Theme, Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles/makeStyles'
import axios from 'axios'
import NoEpisodes from '../NoEpisodes/NoEpisodes'
import EpisodesAccordion, {
  IEpisode
} from '../EpisodesAccordion/EpisodesAccordion'

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    fontWeight: 'bold'
  }
}))

interface NewEpisodesProps {
  token: string
}

interface Show {
  added_at: string
  show: {
    id: string
    name: string
    description: string
    images: {
      url: string
    }[]
  }
}

const NewEpisodes: FC<NewEpisodesProps> = ({ token }) => {
  const [shows, setShows] = useState<Show[]>([])
  const [next, setNext] = useState('')
  const [newEpisodes, setNewEpisodes] = useState<IEpisode[]>([])
  const classes = useStyles()

  const getShowsData = useCallback(
    (url?: string) => {
      return axios.get(url || 'https://api.spotify.com/v1/me/shows', {
        params: {
          limit: 20
        },
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
    },
    [token]
  )

  const getShowEpisodesData = useCallback(
    (id: string) => {
      return axios.get(`https://api.spotify.com/v1/shows/${id}/episodes`, {
        params: {
          limit: 1
        },
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
    },
    [token]
  )

  useEffect(() => {
    if (!shows.length) {
      getShowsData()
        .then((res) => {
          setShows(res.data.items)
          setNext(res.data.next)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [getShowsData, shows.length, token])

  useEffect(() => {
    if (next) {
      getShowsData(next)
        .then((res) => {
          setShows([...shows, ...res.data.items])
          setNext(res.data.next)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [getShowsData, next, shows])

  useEffect(() => {
    if (!next) {
      const newEp: IEpisode[] = []
      shows.map((show) =>
        getShowEpisodesData(show.show.id)
          .then(
            (res) =>
              moment(res.data.items[0].release_date).isSame(
                new Date(),
                'day'
              ) &&
              newEp.push({ ...res.data.items[0], showName: show.show.name })
          )
          .catch((err) => {
            console.log(err)
          })
      )
      setNewEpisodes(newEp)
    }
  }, [next])

  return (
    <>
      <Box mt={2}>
        <Typography className={classes.title} variant='subtitle1'>
          {moment().format('MMMM Do YYYY')}
        </Typography>
      </Box>
      {newEpisodes.length > 0 ? (
        <Box mt={2}>
          <EpisodesAccordion episodes={newEpisodes} />
        </Box>
      ) : (
        <NoEpisodes />
      )}
    </>
  )
}

export default NewEpisodes
