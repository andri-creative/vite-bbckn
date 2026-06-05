import { createFileRoute } from '@tanstack/react-router'
import WorkPage from '../pages/WorkPage'

export const Route = createFileRoute('/work')({
    component: WorkPage,
})
