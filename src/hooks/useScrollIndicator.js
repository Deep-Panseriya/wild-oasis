import { useEffect, useState } from 'react'

export default function useScrollIndicator(formRef) {
  const [showScrollIndicator, setShowScrollIndicator] = useState(false)

  useEffect(() => {
    const form = formRef.current
    if (!form) return

    const checkScroll = () => {
      const hasScroll = form.scrollHeight > form.clientHeight
      setShowScrollIndicator(hasScroll)
    }

    checkScroll()
    window.addEventListener('resize', checkScroll)

    return () => window.removeEventListener('resize', checkScroll)
  }, [formRef])

  const scrollToBottom = () => {
    const form = formRef.current
    if (!form) return

    form.scrollTo({
      top: form.scrollHeight,
      behavior: 'smooth'
    })
  }

  return { showScrollIndicator, scrollToBottom }
}
