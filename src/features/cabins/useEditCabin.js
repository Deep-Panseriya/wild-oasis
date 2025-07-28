//ANCHOR This file contains a custom hook for editing cabins using React Query.
//ANCHOR It uses the useMutation hook to handle the mutation and provides a function to edit cabin by its ID.

import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createEditCabins } from '../../services/apiCabins'

export default function useEditCabin () {
  const queryClient = useQueryClient()

  //ANCHOR - EDIT CABINS
  const { isLoading: isEditing, mutate: editCabin } = useMutation({
    //mutationFn: newCabin => createCabins(newCabin),
    mutationFn: ({ newCabinData, id }) => createEditCabins(newCabinData, id),
    onSuccess: () => {
      toast.success('Cabin edited successfully')
      queryClient.invalidateQueries({ queryKey: ['cabins'] })
    },

    onError: error => {
      toast.error(error.message)
    }
  })
  return { isEditing, editCabin }
}
