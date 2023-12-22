import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

export const setToken = newToken => {
  token = `Bearer ${newToken}`
}

export const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

export const create = newObject => {
  const config = {
    headers: { Authorization: token }
  }

  const request = axios.post(baseUrl, newObject, config)
  return request.then(response => response.data)
}

export const update = newObject => {
  const request = axios.put(`${baseUrl}/${newObject.id}`, newObject)
  return request.then(response => response.data)
}

export const remove = objectToDelete => {
  const config = {
    headers: { Authorization: token }
  }
  const request = axios.delete(`${baseUrl}/${objectToDelete.id}`, config)
  return request.then(response => response.data)
}

export default { 
  setToken, 
  getAll,
  create,
  update,
  remove
}