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
    async createProject(data: FormData) {
        try {
            const response = await api.post(`/project`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error creating project:", error);
            throw error;
        }
    },
    async updateProject(id: string, data: FormData) {
        try {
            const response = await api.put(`/project/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error updating project:", error);
            throw error;
        }
    },
    async deleteProject(id: string) {
        try {
            const response = await api.delete(`/project/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting project:", error);
            throw error;
        }
    }
}

export default ProjectServices