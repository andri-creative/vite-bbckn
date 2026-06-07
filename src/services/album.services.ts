
import api from "@/lib/api";


const AlbumsServices = {
    async getAlbums(page: number = 1, limit: number = 20) {
        try {
            const response = await api.get(`/album?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching album:", error);
            throw error;
        }
    },
    async getAlbumById(id: string) {
        try {
            const response = await api.get(`/album/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching album by id:", error);
            throw error;
        }
    },
    async createAlbum(data: any) {
        try {
            const response = await api.post(`/album`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error creating album:", error);
            throw error;
        }
    }
}

export default AlbumsServices