import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import Pusher from "pusher-js";
import AlbumsServices from "@/services/album.services";

export const useAlbums = (limit: number = 20) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
            cluster: import.meta.env.VITE_PUSHER_CLUSTER,
        });

        const channel = pusher.subscribe('album-channel');

        channel.bind('album-updated', (response: any) => {
            console.log('Update Album Diterima dari Pusher:', response);
            queryClient.invalidateQueries({ queryKey: ["albums"] });
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            pusher.disconnect();
        };
    }, [queryClient]);

    return useInfiniteQuery({
        queryKey: ["albums"],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await AlbumsServices.getAlbums(pageParam, limit);
            return response; // Return the full response which includes data and pagination
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.pagination.page < lastPage.pagination.totalPages) {
                return lastPage.pagination.page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
    });
}

export const useAlbumById = (id: string) => {
    return useQuery({
        queryKey: ["album", id],
        queryFn: async () => {
            const response = await AlbumsServices.getAlbumById(id);
            return response.data;
        },
    });
}