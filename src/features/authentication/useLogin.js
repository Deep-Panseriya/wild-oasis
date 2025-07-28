import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login as loginApi } from '../../services/apiAuth'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export function useLogin () {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { mutate: login, isLoading } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: data => {
      queryClient.setQueryData(['user'], data.user)
      toast.success('Login successfully')
      navigate('/dashboard' , { replace: true })
    },
    onError: () => {
      toast.error('Provided email or password are incorrect')
    }
  })
  return { login, isLoading }
}





// import { useState } from 'react'
// import { login as loginApi } from '../../services/apiAuth'
// import { useNavigate } from 'react-router-dom'
// import toast from 'react-hot-toast'
// export function useLogin() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   const login = async ({ email, password }) => {
//     setIsLoading(true);
//     try {
//       const { data, error } = await loginApi({ email, password });
//       if (error) throw new Error(error.message);
//       setUser?.(data.user);
//       toast.success('Login successfully');
//       navigate('/dashboard', { replace: true });
//     } catch (error) {
//       toast.error(error.message || 'Provided email or password are incorrect');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return { login, isLoading, user };
// }



// import { useState, useEffect } from 'react'
// export function useLogin () {
//   const [credentials, setCredentials] = useState(null) // used to trigger useEffect
//   const [isLoading, setIsLoading] = useState(false)
//   const [user, setUser] = useState(null)
//   const navigate = useNavigate()

//   const login = ({ email, password }) => {
//     setCredentials({ email, password })
//   }
//   useEffect(()=> {
//     if(!credentials) return
//      const performLogin = async () => {
//       setIsLoading(true)
//       try {
//         const { data, error } = await loginApi(credentials)
//         console.log('data', data)
//         if (error) throw new Error(error.message)
//         setUser?.(data.user)
//         toast.success('Login successfully')
//         navigate('/dashboard', { replace: true })
//       } catch (error) {
//         toast.error( error.message||'Provided email or password are incorrect')
//       } finally {
//         setIsLoading(false)
//         setCredentials(null) // reset credentials after login attempt
//       }
//     }
//     performLogin()
//   }, [credentials, navigate])
//   return { login, isLoading, user }
// }
