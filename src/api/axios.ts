import axios from 'axios'

const customAxios = axios.create({
  baseURL: 'https://api.github.com'
})

export default customAxios
