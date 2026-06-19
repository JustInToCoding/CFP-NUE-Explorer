import { useQuery, useQueryClient } from '@tanstack/react-query'
import { listAssessments, getAssessment } from '../api/assessments'

export const useAssessments = (params) =>
  useQuery({
    queryKey: ['assessments', params],
    queryFn: () => listAssessments(params),
  })

const findInListCache = (queryClient, id) => {
  const queries = queryClient.getQueriesData({ queryKey: ['assessments'] })
  for (const [, data] of queries) {
    const list = Array.isArray(data) ? data : data?.assessments ?? data?.data ?? data?.items ?? []
    const found = list.find((a) => a.id === id)
    if (found) return found
  }
  return undefined
}

export const useAssessment = (id) => {
  const queryClient = useQueryClient()
  const cached = id ? findInListCache(queryClient, id) : undefined

  return useQuery({
    queryKey: ['assessment-detail', id],
    queryFn: () => getAssessment(id),
    enabled: !!id,
    placeholderData: cached,
  })
}
