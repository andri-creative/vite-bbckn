import { createFileRoute } from '@tanstack/react-router'
import AdminGalelyPage from '../pages/admin/Galely'

export const Route = createFileRoute('/admin/galely')({
    component: AdminGalelyPage,
})
