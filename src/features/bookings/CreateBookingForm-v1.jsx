import { useForm } from 'react-hook-form'
import Input from '../../ui/Input'
import Form from '../../ui/Form'
import Button from '../../ui/Button'
import toast from 'react-hot-toast'
import FormRow from '../../ui/FormRow'
import { useState, useEffect, useRef, useMemo } from 'react'
import useCreateBooking from './useCreateBooking'
import supabase from '../../services/supabase'
//import { useQuery } from '@tanstack/react-query'
import useCabin from '../cabins/useCabin'

function CreateBookingFormV1 ({ bookingToEdit = {}, onCloseModal }) {
  const { isCreating, createBooking } = useCreateBooking()
  const { cabins } = useCabin()
  //const [additionalGuests, setAdditionalGuests] = useState([])
  const [showScrollIndicator, setShowScrollIndicator] = useState(false)
  const [selectedCabin, setSelectedCabin] = useState(null)

  //   const { data: cabins } = useQuery({
  //     queryKey: ['cabins'],
  //     queryFn: async () => {
  //       const { data, error } = await supabase.from('cabins').select('*')
  //       if (error) throw error
  //       return data
  //     }
  //   })

  const { register, handleSubmit, getValues, formState, watch, setValue } =
    useForm({
      defaultValues: bookingToEdit
    })
  const { errors } = formState

  const formRef = useRef(null)
  const numGuests = watch('numGuests', 1)
  const startDate = watch('startDate')
  const endDate = watch('endDate')
  const cabinId = watch('cabinId')
  const extraPrice = watch('extraPrice', 0)
  const hasBreakfast = watch('hasBreakfast', false)

  const numNights = Math.ceil(
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
  )
  useEffect(() => {
    if (cabinId) {
      const cabin = cabins?.find(c => c.id === 
      parseInt(cabinId))
      setSelectedCabin(cabin)
    }
  }, [cabinId, cabins])

  // Memoize price calculations
  const prices = useMemo(() => {
    if (!startDate || !endDate || !selectedCabin) return null

    const cabinPrice =
      numNights * (selectedCabin.regularPrice - selectedCabin.discount)
    // const breakfastPrice = hasBreakfast ? numNights * 15 * numGuests : 0;
    const breakfastPrice = hasBreakfast ? numNights * 15 * numGuests : 0

    const extraPrice = breakfastPrice + Number(extraPrice)
    const totalPrice = cabinPrice + extraPrice

    return { cabinPrice, extraPrice, totalPrice }
  }, [
    selectedCabin,
    hasBreakfast,
    numGuests,
    extraPrice,
    startDate,
    endDate,
    numNights
  ])

  // Update form values when prices change
  useEffect(() => {
    if (prices) {
      setValue('cabinPrice', prices.cabinPrice)
      setValue('extraPrice', prices.extraPrice)
      setValue('totalPrice', prices.totalPrice)
    }
  }, [prices, setValue])

  //   useEffect(() => {
  //     const count = parseInt(numGuests) || 1
  //     if (count > 1) {
  //       setAdditionalGuests(Array.from({ length: count - 1 }, (_, i) => i))
  //     } else {
  //       setAdditionalGuests([])
  //     }
  //   }, [numGuests])

  useEffect(() => {
    const form = formRef.current
    if (!form) return
    const checkScroll = () => {
      const hasScroll = form.scrollHeight > form.clientHeight
      setShowScrollIndicator(hasScroll)
    }

    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [])

  const scrollToBottom = () => {
    const form = formRef.current
    if (!form) return

    form.scrollTo({
      top: form.scrollHeight,
      behavior: 'smooth'
    })
  }

  async function onSubmit (data) {
    try {
      // First create the guest record
      const { data: guestData, error: guestError } = await supabase
        .from('guests')
        .insert([
          {
            fullName: data.fullName,
            email: data.email,
            nationalID: data.nationalID,
            nationality: data.nationality,
            countryFlag: data.countryFlag
          }
        ])
        .select()
        .single()

      if (guestError) throw guestError

      // Then create the booking with the guest ID
      //   const numNights = Math.ceil(
      //     (new Date(data.endDate) - new Date(data.startDate)) /
      //       (1000 * 60 * 60 * 24)
      //   )
      const bookingData = {
        cabinId: data.cabinId,
        guestId: guestData.id,
        startDate: data.startDate,
        endDate: data.endDate,
        numGuests: data.numGuests,
        status: data.status,
        numNights,
        cabinPrice: data.cabinPrice,
        extraPrice: data.extraPrice,
        totalPrice: data.totalPrice,
        isPaid: false,
        hasBreakfast: data.hasBreakfast === 'true',
        observations: ''
      }

      await createBooking(bookingData)
      onCloseModal?.()
    } catch (error) {
      toast.error(error.message)
    }
  }

  function onError (errors) {
    if (!errors || Object.keys(errors).length === 0) return
    toast.error('Please fix the highlighted fields.')
  }

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <Form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit, onError)}
        type={onCloseModal ? 'modal' : 'regular'}
        style={{
          maxHeight: 'calc(100vh - 200px)',
          overflowY: 'auto',
          scrollBehavior: 'smooth',
          paddingRight: showScrollIndicator ? '1rem' : '0'
        }}
      >
        <FormRow label='Cabin' error={errors?.cabinId?.message}>
          <select
            id='cabinId'
            {...register('cabinId', { required: 'This field is required' })}
          >
            <option value=''>Select a cabin</option>
            {cabins?.map(cabin => (
              <option key={cabin.id} value={cabin.id}>
                {cabin.name} - {cabin.maxCapacity} guests ($
                {cabin.regularPrice - cabin.discount}/night)
              </option>
            ))}
          </select>
        </FormRow>

        <FormRow label='Full Name' error={errors?.fullName?.message}>
          <Input
            type='text'
            id='fullName'
            {...register('fullName', { required: 'This field is required' })}
          />
        </FormRow>

        <FormRow label='Email' error={errors?.email?.message}>
          <Input
            type='email'
            id='email'
            {...register('email', {
              required: 'This field is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
        </FormRow>

        <FormRow label='National ID' error={errors?.nationalID?.message}>
          <Input
            type='text'
            id='nationalID'
            {...register('nationalID', { required: 'This field is required' })}
          />
        </FormRow>

        <FormRow label='Nationality' error={errors?.nationality?.message}>
          <Input
            type='text'
            id='nationality'
            {...register('nationality', { required: 'This field is required' })}
          />
        </FormRow>

        <FormRow label='Country Flag' error={errors?.countryFlag?.message}>
          <Input
            type='text'
            id='countryFlag'
            placeholder='e.g. 🇺🇸'
            {...register('countryFlag', { required: 'This field is required' })}
          />
        </FormRow>

        <FormRow label='Number of guests' error={errors?.numGuests?.message}>
          <Input
            type='number'
            id='numGuests'
            {...register('numGuests', {
              required: 'This field is required',
              min: { value: 1, message: 'Minimum 1 guest' },
              max: { value: 5, message: 'Maximum 5 guests per room' }
            })}
          />
        </FormRow>

        {/* {additionalGuests.map(index => (
          <div
            key={index}
            style={{
              marginTop: '1rem',
              marginBottom: '1rem',
              padding: '1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              backgroundColor: '#f9fafb'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '0.75rem',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid #e5e7eb'
              }}
            >
              <div
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  marginRight: '0.75rem'
                }}
              >
                Guest {index + 2}
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '0.875rem',
                  color: '#374151',
                  fontWeight: '600'
                }}
              >
                Additional Guest
              </h3>
            </div>

            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <FormRow
                label='Guest name'
                error={errors?.[`additionalGuest${index}Name`]?.message}
              >
                <Input
                  type='text'
                  id={`additionalGuest${index}Name`}
                  {...register(`additionalGuest${index}Name`, {
                    required: 'This field is required'
                  })}
                />
              </FormRow>

              <FormRow
                label='Email'
                error={errors?.[`additionalGuest${index}Email`]?.message}
              >
                <Input
                  type='email'
                  id={`additionalGuest${index}Email`}
                  {...register(`additionalGuest${index}Email`, {
                    required: 'This field is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
              </FormRow>
            </div>
          </div>
        ))} */}

        <FormRow label='Start date' error={errors?.startDate?.message}>
          <Input
            type='date'
            id='startDate'
            {...register('startDate', {
              required: 'This field is required',
              validate: value => {
                const today = new Date()
                const selectedDate = new Date(value)
                return (
                  selectedDate >= today || 'Start date cannot be in the past'
                )
              }
            })}
          />
        </FormRow>

        <FormRow label='End date' error={errors?.endDate?.message}>
          <Input
            type='date'
            id='endDate'
            {...register('endDate', {
              required: 'This field is required',
              validate: value => {
                const startDate = new Date(getValues().startDate)
                const endDate = new Date(value)
                return (
                  endDate > startDate || 'End date must be after start date'
                )
              }
            })}
          />
        </FormRow>

        <FormRow label='Status' error={errors?.status?.message}>
          <select
            id='status'
            {...register('status', { required: 'This field is required' })}
          >
            <option value='unconfirmed'>Unconfirmed</option>
            <option value='confirmed'>Confirmed</option>
            <option value='checked-in'>Checked in</option>
          </select>
        </FormRow>

        <FormRow label='Breakfast' error={errors?.hasBreakfast?.message}>
          <select
            id='hasBreakfast'
            {...register('hasBreakfast', {
              required: 'This field is required'
            })}
          >
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </FormRow>

        <FormRow label='Cabin Price' error={errors?.cabinPrice?.message}>
          <Input
            type='number'
            id='cabinPrice'
            disabled
            {...register('cabinPrice', { required: 'This field is required' })}
          />
        </FormRow>

        <FormRow label='Extra Price' error={errors?.extraPrice?.message}>
          <Input
            type='number'
            id='extraPrice'
            {...register('extraPrice', {
              required: 'This field is required',
              min: { value: 0, message: 'Extra price cannot be negative' }
            })}
          />
        </FormRow>

        <FormRow label='Total Price' error={errors?.totalPrice?.message}>
          <Input
            type='number'
            id='totalPrice'
            disabled
            {...register('totalPrice', { required: 'This field is required' })}
          />
        </FormRow>

        {showScrollIndicator && (
          <div
            onClick={scrollToBottom}
            style={{
              position: 'absolute',
              right: '1rem',
              bottom: '5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.5rem',
              borderRadius: '50%',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2.5rem',
              height: '2.5rem',
              transition: 'all 0.2s',
              ':hover': {
                backgroundColor: '#2563eb',
                transform: 'scale(1.1)'
              }
            }}
          >
            ↓
          </div>
        )}

        <div
          style={{
            position: 'sticky',
            bottom: 0,
            backgroundColor: 'white',
            padding: '1rem 0',
            borderTop: '1px solid #e5e7eb',
            marginTop: '1rem',
            zIndex: 10
          }}
        >
          <FormRow>
            <Button
              variation='secondary'
              type='reset'
              onClick={() => onCloseModal?.()}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create booking'}
            </Button>
          </FormRow>
        </div>
      </Form>
    </div>
  )
}

export default CreateBookingFormV1
