import { useQuery } from "@tanstack/react-query"
import ExperienceServices from "../services/experience.services"

const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "Present"
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export const useExperience = () => {
    return useQuery({
        queryKey: ["experience"],
        queryFn: async () => {
            const response = await ExperienceServices.getAll();

            if (Array.isArray(response.data)) {
                return response.data
                    .filter((exp: any) => typeof exp.sort === 'number' && exp.sort > 0)
                    .sort((a: any, b: any) => a.sort - b.sort)
                    .map((exp: any) => ({
                        ...exp,
                        period: `${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`
                    }));
            }

            return [];
        },
    });
}