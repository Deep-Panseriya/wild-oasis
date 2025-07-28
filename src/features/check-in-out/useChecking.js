import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateBooking } from '../../services/apiBookings'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export function useChecking () {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutate: checkin, isLoading: isCheckingIn } = useMutation({
    mutationFn: ({ bookingId, breakfast = {} }) =>
      updateBooking(bookingId, {
        status: 'checked-in',
        isPaid: true,
        ...breakfast
      }),
    onSuccess: data => {
      toast.success(`Booking checked in successfully ${data.id}`)
      queryClient.invalidateQueries({ active: true })
      // Invalidate queries related to stays (confirmed, checked-in, and last 7 days)
      //  await queryClient.invalidateQueries({
      //     queryKey: ['stays', 'confirmed', 7],  // Adjust if you're querying bookings for last 7 days a
      //   })

      //   await queryClient.invalidateQueries({
      //     queryKey: ['stays', 'checked-in'],  // Adjust if you're querying checked-in stays
      //   })

      //   // Optionally, invalidate a general "all bookings" query
      //   await queryClient.invalidateQueries({
      //     queryKey: ['stays'],  // This could be for all bookings or any other related data
      //   })
      navigate('/')
    },
    onError: error => {
      toast.error(error.message)
    }
  })
  return { checkin, isCheckingIn }
}
