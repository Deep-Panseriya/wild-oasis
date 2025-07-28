import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { deleteCabins as deleteCabinsAPI } from '../../services/apiCabins'
export default function useDeleteCabin () {
  const queryClient = useQueryClient()

  const { isDeleting, mutate: deleteCabin } = useMutation({
    //mutationFn:(id)=> deleteCabins(id),
    mutationFn: deleteCabinsAPI,
    onSuccess: () => {
      toast.success('Cabin deleted'),
        queryClient.invalidateQueries({ queryKey: ['cabins'] })
    },
    onError: error => {
      toast.error(error.message)
    }
  })
  return { isDeleting, deleteCabin }
}
