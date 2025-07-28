///NOTE -  useSignup is a custom hook that uses react-query to handle the signup process. It uses the useMutation hook to create a mutation function that calls the signUpApi function from the apiAuth.js file. The onSuccess and onError callbacks are used to show success and error messages using the toast library. The isLoading state is used to show a loading spinner while the mutation is in progress.

import { useMutation } from "@tanstack/react-query";
import { signUp as signUpApi } from "../../services/apiAuth";
import {toast} from "react-hot-toast";
export function useSignup(){
    const{mutate: signUp , isLoading} = useMutation({
        mutationFn: ({ fullName, email, password , avatar }) => signUpApi({ fullName, email, password, avatar }),
        onSuccess: () => {
            toast.success('User created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Error creating user')
        }
    })
    return { signUp, isLoading }
}


///NOTE -  useEffect way 


// import { useState } from 'react';// Import your signup API function
// import { useNavigate } from 'react-router-dom';


// export function useSignup() {
//   const [isLoading, setIsLoading] = useState(false); // Loading state
//   const [user, setUser] = useState(null); // User data after signup
//   const navigate = useNavigate(); // For navigation

//   const signUp = async ({ fullName, email, password }) => {
//     setIsLoading(true); // Start loading state
//     try {
//       // Call the signup API function
//       const { data, error } = await signUpApi({ fullName, email, password });
//       if (error) throw new Error(error.message); // Throw error if signup fails
//       setUser?.(data.user); // Set the user data
//       toast.success('User created successfully'); // Show success message
//       navigate('/dashboard', { replace: true }); // Navigate to dashboard after signup
//     } catch (error) {
//       toast.error(error.message || 'Error signing up'); // Show error message
//     } finally {
//       setIsLoading(false); // End loading state
//     }
//   };

//   return { signUp, isLoading, user }; // Return signUp function, loading state, and user data
// }

