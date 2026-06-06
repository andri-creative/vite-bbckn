import { useQuery, useQueryClient } from "@tanstack/react-query"
import AchievementServices from "@/services/achievement.services"

export const useAchievements = () => {
    return useQuery({
        queryKey: ["achievements"],
        queryFn: async () => {
            const response = await AchievementServices.getAll()
            return response.data // returns the array of achievements
        },
    })
}

export const useAchievementById = (idOrSlug: string) => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ["achievement", idOrSlug],
        queryFn: async () => {
            try {
                const response = await AchievementServices.getById(idOrSlug);
                return response.data;
            } catch (err) {
                // If ID fetch fails (e.g. because it's a slug instead of ObjectId)
                console.log("Fetching by ID failed, trying by slug...");
                try {
                    const res = await AchievementServices.getAll(100);
                    const found = res.data?.find((a: any) => a.slug === idOrSlug || a._id === idOrSlug);
                    if (found) return found;
                } catch (fallbackErr) {
                    console.log("Fallback fetch also failed", fallbackErr);
                }
                // If not found in fallback, it simply doesn't exist
                return null;
            }
        },
        initialData: () => {
            const achievementsData = queryClient.getQueryData<any>(["achievements"]);
            if (achievementsData) {
                const found = achievementsData.find((a: any) => a.slug === idOrSlug || a._id === idOrSlug);
                if (found) return found;
            }
            return undefined;
        }
    });
}
