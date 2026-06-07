import { createFileRoute } from '@tanstack/react-router'
import AdminSignInPage from '../pages/admin/SignIn'

export const Route = createFileRoute('/admin/sign-in')({
    component: AdminSignInPage,
})
