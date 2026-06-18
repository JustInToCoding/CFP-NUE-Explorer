import { get, post } from './client'

export const listFarms = () => get('/farms')
export const getFarm = (id) => get(`/farms/${id}`)
export const createFarm = (data) => post('/farms', data)
