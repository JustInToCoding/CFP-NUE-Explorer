import { get } from './client'

export const listAssessments = (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return get(`/assessments${query ? `?${query}` : ''}`)
}

export const getAssessment = (id) => get(`/assessments/${id}`)
