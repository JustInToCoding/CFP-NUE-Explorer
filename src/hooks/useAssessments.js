import { useQuery } from '@tanstack/react-query'
import { listAssessments, getAssessment } from '../api/assessments'

export const useAssessments = (params) =>
  useQuery({
    queryKey: ['assessments', params],
    queryFn: () => listAssessments(params),
  })

export const useAssessment = (id) =>
  useQuery({
    queryKey: ['assessments', id],
    queryFn: () => getAssessment(id),
    enabled: !!id,
  })
