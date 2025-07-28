import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getBooking } from '../../services/apiBookings'

export default function useBooking() {
  const { bookingId } = useParams()
  const {
    isLoading,
    data: bookings,
    error
  } = useQuery({
    queryKey: ['bookings', bookingId],
    queryFn: () => getBooking(bookingId)
  })
  return { isLoading, bookings, error }
}
