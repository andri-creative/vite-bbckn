import { useEffect, useRef } from 'react'
import { useMotionValue } from 'motion/react'

/**
 * Tracks how far a section has scrolled through the viewport.
 * Returns a MotionValue from 0 (not yet visible) to 1 (scrolled past).
 * Used to drive fade-in / fade-out scroll animations.
 */
export function useSectionProgress() {
    const ref = useRef<HTMLElement>(null)
    const progress = useMotionValue(0)

    useEffect(() => {
        const update = () => {
            if (!ref.current) return
            const rect = ref.current.getBoundingClientRect()
            const vh = window.innerHeight
            const p = (vh - rect.top) / (rect.height + vh)
            progress.set(Math.max(0, Math.min(1, p)))
        }
        update()
        window.addEventListener('scroll', update, { passive: true })
        window.addEventListener('resize', update, { passive: true })
        return () => {
            window.removeEventListener('scroll', update)
            window.removeEventListener('resize', update)
        }
    }, [progress])

    return { ref, progress }
}
