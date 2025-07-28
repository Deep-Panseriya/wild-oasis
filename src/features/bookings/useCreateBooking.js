import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createBooking as createBookingApi } from '../../services/apiBookings'
export default function useCreateBooking () {
  const queryClient = useQueryClient()

  //ANCHOR - CREATE CABINS
  const { isLoading: isCreating, mutate: createBooking } = useMutation({
    //mutationFn: newCabin => createCabins(newCabin),
    mutationFn: createBookingApi,
    onSuccess: () => {
      toast.success('Booking created successfully')
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },

    onError: error => {
      toast.error(error.message)
    }
  })
  return { isCreating, createBooking }
}
