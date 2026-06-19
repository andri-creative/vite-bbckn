import { Outlet, useLocation } from '@tanstack/react-router'
import { Icon } from '@iconify/react'
import Navbar from './Navbar'
import FloatingRating from '../components/ui/FloatingRating'
import { useRanting } from '../hooks/useRanting'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import ProjectServices from '../services/project.services'
import AlbumsServices from '../services/album.services'
import AchievementServices from '../services/achievement.services'

export default function MainLayout() {
    const location = useLocation()
    const isHomePage = location.pathname === '/'
    const isAdminPage = location.pathname.startsWith('/admin')
    const { ratings, isLoading, averageRating, submitVote } = useRanting()
    const queryClient = useQueryClient()

    useEffect(() => {
        // Jangan lakukan prefetch jika sedang di halaman admin
        if (isAdminPage) return

        // 1. Prefetch Projects (Infinite Query - limit: 6)
        queryClient.prefetchInfiniteQuery({
            queryKey: ["projects"],
            queryFn: async () => {
                return await ProjectServices.getProjects(1, 6)
            },
            initialPageParam: 1,
        }).catch(err => console.error("Prefetch projects failed", err))

        // 2. Prefetch Albums (Infinite Query - limit: 20)
        queryClient.prefetchInfiniteQuery({
            queryKey: ["albums"],
            queryFn: async () => {
                return await AlbumsServices.getAlbums(1, 20)
            },
            initialPageParam: 1,
        }).catch(err => console.error("Prefetch albums failed", err))

        // 3. Prefetch Achievements (Regular Query)
        queryClient.prefetchQuery({
            queryKey: ["achievements"],
            queryFn: async () => {
                const response = await AchievementServices.getAll()
                return response.data
            }
        }).catch(err => console.error("Prefetch achievements failed", err))
    }, [queryClient, isAdminPage])

    // Admin pages: skip portfolio chrome entirely — AdminLayout handles everything
    if (isAdminPage) {
        return <Outlet />
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Global Footer (Hidden on Home Page) */}
            {!isHomePage && (
                <footer className="w-full py-8 sm:py-10 border-t border-[var(--border)] bg-[var(--bg)] mt-auto flex flex-col items-center justify-center gap-3 relative z-10">
                    <div className="flex flex-wrap items-center justify-center gap-2 text-[var(--text)] opacity-80 px-4 text-center">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 shadow-sm">
                            <Icon icon="ph:star-fill" className="w-4 h-4" />
                            <span className="text-xs sm:text-sm font-bold">
                                {isLoading ? "..." : averageRating}/5
                            </span>
                        </div>
                        <span className="text-sm font-medium">Average Rating</span>
                        <span className="text-xs opacity-60">
                            (from {ratings?.totalVoters || 0} visitors)
                        </span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-[var(--text)] opacity-40 font-medium tracking-widest uppercase mt-2">
                        &copy; {new Date().getFullYear()} Andri Creative. All rights reserved.
                    </p>
                </footer>
            )}
            <FloatingRating submitVote={submitVote} averageRating={averageRating} ratings={ratings} />
        </div>
    )
}
