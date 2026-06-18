import { post } from './client'

export const fetchSoilCharacteristic = ({ latitude, longitude }) =>
  post('/soil-characteristic', { latitude, longitude })
