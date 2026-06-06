import api from "@/lib/api";

const ProjectServices = {
    async getProjects(page: number = 1, limit: number = 20) {
        try {
            const response = await api.get(`/project?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching project:", error);
            throw error;
        }
    },
    async getProjectById(id: string) {
        try {
            const response = await api.get(`/project/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching project by id:", error);
            throw error;
        }
    },
}

export default ProjectServices