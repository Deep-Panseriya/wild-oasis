import React from 'react'
import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar
} from 'react-icons/hi2'
import Stat from './Stat'
import { formatCurrency } from '../../utils/helpers'

export default function Stats ({ bookings ,confirmedStays , numDays , cabinsCount }) {
  const numBookings = bookings?.length

  const sales = bookings?.reduce((acc, cur)=> acc + cur.totalPrice, 0)

  const numCheckedIn = confirmedStays?.length

  const occupation =
  confirmedStays?.reduce((acc, cur) => acc + cur.numNights, 0) /
  (numDays * cabinsCount);
  
  return (
    <>
      <Stat
        title='bookings'
        color='blue'
        icon={<HiOutlineBriefcase />}
        value={numBookings}
      />
      <Stat
        title='sales'
        color='green'
        icon={<HiOutlineBanknotes />}
        value={formatCurrency(sales)}
      />
      <Stat
        title='checked-in'
        color='indigo'
        icon={<HiOutlineCalendarDays />}
        value={numCheckedIn}
      />

      <Stat
        title='Occupancy rate'
        color='yellow'
        icon={<HiOutlineChartBar />}
        value={Math.round(occupation * 100) + "%"}
      />
    </>
  )
}
