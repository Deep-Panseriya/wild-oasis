import BookingRow from './BookingRow'
import Table from '../../ui/Table'
import Menus from '../../ui/Menus'
import Empty from '../../ui/Empty'
import useNetworkStatus from '../../hooks/useNetworkStatus'
import useBookings from './useBookings'
import Spinner from '../../ui/Spinner'
import { useSearchParams } from 'react-router-dom'
import Pagination from '../../ui/Pagination'
import { PAGE_SIZE } from '../../utils/constant'



function BookingTable () {
  const { isLoading, bookings } = useBookings()
  const isOnline = useNetworkStatus()
  const [searchParams] = useSearchParams()

  // Ensure hooks are not in conditionals
  if (!isOnline) {
    return (
      <div style={{ color: 'black', padding: '1rem', textAlign: 'center' }}>
        ⚠️ You are offline. Please check your internet connection.
      </div>
    )
  }

  if (isLoading) return <Spinner />
  if (!bookings?.length) return <Empty resourceName='bookings' />

  // Filter bookings
  const status = searchParams.get('status') || 'all'
  let filteredBookings = bookings

  if (status !== 'all') {
    filteredBookings = bookings.filter(booking => booking.status === status)
  }

  // Sort bookings
  const sortBy = searchParams.get('sortBy') || 'startDate-asc'
  const [field, direction] = sortBy.split('-')
  const modifier = direction === 'asc' ? 1 : -1

  const sortedBookings = filteredBookings.slice().sort((a, b) => {
    const valA = a[field]
    const valB = b[field]
    const isDateField = ['startDate', 'endDate', 'created_at'].includes(field)

    const aValue = isDateField ? new Date(valA) : valA
    const bValue = isDateField ? new Date(valB) : valB

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * modifier
    }

    if (aValue < bValue) return -1 * modifier
    if (aValue > bValue) return 1 * modifier
    return 0
  })
  
 const searchQuery = searchParams.get('search')?.toLowerCase() || ''
  const searchedBookings = sortedBookings.filter(booking => {
    const fullName = booking.guests?.fullName || ''
    const email = booking.guests?.email || ''
    const cabinName = booking.cabins?.name || ''
    return (
      fullName.toLowerCase().includes(searchQuery) ||
      email.toLowerCase().includes(searchQuery) ||
      cabinName.toLowerCase().includes(searchQuery)
    )
  })

  // Pagination logic
  const currentPage = Number(searchParams.get('page')) || 1
  const start = (currentPage - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE
  const paginatedBookings = searchedBookings.slice(start, end)

  return (
    <Menus>
      <Table columns='0.6fr 2fr 2.4fr 1.4fr 1fr 3.2rem'>
        <Table.Header>
          <div>Cabin</div>
          <div>Guest Name and total Guests</div>
          <div>Dates</div>
          <div>Status</div>
          <div>Amount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={paginatedBookings}
          render={booking => <BookingRow key={booking.id} booking={booking} />}
        />

        <Table.Footer>
          <Pagination count={sortedBookings.length} />
        </Table.Footer>
      </Table>
    </Menus>
  )
}

export default BookingTable
