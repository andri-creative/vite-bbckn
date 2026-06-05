import { createFileRoute } from '@tanstack/react-router'
import CertificateDetailPage from '../pages/CertificateDetailPage'

export const Route = createFileRoute('/certificate/$id')({
    component: CertificateRouteComponent,
})

function CertificateRouteComponent() {
    const { id } = Route.useParams()
    return <CertificateDetailPage id={id} />
}
