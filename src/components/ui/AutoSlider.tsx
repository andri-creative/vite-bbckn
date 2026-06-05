import { Icon } from '@iconify/react'
import { useState, useEffect, useCallback } from 'react'

/**
 * AutoSlider — shows one child at a time, auto-advances every `interval` ms.
 * If only 1 child: renders it directly without any slider UI.
 * Pauses on hover. Supports manual prev/next arrows and dot indicators.
 */
export default function AutoSlider({
    children,
    interval = 4000,
    showArrows = true,
}: {
    children: React.ReactNode[]
    interval?: number
    showArrows?: boolean
}) {
    const count = children.length
    const [active, setActive] = useState(0)
    const [paused, setPaused] = useState(false)

    const next = useCallback(() => setActive(i => (i + 1) % count), [count])
    const prev = useCallback(() => setActive(i => (i - 1 + count) % count), [count])

    useEffect(() => {
        if (count <= 1 || paused) return
        const t = setInterval(next, interval)
        return () => clearInterval(t)
    }, [count, paused, next, interval])

    if (count === 1) return <>{children[0]}</>

    return (
        <div
            className="relative w-full h-full flex flex-col"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Slide viewport */}
            <div className="overflow-hidden rounded-2xl flex-1">
                <div
                    className="flex h-full transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${active * 100}%)` }}
                >
                    {children.map((child, i) => (
                        <div key={i} className="w-full h-full shrink-0">
                            {child}
                        </div>
                    ))}
                </div>
            </div>

            {/* Prev / Next arrows */}
            {showArrows && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[var(--bg)]/80 border border-[var(--border)] backdrop-blur-sm flex items-center justify-center text-[var(--text-h)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-200"
                    >
                        <Icon icon="ph:caret-left-bold" className="w-4 h-4" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[var(--bg)]/80 border border-[var(--border)] backdrop-blur-sm flex items-center justify-center text-[var(--text-h)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-200"
                    >
                        <Icon icon="ph:caret-right-bold" className="w-4 h-4" />
                    </button>
                </>
            )}

            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-4">
                {children.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActive(i)}
                        className={`rounded-full transition-all duration-300 ${
                            i === active
                                ? 'w-6 h-1.5 bg-[var(--accent)]'
                                : 'w-1.5 h-1.5 bg-[var(--border)] hover:bg-[var(--accent)]/40'
                        }`}
                    />
                ))}
            </div>
        </div>
    )
}
