import { createFileRoute } from '@tanstack/react-router'
import ProjectDetailPage from '../pages/ProjectDetailPage'

export const Route = createFileRoute('/project/$slug')({
    component: ProjectRoute,
})

function ProjectRoute() {
    const { slug } = Route.useParams()
    return <ProjectDetailPage slug={slug} />
}

