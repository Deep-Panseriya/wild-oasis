import { useEffect } from 'react'

export default function useCloseOnScroll(openId, close) {
  useEffect(() => {
    function handleScroll() {
      if (openId) close();
    }

    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [openId, close]);
}
