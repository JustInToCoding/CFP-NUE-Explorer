import { useQuery, useMutation } from '@tanstack/react-query'
import { fetchSoilCharacteristic } from '../api/soil'

export const useSoilCharacteristic = () =>
  useMutation({ mutationFn: fetchSoilCharacteristic })

export const useFarmSoil = (farm) =>
  useQuery({
    queryKey: ['soil', farm?.latitude, farm?.longitude],
    queryFn: () => fetchSoilCharacteristic({ latitude: farm.latitude, longitude: farm.longitude }),
    enabled: farm?.latitude != null && farm?.longitude != null,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
    retry: 1,
  })
