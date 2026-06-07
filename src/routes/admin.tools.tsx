import { createFileRoute } from '@tanstack/react-router'
import AdminToolsPage from '../pages/admin/Tools'

export const Route = createFileRoute('/admin/tools')({
    component: AdminToolsPage,
})
