import { createFileRoute } from '@tanstack/react-router'
import AlbumPage from '../pages/AlbumPage'

export const Route = createFileRoute('/album')({
    component: AlbumPage,
})
