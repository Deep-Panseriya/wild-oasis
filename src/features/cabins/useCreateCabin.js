import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createEditCabins } from '../../services/apiCabins'
export default function useCreateCabin() {
    const queryClient = useQueryClient()

    //ANCHOR - CREATE CABINS
    const { isLoading: isCreating, mutate: createCabin } = useMutation({
      //mutationFn: newCabin => createCabins(newCabin),
      mutationFn: createEditCabins,
      onSuccess: () => {
        toast.success('Cabin added')
        queryClient.invalidateQueries({ queryKey: ['cabins'] })
      },
  
      onError: error => {
        toast.error(error.message)
      }
    })
    return { isCreating, createCabin }
}
