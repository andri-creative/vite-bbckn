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
    }
}

export default AchievementServices