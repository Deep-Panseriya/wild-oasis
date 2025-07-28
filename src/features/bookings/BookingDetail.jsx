import styled from 'styled-components'
import { useMoveBack } from '../../hooks/useMoveBack'

import BookingDataBox from './BookingDataBox'
import Row from '../../ui/Row'
import Heading from '../../ui/Heading'
import Tag from '../../ui/Tag'
import ButtonGroup from '../../ui/ButtonGroup'
import Button from '../../ui/Button'
import ButtonText from '../../ui/ButtonText'
import useBooking from './useBooking'
import Spinner from '../../ui/Spinner'
import { useNavigate } from 'react-router-dom'
import { useCheckout } from '../check-in-out/useCheckout'
import { HiArrowUpOnSquare } from 'react-icons/hi2'
import Modal from '../../ui/Modal'
import { useDeleteBooking } from './useDeleteBooking'
import ConfirmDelete from '../../ui/ConfirmDelete'

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`

function BookingDetail () {
  const { isLoading, bookings, error } = useBooking()
  //const booking = {};
  const { checkout, isCheckingout } = useCheckout()
  const{ isDeleting , deleteBooking } = useDeleteBooking()
  const navigate = useNavigate()
  const moveBack = useMoveBack()

  const statusToTagName = {
    unconfirmed: 'blue',
    'checked-in': 'green',
    'checked-out': 'silver',
    confirmed: 'yellow'
  }

  if (isLoading) return <Spinner />
  if (error) return <p>Something went wrong while fetching the booking</p>
  const { id: bookingId, status } = bookings

  return (
    <>
      <Row type='horizontal'>
        <HeadingGroup>
          <Heading as='h1'>Booking #{bookingId}</Heading>
          <Tag type={statusToTagName[status]}>{status?.replace('-', ' ')}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={bookings} />

      <ButtonGroup>
        {status === 'unconfirmed' && (
          <Button
            size='medium'
            variation='primary'
            onClick={() => navigate(`/checkin/${bookingId}`)}
          >
            Check in
          </Button>
        )}

        {status === 'checked-in' && (
          <Button
            size='medium'
            variation='primary'
            icon={<HiArrowUpOnSquare />}
            onClick={() => checkout(bookingId)}
            disabled={isCheckingout}
          >
            Check out
          </Button>
        )}
        <Modal>
            <Modal.Open opens='delete'>
              <Button
                size='medium'
                variation='danger'
                disabled={isDeleting}
                icon={isDeleting ? <Spinner size='small' /> : null}
              >
                Delete
              </Button>
            </Modal.Open>
            <Modal.Window name='delete'>
                <ConfirmDelete
                    title='Delete booking'
                    message={`Are you sure you want to delete booking #${bookingId}?`}
                    onConfirm={() => {
                    deleteBooking(bookingId)
                    navigate('/bookings')
                    }}
                />  
            </Modal.Window>
        </Modal>
        <Button variation='secondary' size='medium' onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  )
}

export default BookingDetail
