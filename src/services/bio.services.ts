import api from "@/lib/api";

const BioService = {
    getBio: async () => {
        const response = await api.get("/bio");
        return response.data;
    },
}

export default BioService;