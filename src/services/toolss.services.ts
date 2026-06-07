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
    async updateOrder(id: string, data: any) {
        try {
            const response = await api.put(`/tools-icon/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Error updating tool order:", error);
            throw error;
        }
    },
    async createTool(data: { label: string; icon: string }) {
        try {
            const response = await api.post("/tools-icon", data);
            return response.data;
        } catch (error) {
            console.error("Error creating tool:", error);
            throw error;
        }
    },
    async updateTool(id: string, data: { label?: string; icon?: string }) {
        try {
            const response = await api.put(`/tools-icon/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Error updating tool:", error);
            throw error;
        }
    }
}

export default ToolsServices;