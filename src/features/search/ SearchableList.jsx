import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDarkMode } from '../../context/DarkModeContext'

export default function SearchableList ({ bookings }) {
  const navigate = useNavigate()
  const location = useLocation() // Access current location (URL)
  const [searchTerm, setSearchTerm] = useState('')
  const { isDarkMode } = useDarkMode()

  useEffect(() => {
    if (searchTerm.trim() === '') {
      if (location.search) {
        navigate('/bookings', { replace: true })
      }
      return
    }

    const timer = setTimeout(() => {
      const match = bookings?.find(booking =>
        booking?.guests?.fullName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      )

      if (match) {
        navigate(`/bookings?search=${searchTerm}`)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm, bookings, navigate, location])


  const inputStyles = {
    padding: '0.5rem',
    marginBottom: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
    backgroundColor: isDarkMode ? 'var(--color-grey-0)' : '#fff', 
    color: isDarkMode ? '#fff' : '#000', 
    transition: 'background-color 0.3s ease, color 0.3s ease' 
  }

  return (
    <input
      type='text'
      placeholder='Search guest name...'
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
      style={inputStyles}
    />
  )
}
