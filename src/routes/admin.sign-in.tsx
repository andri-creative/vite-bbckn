import { createFileRoute, redirect } from '@tanstack/react-router'
import AdminSignInPage from '../pages/admin/SignIn'

export const Route = createFileRoute('/admin/sign-in')({
    beforeLoad: () => {
        const isAuthenticated = !!localStorage.getItem('x-cokis')
        if (isAuthenticated) {
            throw redirect({
                to: '/admin/bio',
            })
        }
    },
    component: AdminSignInPage,
})
