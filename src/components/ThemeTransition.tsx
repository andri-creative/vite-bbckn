import { useEffect, useRef, useState } from 'react'

/**
 * ThemeTransition — Curtain wipe using the actual page content.
 *
 * Strategy:
 *  - Theme is applied to <html> BEFORE this animation runs.
 *  - We show a single "curtain" panel that matches the OLD theme's background,
 *    covering one half of the screen.
 *  - Since the curtain colour matches the old theme, it looks like the page
 *    is still the old theme on that side — while the OTHER side already shows
 *    the REAL new-theme page content.
 *  - The curtain then sweeps away, revealing the full new page.
 *
 * from='dark'  → going to light  → dark curtain covers LEFT  half → shrinks left
 * from='light' → going to dark   → light curtain covers RIGHT half → shrinks right
 */

type Phase = 'idle' | 'split' | 'wipe' | 'done'

interface Props {
    /** The theme we are coming FROM (null = no animation) */
    from: 'dark' | 'light' | null
    onDone: () => void
}

const BG = {
    dark:  '#03080c',
    light: '#f1f5f9',
}

export function ThemeTransition({ from, onDone }: Props) {
    const [phase, setPhase] = useState<Phase>('idle')
    // Latch the from value so it stays alive for the whole animation duration
    const latchedFrom = useRef<'dark' | 'light'>('dark')

    useEffect(() => {
        if (!from) return
        latchedFrom.current = from
        setPhase('split')

        const t1 = setTimeout(() => setPhase('wipe'),               800)
        const t2 = setTimeout(() => setPhase('done'),               800 + 600)
        const t3 = setTimeout(() => { setPhase('idle'); onDone() }, 800 + 600 + 200)

        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
    }, [from]) // eslint-disable-line react-hooks/exhaustive-deps

    if (phase === 'idle') return null

    const oldTheme  = latchedFrom.current
    const isDarkCurtain = oldTheme === 'dark'   // dark curtain → covers left half
    const curtainBg = BG[oldTheme]

    // Width of the curtain panel
    const curtainWidth = phase === 'wipe' ? '0%' : '50%'

    return (
        <div
            className="fixed inset-0 pointer-events-none overflow-hidden"
            style={{
                zIndex: 9999,
                opacity: phase === 'done' ? 0 : 1,
                transition: phase === 'done' ? 'opacity 0.2s ease' : 'none',
            }}
        >
            {/* ── Curtain panel ── */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    // Dark curtain anchors to left  → shrinks leftward as width → 0
                    // Light curtain anchors to right → shrinks rightward as width → 0
                    ...(isDarkCurtain ? { left: 0 } : { right: 0 }),
                    width: curtainWidth,
                    background: curtainBg,
                    transition: phase === 'wipe'
                        ? 'width 0.6s cubic-bezier(0.77, 0, 0.18, 1)'
                        : 'none',
                }}
            />

            {/* ── Centre divider line (only during split phase) ── */}
            {phase === 'split' && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 'calc(50% - 0.5px)',
                        width: '1px',
                        background: isDarkCurtain
                            ? 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.18) 40%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0.18) 60%, transparent 100%)'
                            : 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.10) 40%, rgba(0,0,0,0.16) 50%, rgba(0,0,0,0.10) 60%, transparent 100%)',
                    }}
                />
            )}
        </div>
    )
}
