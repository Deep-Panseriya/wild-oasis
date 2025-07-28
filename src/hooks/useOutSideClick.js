import { useEffect, useRef } from 'react'

export default function useOutSideClick(handleClose) {
    const ref = useRef(null)

    useEffect(function()  {
        function handleClick (e) {
          if (ref.current && !ref.current.contains(e.target)) {
            handleClose?.()
          }
        }
        document.addEventListener('click', handleClick,true)
        return () => document.removeEventListener('click', handleClick, true)
      }, [handleClose])
    
  return ref;
}
