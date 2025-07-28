import { useQuery } from '@tanstack/react-query'
import { getConfirmedStays } from '../../services/apiBookings'

export function useConfirmedStays (days) {
  return useQuery(['stays', 'confirmed', days], () => getConfirmedStays(days), {
    staleTime: 0
  })
}
