import React from 'react'
import Button from '../../ui/Button'
import CreateCabinForm from './CreateCabinForm'
import Modal from '../../ui/Modal'

// export default function AddCabin () {
//   const [isOpanModalWindow, setisOpanModalWindow] = useState(false)

//   return (
//     <>
//       <Button
//         variation='primary'
//         size='medium'
//         onClick={() => setisOpanModalWindow(show => !show)}
//       >
//         Add new cabin
//       </Button>
//       {isOpanModalWindow && (
//         <Modal
//           onClose={() =>
//             setisOpanModalWindow(isOpanModalWindow => !isOpanModalWindow)
//           }
//         >
//           <CreateCabinForm
//             onCloseModal={() =>
//               setisOpanModalWindow(isOpanModalWindow => !isOpanModalWindow)
//             }
//           />
//         </Modal>
//       )}
//     </>
//   )
// }

function AddCabin () {
  return (
    <div>
      <Modal>
        <Modal.Open opens='cabin-form'>
          <Button variation='primary' size='medium'>
            Add new cabin
          </Button>
        </Modal.Open>
        <Modal.Window name='cabin-form'>
          <CreateCabinForm />
        </Modal.Window>
      </Modal>
    </div>
  )
}
export default AddCabin
