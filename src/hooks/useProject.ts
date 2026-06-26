import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import pusher from "@/lib/pusher";
import ProjectServices from "../services/project.services";

export const useProjects = (limit: number = 20) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const channel = pusher.subscribe('project-channel');

        channel.bind('project-updated', (response: any) => {
            console.log('Update Project Diterima dari Pusher:', response);
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [queryClient]);

    return useInfiniteQuery({
        queryKey: ["projects", limit],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await ProjectServices.getProjects(pageParam, limit);
            return response; // Return the full response which includes data and pagination
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.pagination && lastPage.pagination.page < lastPage.pagination.totalPages) {
                return lastPage.pagination.page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
    });
}

export const useProjectById = (idOrSlug: string) => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ["project", idOrSlug],
        queryFn: async () => {
            try {
                const response = await ProjectServices.getProjectById(idOrSlug);
                return response.data;
            } catch (err) {
                // If ID fetch fails (e.g. because it's a slug instead of ObjectId)
                // Fallback to fetching all and finding by slug
                console.log("Fetching by ID failed, trying by slug...");
                try {
                    const res = await ProjectServices.getProjects(1, 100);
                    const found = res.data?.find((p: any) => p.slug === idOrSlug || p._id === idOrSlug);
                    if (found) return found;
                } catch (fallbackErr) {
                    console.log("Fallback fetch also failed", fallbackErr);
                }
                // If not found in fallback, it simply doesn't exist
                return null;
            }
        },
        initialData: () => {
            const projectsData = queryClient.getQueryData<any>(["projects"]);
            if (projectsData?.pages) {
                const found = projectsData.pages.flatMap((page: any) => page.data).find((p: any) => p.slug === idOrSlug || p._id === idOrSlug);
                if (found) return found;
            }
            return undefined;
        }
    });
}

export const useCreateProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: FormData) => {
            return await ProjectServices.createProject(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        }
    });
};

export const useUpdateProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
            return await ProjectServices.updateProject(id, data);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["project", variables.id] });
        }
    });
};

export const useDeleteProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            return await ProjectServices.deleteProject(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        }
    });
};

