import { useQuery } from '@tanstack/react-query'
import { subDays } from 'date-fns'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { getBookingsAfterDate } from '../../services/apiBookings'

export default function useRecentBookings () {
  const [searchParams] = useSearchParams()
  const numDays = !searchParams.get('last') ? 7 : searchParams.get('last')
  const quarydate = subDays(new Date(), numDays).toISOString()
  const {
    data: bookings,
    error,
    isLoading
  } = useQuery({
    queryKey: ['bookings', `last-${numDays}-days`],
    queryFn: () => getBookingsAfterDate(quarydate)
  })
  return { bookings, error, isLoading }
}
