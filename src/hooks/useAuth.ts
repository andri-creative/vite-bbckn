import { useMutation } from "@tanstack/react-query";
import AuthService from "@/services/auth.services";
import { useNavigate } from "@tanstack/react-router";

export const useLogin = () => {
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await AuthService.login(data);
            return response;
        }
    });
};

export const useLogout = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: async () => {
            const response = await AuthService.logout();
            return response;
        },
        onSuccess: () => {
            localStorage.removeItem('x-cokis');
            localStorage.removeItem('user');
            localStorage.removeItem('auth-date');
            navigate({ to: '/admin/sign-in' });
        },
        onError: () => {
            // Even if the API call fails, we probably want to clear local storage and redirect
            localStorage.removeItem('x-cokis');
            localStorage.removeItem('user');
            localStorage.removeItem('auth-date');
            navigate({ to: '/admin/sign-in' });
        }
    });
};
