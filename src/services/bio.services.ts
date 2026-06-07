import api from "@/lib/api";

const BioService = {
    getBio: async () => {
        const response = await api.get("/bio");
        return response.data;
    },
    createBio: async (data: any) => {
        const response = await api.post("/bio", data);
        return response.data;
    },
    updateBio: async (id: string, data: any) => {
        const response = await api.put(`/bio/${id}`, data);
        return response.data;
    }
}

export default BioService;