import React, { useEffect } from 'react'
import { useUser } from '../features/authentication/useUser'
import Spinner from './Spinner'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`
export default function ProtectedRoute ({ children }) {
  const navigate = useNavigate()
  
  //1. Load the authenticated user from the local storage
  const { isLoading, isAuthenticated } = useUser()

  //2. If the user is not authenticated, redirect to the login page
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate('/login')
    }
  }, [isAuthenticated, isLoading, navigate])

  //3. While loading, show a loading spinner
  if (isLoading)
    return (
      <FullPage>
        {' '}
        <Spinner />{' '}
      </FullPage>
    )
  //4. If the user is authenticated, render the app

  if (isAuthenticated) return children
}
