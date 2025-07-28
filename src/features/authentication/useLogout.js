import toast from "react-hot-toast"
import { useMutation } from "@tanstack/react-query"
import { logout as logoutApi } from "../../services/apiAuth"
import { useNavigate } from "react-router-dom"

export function useLogout() {
    const navigate = useNavigate()
    const {mutate: logout , isLoading} = useMutation({
        mutationFn: logoutApi,
        onSuccess: () => {
            toast.success('Logged out successfully')
            navigate('/login', { replace: true })
        },
    })
    return { logout , isLoading}
}