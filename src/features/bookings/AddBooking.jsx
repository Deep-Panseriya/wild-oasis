import React from 'react'
import Modal from '../../ui/Modal'
import Button from '../../ui/Button'
import CreateBookingForm from './CreateBookingForm'

export default function AddBooking() {
  return (
    <div>
      <div>
      <Modal>
        <Modal.Open opens='booking-form'>
          <Button variation='primary' size='medium'>
            Add new booking
          </Button>
        </Modal.Open>
        <Modal.Window name='booking-form'>
          <CreateBookingForm />
        </Modal.Window>
      </Modal>
    </div> 
    </div>
  )
}
