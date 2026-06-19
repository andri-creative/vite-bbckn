import { createFileRoute } from '@tanstack/react-router'
import Projects from '../pages/admin/Project'

export const Route = createFileRoute('/admin/project')({
  component: Projects,
})
