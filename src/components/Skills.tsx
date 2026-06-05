import { Icon } from '@iconify/react'
import { useTools } from '../hooks/tools'
import { motion, useMotionValue, useTransform } from 'motion/react'
import { useRef, useEffect } from 'react'

function useSectionProgress(ref: React.RefObject<HTMLElement | null>) {
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
    }, [ref, progress])
    return progress
}

export default function Skills() {
    const sectionRef = useRef<HTMLElement>(null)
    const progress = useSectionProgress(sectionRef)

    const opacity = useTransform(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
    const y = useTransform(progress, [0, 0.25, 0.75, 1], [60, 0, 0, -60])

    const { data: fetchedSkills, isLoading, isError } = useTools(false);

    const activeSkills = !isLoading && !isError && fetchedSkills && fetchedSkills.length > 0
        ? fetchedSkills.map((tool: any) => ({
            label: tool.label || 'Unknown',
            color: tool.value || tool.color || '#888888',
            icon: typeof tool.icon === 'string' && tool.icon.trim().startsWith('<svg')
                ? <div dangerouslySetInnerHTML={{ __html: tool.icon }} className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full" />
                : typeof tool.icon === 'string'
                    ? <Icon icon={tool.icon} className="w-full h-full" />
                    : tool.icon,
        }))
        : [];

    console.log('ini data', fetchedSkills)

    return (
        <section ref={sectionRef} className="relative bg-[var(--bg)] border-t border-[var(--border)] px-6 py-20 flex flex-col justify-center items-center z-10 overflow-hidden w-full min-h-screen">
            <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

            <motion.div className="max-w-6xl w-full flex-1 flex flex-col justify-between relative z-10 py-10 sm:py-0" style={{ opacity, y }}>
                {/* Header / Text */}
                <div className="flex flex-col items-center text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--accent-bg)] text-[var(--accent)] text-xs font-semibold tracking-wider uppercase mb-4 select-none">
                        <Icon icon="ph:lightning-fill" className="w-3.5 h-3.5" />
                        Tech Stack
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-h)] tracking-tight mb-3">
                        Skills & Technologies
                    </h2>
                    <p className="text-[var(--text)] opacity-70 text-sm sm:text-base max-w-lg">
                        Tools and technologies I use to bring ideas to life — from backend APIs to pixel-perfect frontends.
                    </p>
                </div>

                {/* Skill Cards */}
                <div className="flex-1 flex flex-col justify-center my-12">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Icon icon="ph:spinner-gap-bold" className="w-8 h-8 animate-spin text-[var(--accent)]" />
                        </div>
                    ) : (
                        <div
                            className="grid grid-rows-2 sm:flex sm:flex-wrap grid-flow-col sm:justify-center gap-3 sm:gap-4 max-w-4xl mx-auto overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 snap-x"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {activeSkills.map(({ icon, label, color }: any, idx: number) => (
                                <div
                                    key={label + idx}
                                    className="snap-start shrink-0 group flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-6 sm:py-3 rounded-full border border-[var(--border)] bg-[var(--bg)]/40 backdrop-blur-md hover:border-[var(--accent)] hover:bg-[var(--accent-bg)] hover:-translate-y-1 transition-all duration-300 cursor-default select-none shadow-sm"
                                    style={{ '--skill-color': color } as React.CSSProperties}
                                >
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                                        {icon}
                                    </div>
                                    <span className="text-xs sm:text-sm font-medium tracking-wide text-[var(--text)] group-hover:text-[var(--text-h)] transition-colors duration-200 whitespace-nowrap">
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* View Details */}
                <div className="flex justify-center mt-auto">
                    <a href="/about#skills" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:opacity-80 transition-opacity no-underline">
                        View all skills
                        <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
                    </a>
                </div>
            </motion.div>
        </section>
    )
}
