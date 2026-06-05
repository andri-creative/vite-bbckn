import api from "@/lib/api";

const ExperienceServices = {
    async getAll() {
        try {
            const response = await api.get("/experience");
            return response.data;
        } catch (error) {
            console.error("Error fetching experience:", error);
            throw error;
        }
    },

    async getById(id: string) {
        try {
            const response = await api.get(`/experience/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching experience by id:", error);
            throw error;
        }
    },

}


export default ExperienceServices