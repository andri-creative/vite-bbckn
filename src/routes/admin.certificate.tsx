import { createFileRoute } from '@tanstack/react-router'
import Certificate from '../pages/admin/Certificate'

export const Route = createFileRoute('/admin/certificate')({
  component: Certificate,
})
