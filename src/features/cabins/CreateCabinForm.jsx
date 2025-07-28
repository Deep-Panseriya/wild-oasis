import { useForm } from 'react-hook-form'

import Input from '../../ui/Input'
import Form from '../../ui/Form'
import Button from '../../ui/Button'
import FileInput from '../../ui/FileInput'
import Textarea from '../../ui/Textarea'
import toast from 'react-hot-toast'
import FormRow from '../../ui/FormRow'
import useCreateCabin from './useCreateCabin'
import useEditCabin from './useEditCabin'

function CreateCabinForm ({ cabinToEdit = {}, onCloseModal }) {
  const { isCreating, createCabin } = useCreateCabin()
  const { isEditing, editCabin } = useEditCabin()

  //ANCHOR -  Edit values
  const { id: editId, ...editValues } = cabinToEdit
  const isEditSession = Boolean(editId)
  const isWorking = isCreating || isEditing

  //ANCHOR - HOOK FORM DECLARATION
  const { register, handleSubmit, reset, getValues, formState } = useForm({
    //ANCHOR - For edit data...
    defaultValues: isEditSession ? editValues : {}
  })
  const { errors } = formState

  //ANCHOR - FORM SUBMIT
  function onSubmit (data) {
    const image = typeof data.image === 'string' ? data.image : data.image[0]
    if (isEditSession) {
      editCabin(
        { newCabinData: { ...data, image }, id: editId },
        {
          onSuccess: () => {
            reset(), onCloseModal?.()
          }
        }
      )
    } else {
      createCabin(
        { ...data, image },
        {
          onSuccess: () => {
            reset(), onCloseModal?.()
          }
        }
      )
      //createCabin({...data , image: data.image[0]})
      //mutate({ ...data, image: data.image[0] })
    }
  }

  //ANCHOR - ERRORS LOGIC
  function onError (errors) {
    if (!errors || Object.keys(errors).length === 0) return
    toast.error('Please fix the highlighted fields.')
  }
  return (
    <>
      <Form
        onSubmit={handleSubmit(onSubmit, onError)}
        type={onCloseModal ? 'modal' : 'regular'}
      >
        <FormRow label='Cabin name' error={errors?.name?.message}>
          <Input
            type='text'
            id='name'
            disabled={isWorking}
            {...register('name', { required: 'This field is required' })}
          />
        </FormRow>

        <FormRow
          label='Maximum capacity'
          htmlFor='maxCapacity'
          error={errors?.maxCapacity?.message}
        >
          <Input
            type='number'
            id='maxCapacity'
            disabled={isWorking}
            {...register('maxCapacity', {
              required: 'This field is required',
              min: {
                value: 1,
                message: 'Capacity should be at least 1'
              }
            })}
          />
        </FormRow>

        <FormRow
          label='Regular price'
          htmlFor='regularPrice'
          error={errors?.regularPrice?.message}
        >
          <Input
            type='number'
            id='regularPrice'
            disabled={isWorking}
            {...register('regularPrice', {
              required: 'This field is required',
              min: {
                value: 1,
                message: 'Price should be at least 1'
              }
            })}
          />
        </FormRow>

        <FormRow
          label='Discount'
          htmlFor='discount'
          error={errors?.discount?.message}
        >
          <Input
            type='number'
            id='discount'
            disabled={isWorking}
            defaultValue={0}
            {...register('discount', {
              required: 'This field is required',
              validate: value =>
                Number(value) <= Number(getValues().regularPrice) ||
                'Discount should be less than regular price'
            })}
          />
        </FormRow>

        <FormRow
          label='Description for website'
          htmlFor='description'
          error={errors?.description?.message}
        >
          <Textarea
            id='description'
            defaultValue=''
            disabled={isWorking}
            {...register('description', { required: 'This field is required' })}
          />
        </FormRow>

        <FormRow
          label='image for cabin'
          htmlFor='image'
          error={errors?.image?.message}
        >
          <FileInput
            id='image'
            accept='image/*'
            {...register('image', {
              required: isEditSession ? false : 'This field id required'
            })}
          />
        </FormRow>

        <FormRow>
          {/* type is an HTML attribute! */}
          <Button size='medium' type='reset' onClick={() => onCloseModal?.()}>
            Cancel
          </Button>
          <Button
            variation='primary'
            size='medium'
            type='submit'
            disabled={isCreating}
          >
            {isEditSession ? 'Edit Cabin' : 'Create Cabin'}
          </Button>
        </FormRow>
      </Form>
    </>
  )
}

export default CreateCabinForm
