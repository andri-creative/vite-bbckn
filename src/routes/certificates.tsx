import { createFileRoute } from '@tanstack/react-router'
import CertificatesPage from '../pages/CertificatesPage'

export const Route = createFileRoute('/certificates')({
    component: CertificatesPage,
})
