/* eslint-disable no-unused-vars */
import { useForm } from 'react-hook-form'
import Input from '../../ui/Input'
import Form from '../../ui/Form'
import Button from '../../ui/Button'
import toast from 'react-hot-toast'
import FormRow from '../../ui/FormRow'
import { useRef, useState } from 'react'
import useCreateBooking from './useCreateBooking'
import supabase from '../../services/supabase'
//import { useQuery } from '@tanstack/react-query'
import useCabin from '../cabins/useCabin'
import useBookingFormValues from '../../hooks/useBookingFormValues'
import Checkbox from '../../ui/Checkbox'

function CreateBookingForm ({ bookingToEdit = {}, onCloseModal }) {
  const { isCreating, createBooking } = useCreateBooking()
  const { cabins } = useCabin()
  //   const [additionalGuests, setAdditionalGuests] = useState([])
  const [showScrollIndicator, setShowScrollIndicator] = useState(false)

  const { register, watch, setValue, handleSubmit, formState } = useForm({
    defaultValues: {
      cabinId: '',
      numGuests: 1,
      startDate: '',
      endDate: '',
      extraPrice: 0,
      hasBreakfast: false,
      cabinPrice: 0,
      totalPrice: 0,
      isPaid: false
    }
  })
  const { numNights } = useBookingFormValues(watch, cabins, setValue)
  const { errors } = formState
  const scrollToBottom = () => {
    const form = formRef.current
    if (!form) return

    form.scrollTo({
      top: form.scrollHeight,
      behavior: 'smooth'
    })
  }
  const formRef = useRef(null)

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
      const numNights = Math.ceil(
        (new Date(data.endDate) - new Date(data.startDate)) /
          (1000 * 60 * 60 * 24)
      )
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
        isPaid: data.isPaid,
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
              validate: (value, allValues) => {
                const startDate = new Date(allValues?.startDate)
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
          <select id='hasBreakfast' {...register('hasBreakfast', {})}>
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

        <FormRow label='Payment Status' error={errors?.isPaid?.message}>
          <Checkbox
            id='isPaid'
            {...register('isPaid', {
              setValueAs: v => Boolean(v)
            })}
          >
            Payment received
          </Checkbox>
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

export default CreateBookingForm
