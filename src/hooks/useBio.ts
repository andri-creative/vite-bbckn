import { useQuery } from "@tanstack/react-query"
import BioService from "@/services/bio.services"

export const useBio = () => {
    return useQuery({
        queryKey: ["bio"],
        queryFn: async () => {
            const response = await BioService.getBio()
            return response.data // returns the bio object
        },
    })
}