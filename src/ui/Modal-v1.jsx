import { cloneElement, createContext, useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { HiXMark } from 'react-icons/hi2'
import styled from 'styled-components'

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 1100;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
  align-items: center;

  @media (max-width: 768px) {
    width: calc(90vw);
  }

  @media (max-width: 480px) {
    width: 92vw;
    height: max-content;
    padding: 2rem;
    top: calc(50% - 1%);
  }

  @media (max-width: 375px) {
    width: 84vw;
    padding: 1.6rem;
    margin-top: 0;
    top: 47%;
    transform: translate(-50%, -45%);
  }

  /* @media (max-width: 480px) {
    height: auto;
    margin: 0;
    top:42%
  } */
`

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
  @media (max-width: 768px) {
    display: flex;
    text-align: left;
  }
`

const ModalContext = createContext()

function Modal ({ children }) {
  const [openName, setOpenName] = useState(false)
  const close = () => setOpenName(false)
  const open = () => setOpenName(true)
  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  )
}

function Open ({ children }) {
  const { open } = useContext(ModalContext)
  return cloneElement(children, {
    onClick: () => open()
  })
}

function Window ({ children }) {
  const { openName, close } = useContext(ModalContext)

  if (!openName) return null
  return createPortal(
    <Overlay>
      <StyledModal>
        <Button onClick={close}>
          <HiXMark />
        </Button>
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </StyledModal>
    </Overlay>,
    document.body
  )

  //   return createPortal(
  //     <Overlay>
  //       <StyledModal>
  //         <Button onClick={() => onClose?.()}>
  //           <HiXMark />
  //         </Button>
  //         <div>{children}</div>
  //       </StyledModal>
  //     </Overlay>,
  //     document.body
  //   )
}

Modal.Open = Open
Modal.Window = Window
export default Modal