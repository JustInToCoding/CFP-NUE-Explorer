import { useQuery } from '@tanstack/react-query'
import { fetchSoilGridsProps, parseSoilGridsProps } from '../api/soilgrids'

export const useFarmSoilGrids = (farm) =>
  useQuery({
    queryKey: ['soilgrids', farm?.latitude, farm?.longitude],
    queryFn: async () => parseSoilGridsProps(
      await fetchSoilGridsProps({ latitude: farm.latitude, longitude: farm.longitude })
    ),
    enabled: farm?.latitude != null && farm?.longitude != null,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
    retry: 1,
  })
