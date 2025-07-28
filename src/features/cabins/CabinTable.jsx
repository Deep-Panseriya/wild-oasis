//ANCHOR This file contains a custom hook for show cabins using React Query.

import Spinner from '../../ui/Spinner'
import useCabin from './useCabin'
import Table from '../../ui/Table'
import CabinRow from './CabinRow'
import Menus from '../../ui/Menus'
import { useSearchParams } from 'react-router-dom'
import Empty from '../../ui/Empty'
import useNetworkStatus from '../../hooks/useNetworkStatus'


export default function CabinTable () {
  const { isLoading, cabins, error } = useCabin()
  const isOnline = useNetworkStatus()
  const [searchParams] = useSearchParams()
  if (!isOnline) {
    return (
      <div
        style={{
          color: 'black',
          padding: '1rem',
          textAlign: 'center'
        }}
      >
        ⚠️ You are offline. Please check your internet connection.
      </div>
    )
  }
  if (isLoading) return <Spinner />
  if (error) return <p>{error.message}</p>
  if (cabins.length === 0) return <Empty resourceName='cabins' />
  
  //ANCHOR (1) Get the discount from the search params
  const filterValue = searchParams.get('discount') || 'all'
  let filteredCabins

  //ANCHOR Filter the cabins based on the discount
  if (filterValue === 'all') filteredCabins = cabins
  if (filterValue === 'no-discount')
    filteredCabins = cabins.filter(cabin => cabin.discount === 0)
  if (filterValue === 'with-discount')
    filteredCabins = cabins.filter(cabin => cabin.discount > 0)

  //ANCHOR (2) Get the sortBy from the search params
  const sortBy = searchParams.get('sortBy') || 'startDate-asc'

  //Suppose sortBy is "startDate-asc".
  //split("-") turns that into ["startDate", "asc"].
  //field = "startDate"
  //direction = "asc"
  const [field, direction] = sortBy.split('-')

  const modifier = direction === 'asc' ? 1 : -1
  const sortedCabins = filteredCabins.sort(
    (a, b) => (a[field] - b[field]) * modifier
  )
  return (
    <Menus>
      <Table columns='0.6fr 1.8fr 2.2fr 1fr 1fr 1fr'>
        <Table.Header>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          //data={cabins}
          //data={filteredCabins}
          data={sortedCabins}
          render={cabin => <CabinRow key={cabin.id} cabin={cabin} />}
        />
      </Table>
    </Menus>
  )
}
