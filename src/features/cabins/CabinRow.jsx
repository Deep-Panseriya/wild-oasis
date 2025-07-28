import React from 'react'
import { formatCurrency } from '../../utils/helpers'
import { HiPencil, HiSquare2Stack, HiTrash } from 'react-icons/hi2'

import styled from 'styled-components'
import CreateCabinForm from './CreateCabinForm'
import useDeleteCabin from './useDeleteCabin'
import useCreateCabin from './useCreateCabin'
import Modal from '../../ui/Modal'
import ConfirmDelete from '../../ui/ConfirmDelete'
import Table from '../../ui/Table'
import Menus from '../../ui/Menus'

// const TableRow = styled.div`
//   display: grid;
//   grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
//   column-gap: 2.4rem;
//   align-items: center;
//   padding:1.4rem 2.4rem;
//   text-align: center;

//   &:not(:last-child) {
//     border-bottom: 1px solid var(--color-grey-100);
//   }

//   @media (max-width: 1024px) {
//     grid-template-columns: repeat(4, 1fr);
//     row-gap: 1.6rem;
//   }

//   @media (max-width: 768px) {
//     display: flex;
//     flex-direction: column;
//     align-items: flex-start;
//     padding: 1.6rem;
//     gap: 1.2rem;
//   }
// `

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);

  @media (max-width: 768px) {
    width: 100%;
    transform: scale(1) translateX(0);
  }
`

const Cabin = styled.div`
  color: var(--color-grey-600);
  font-size: 1.6rem;
  font-weight: 600;
  font-family: 'Sono';
  @media (max-width: 768px) {
    margin-left: 0;
    font-size: 1.4rem;
  }
`

const Price = styled.div`
  font-family: 'Sono';
  font-weight: 600;
  text-align: start;
`

const Discount = styled.div`
  font-family: 'Sono';
  font-weight: 500;
  color: var(--color-green-700);
  text-align: center;
`

const Span = styled.span`
  color: var(--color-grey-400);
  font-weight: 500;
  font-size: 1.6rem;
  text-align: center;
`

export default function CabinRow ({ cabin }) {
  const { isDeleting, deleteCabin } = useDeleteCabin()
  const { isCreating, createCabin } = useCreateCabin()
  const {
    id: cabinId,
    name,
    maxCapacity,
    regularPrice,
    discount,
    image,
    description
  } = cabin

  function handleDuplicate () {
    createCabin({
      name: `Copy of ${name}`,
      maxCapacity,
      regularPrice,
      discount,
      image,
      description
    })
  }
  return (
    <>
      <Table.Row>
        <Img src={image} />
        <Cabin>{name}</Cabin>
        <div> Fits up to {maxCapacity} guests</div>
        <Price>{formatCurrency(regularPrice)}</Price>
        {discount ? (
          <Discount>{formatCurrency(discount)}</Discount>
        ) : (
          <Span>&mdash;</Span>
        )}
        <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={cabinId} />
            <Menus.List id={cabinId}>       
              <Menus.Button icon={<HiSquare2Stack />} onClick={handleDuplicate}>
                Duplicate
              </Menus.Button>

              <Modal.Open opens='edit'>
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>

              <Modal.Open opens='delete'>
                <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
              </Modal.Open>
            </Menus.List>

              <Modal.Window name='edit'>
                <CreateCabinForm cabinToEdit={cabin} />
              </Modal.Window>

            <Modal.Window name='delete'>
              <ConfirmDelete
                onConfirm={() => deleteCabin(cabinId)}
                disabled={isDeleting}
                resourceName='cabins'
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
      </Table.Row>
    </>
  )
}
