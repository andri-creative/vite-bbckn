import api from "@/lib/api";

const ToolsServices = {
    async getAllTools() {
        try {
            const response = await api.get("/tools-icon");
            return response.data;
        } catch (error) {
            console.error("Error fetching tools:", error);
            throw error;
        }
    },
    async getByCategory(id: string) {
        try {
            const response = await api.get(`/tools-icon/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching tools by id:", error);
            throw error;
        }
    },
}

export default ToolsServices;