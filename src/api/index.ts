import axios, { AxiosRequestConfig } from 'axios'

let token = ''

chrome.storage.local.get(['authToken'], (data) => {
  token = data['authToken']
})

const headers = {
  Authorization: `Bearer ${token}`
}

const getApi = (
  url: string,
  config?: AxiosRequestConfig,
  isLongUrl?: boolean
) =>
  axios.get(isLongUrl ? url : `https://api.spotify.com/v1/${url}`, {
    headers,
    ...config
  })

const api = () => {
  const getUserData = () => getApi('me')

  const getShowsData = (url?: string, isLongUrl?: boolean) =>
    getApi(
      url || 'me/shows',
      {
        params: {
          limit: 20
        },
        headers: {
          Authorization: 'Bearer ' + token
        }
      },
      isLongUrl
    )

  const getShowEpisodesData = (id: string) =>
    getApi(`shows/${id}/episodes`, {
      params: {
        limit: 1
      },
      headers: {
        Authorization: 'Bearer ' + token
      }
    })

  return {
    getShowsData,
    getUserData,
    getShowEpisodesData
  }
}

export default api
