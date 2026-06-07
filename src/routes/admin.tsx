import { createFileRoute, redirect } from '@tanstack/react-router'
import AdminLayout from '../layouts/AdminLayout'

export const Route = createFileRoute('/admin')({
    beforeLoad: ({ location }) => {
        // Allow unauthenticated access to sign-in page
        if (location.pathname === '/admin/sign-in') return;
        
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
