import { useQuery } from "@tanstack/react-query";
import ToolsServices from "../services/toolss.services";

export const useTools = (all: boolean = false) => {
    return useQuery({
        queryKey: ["tools", all],
        queryFn: async () => {
            const response = await ToolsServices.getAllTools();

            let data: any[] = [];
            if (Array.isArray(response)) {
                data = response;
            } else if (response && Array.isArray(response.data)) {
                data = response.data;
            }

            if (all) {
                // Return all data (optional: sort by value or just as is)
                return data;
            }

            // Only filter and sort by order when not requesting all
            const processedData = data
                .filter(item => typeof item.order === 'number' && item.order > 0)
                .sort((a, b) => a.order - b.order);

            return processedData;
        },
    });
};