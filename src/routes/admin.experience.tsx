import { createFileRoute } from '@tanstack/react-router'
import ExperienceAdmin from '../pages/admin/Experience'

export const Route = createFileRoute('/admin/experience')({
    component: ExperienceAdmin,
})
