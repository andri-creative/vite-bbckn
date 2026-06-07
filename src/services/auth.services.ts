import api from "@/lib/api";

const AuthService = {
    login: async (data: any) => {
        const response = await api.post("/user/login", data);
        return response.data;
    },
    logout: async () => {
        const response = await api.post("/user/logout");
        return response.data;
    }
}

export default AuthService;
