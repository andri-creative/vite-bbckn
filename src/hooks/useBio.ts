import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import BioService from "@/services/bio.services"

export const useBio = () => {
    return useQuery({
        queryKey: ["bio"],
        queryFn: async () => {
            const response = await BioService.getBio()
            // Backend usually returns { success: true, data: [...] } for /bio
            // And bio might be an array with one document, or just an object.
            // Based on typical patterns in this project, response.data is the payload.
            // If it returns an array, we take the first item, or the API itself handles it.
            // For now just return response.data
            let data = response.data;
            if (Array.isArray(data) && data.length > 0) {
                data = data[0];
            } else if (Array.isArray(data)) {
                data = null;
            }
            return data;
        },
    })
}

export const useCreateBio = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await BioService.createBio(data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bio"] });
        }
    })
}

export const useUpdateBio = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string, data: any }) => {
            const response = await BioService.updateBio(id, data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bio"] });
        }
    })
}