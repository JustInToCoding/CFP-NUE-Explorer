import { useMutation } from '@tanstack/react-query'
import { fetchSoilCharacteristic } from '../api/soil'

export const useSoilCharacteristic = () =>
  useMutation({ mutationFn: fetchSoilCharacteristic })
