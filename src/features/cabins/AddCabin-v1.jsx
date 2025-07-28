import React from 'react'
import Button from '../../ui/Button'
import CreateCabinForm from './CreateCabinForm'
import Modal from '../../ui/Modal'
export default function AddCabinv1() {
  return (
    <Modal>
      <Modal.Open>
        <Button variation='primary' size='medium'>
          Add new cabin V1
        </Button>
      </Modal.Open>
      <Modal.Window>
        <CreateCabinForm />
      </Modal.Window>
    </Modal>
  )
}
