import { createFileRoute } from '@tanstack/react-router'
import BioAdmin from '@/pages/admin/Bio'

type BioSearch = {
  tab?: 'stats' | 'educations' | 'publications'
  action?: 'create' | 'edit' | null
  id?: string | null
}

export const Route = createFileRoute('/admin/bio')({
  validateSearch: (search: Record<string, unknown>): BioSearch => {
    return {
      tab: (search.tab as any) || 'stats',
      action: (search.action as any) || null,
      id: (search.id as string) || null,
    }
  },
  component: BioAdmin,
})
