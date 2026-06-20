import api from "@/lib/api";

const AchievementServices = {
    async getAll(limit: number = 20) {
        try {
            const response = await api.get(`/achievement?limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching achievement:", error);
            throw error;
        }
    },
    async getById(id: string) {
        try {
            const response = await api.get(`/achievement/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching achievement by id:", error);
            throw error;
        }
    },
    async create(data: FormData) {
        try {
            const response = await api.post(`/achievement`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error creating achievement:", error);
            throw error;
        }
    },
    async update(id: string, data: FormData) {
        try {
            const response = await api.put(`/achievement/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error updating achievement:", error);
            throw error;
        }
    },
    async delete(id: string) {
        try {
            const response = await api.delete(`/achievement/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting achievement:", error);
            throw error;
        }
    }
}

export default AchievementServices