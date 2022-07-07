import axios from 'axios'

let token = ''

chrome.storage.local.get(['authToken'], (data) => {
  token = data['authToken']
})

const api = () => {
  const getShowsData = (url?: string) => {
    return axios.get(url || 'https://api.spotify.com/v1/me/shows', {
      params: {
        limit: 20
      },
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
  }
  return {
    getShowsData
  }
}

export default api
