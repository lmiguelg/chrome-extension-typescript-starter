import React, { FC, useCallback, useEffect, useState } from 'react'
import moment from 'moment'
import { Box, TextField, Theme, Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles/makeStyles'
import axios from 'axios'
import NoEpisodes from '../NoEpisodes/NoEpisodes'
import EpisodesAccordion, {
  IEpisode
} from '../EpisodesAccordion/EpisodesAccordion'
import { DatePicker } from '@mui/x-date-pickers'
import api from '../../api'

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
  const { getShowsData } = api()
  const [shows, setShows] = useState<Show[]>([])
  const [next, setNext] = useState('')
  const [newEpisodes, setNewEpisodes] = useState<IEpisode[]>([])
  const [date, setDate] = useState(new Date())
  const classes = useStyles()

  // const getShowsData = (url?: string) => {
  //   return axios.get(url || 'https://api.spotify.com/v1/me/shows', {
  //     params: {
  //       limit: 20
  //     },
  //     headers: {
  //       Authorization: 'Bearer ' + token
  //     }
  //   })
  // }

  const getShowEpisodesData = (id: string) => {
    return axios.get(`https://api.spotify.com/v1/shows/${id}/episodes`, {
      params: {
        limit: 1
      },
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
  }

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
    } else if (next) {
      getShowsData(next)
        .then((res) => {
          setShows([...shows, ...res.data.items])
          setNext(res.data.next)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [getShowsData, shows.length, token, next])

  useEffect(() => {
    if (!next) {
      let newEp: IEpisode[] = []
      shows.map((show) =>
        getShowEpisodesData(show.show.id)
          .then(
            (res) =>
              moment(res.data.items[0].release_date).isSame(date, 'day') &&
              newEp.push({ ...res.data.items[0], showName: show.show.name })
          )
          .catch((err) => {
            console.log(err)
          })
      )

      setNewEpisodes(newEp)
    }
  }, [next, date])

  return (
    <>
      <Box mt={2}>
        <Typography className={classes.title} variant='subtitle1'>
          {moment().format('MMMM Do YYYY')}
        </Typography>
        <Box>
          <DatePicker
            label='Date'
            value={date}
            inputFormat='DD/MM/YYYY'
            onChange={(newDate) => {
              setDate(new Date(newDate || date))
              setShows([])
              setNext('')
              setNewEpisodes([])
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>
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
