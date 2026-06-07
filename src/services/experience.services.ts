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

    async create(data: any) {
        try {
            const response = await api.post("/experience", data);
            return response.data;
        } catch (error) {
            console.error("Error creating experience:", error);
            throw error;
        }
    },

    async update(id: string, data: any) {
        try {
            const response = await api.put(`/experience/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Error updating experience:", error);
            throw error;
        }
    },

    async delete(id: string) {
        try {
            const response = await api.delete(`/experience/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting experience:", error);
            throw error;
        }
    }
}


export default ExperienceServices