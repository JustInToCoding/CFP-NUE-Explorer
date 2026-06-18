import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listFarms, getFarm, createFarm } from '../api/farms'

export const useFarms = () =>
  useQuery({ queryKey: ['farms'], queryFn: listFarms })

export const useFarm = (id) =>
  useQuery({
    queryKey: ['farms', id],
    queryFn: () => getFarm(id),
    enabled: !!id,
  })

export const useCreateFarm = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createFarm,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['farms'] }),
  })
}
