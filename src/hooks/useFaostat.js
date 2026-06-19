import { useQuery } from '@tanstack/react-query'
import { getFaostatCodes, getFaostatData } from '../api/faostat'

export const useFaostatCodes = (domain, dimension) =>
  useQuery({
    queryKey: ['faostat', 'codes', domain, dimension],
    queryFn: () => getFaostatCodes(domain, dimension),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
  })

export const useFaostatData = (domain, params, { enabled = true } = {}) =>
  useQuery({
    queryKey: ['faostat', 'data', domain, params],
    queryFn: () => getFaostatData(domain, params),
    enabled: enabled && !!params?.area && !!params?.element && !!params?.item,
    staleTime: 1000 * 60 * 60,
  })
