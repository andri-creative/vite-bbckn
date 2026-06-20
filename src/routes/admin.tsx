import { createFileRoute, redirect } from '@tanstack/react-router'
import AdminLayout from '../layouts/AdminLayout'

export const Route = createFileRoute('/admin')({
    beforeLoad: ({ location }) => {
        // Allow unauthenticated access to sign-in page
        if (location.pathname === '/admin/sign-in') return;
        
        const token = localStorage.getItem('x-cokis');
        const authDate = localStorage.getItem('auth-date');
        const currentDate = new Date().toDateString();

        if (token) {
            if (!authDate) {
                localStorage.setItem('auth-date', currentDate);
            } else if (authDate !== currentDate) {
                // Day changed, clear storage and trigger redirect
                localStorage.removeItem('x-cokis');
                localStorage.removeItem('user');
                localStorage.removeItem('auth-date');
            }
        }

        const isAuthenticated = !!localStorage.getItem('x-cokis')
        if (!isAuthenticated) {
            throw redirect({
                to: '/admin/sign-in',
                search: {
                    redirect: location.pathname,
                },
            })
        }
    },
    component: AdminLayout,
})
