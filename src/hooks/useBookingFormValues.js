import { useState, useEffect, useMemo } from 'react'

export default function useBookingFormValues(watch, cabins, setValue) {
  const [selectedCabin, setSelectedCabin] = useState(null)

  const cabinId = watch('cabinId')
  const numGuests = watch('numGuests', 1)
  const startDate = watch('startDate')
  const endDate = watch('endDate')
// Removed redundant computation of computedExtraPrice and totalPrice

  const hasBreakfast = watch('hasBreakfast', false)

  const numNights = Math.ceil(
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
  )

  // Set selected cabin when cabinId changes
  useEffect(() => {
    if (cabinId) {
      const cabin = cabins?.find(c => c.id === parseInt(cabinId))
      setSelectedCabin(cabin)
    }
  }, [cabinId, cabins])

  // Calculate prices
  const prices = useMemo(() => {
    if (!startDate || !endDate || !selectedCabin) return null

    const cabinPrice = numNights * (selectedCabin.regularPrice - selectedCabin.discount)
    const breakfastPrice = hasBreakfast ? numNights * 15 * numGuests : 0
    const computedExtraPrice = breakfastPrice 
    const extraPrice = breakfastPrice + computedExtraPrice
    const totalPrice = cabinPrice + extraPrice

    return { cabinPrice, extraPrice, totalPrice }
  }, [selectedCabin, hasBreakfast, numGuests, startDate, endDate, numNights]) 

  // Update form values when price changes
  useEffect(() => {
    if (prices) {
      setValue('cabinPrice', prices.cabinPrice)
      setValue('extraPrice', prices.extraPrice)
      setValue('totalPrice', prices.totalPrice)
    }
  }, [prices, setValue])

  return { selectedCabin, numNights }
}
