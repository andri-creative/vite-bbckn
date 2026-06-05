import { Icon } from '@iconify/react'
import { motion, useMotionValue, useTransform } from 'motion/react'
import { useRef, useEffect } from 'react'
import { useExperience } from '../hooks/useExperience'

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

export default function Experience() {
    const sectionRef = useRef<HTMLElement>(null)
    const progress = useSectionProgress(sectionRef)
    const { data: experiences = [], isLoading } = useExperience()

    const opacity = useTransform(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
    const headerY = useTransform(progress, [0, 0.25, 0.75, 1], [50, 0, 0, -50])
    const xEven = useTransform(progress, [0, 0.25, 0.75, 1], [-80, 0, 0, -80])
    const xOdd = useTransform(progress, [0, 0.25, 0.75, 1], [80, 0, 0, 80])

    return (
        <section ref={sectionRef} className="relative bg-[var(--bg)] border-t border-[var(--border)] px-6 py-20 flex flex-col justify-center items-center z-10 overflow-hidden w-full min-h-screen">
            <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-6xl w-full relative z-10">

                {/* Header */}
                <motion.div
                    className="flex flex-col items-center text-center mb-12"
                    style={{ opacity, y: headerY }}
                >
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--accent-bg)] text-[var(--accent)] text-xs font-semibold tracking-wider uppercase mb-4 select-none">
                        <Icon icon="ph:briefcase-bold" className="w-3.5 h-3.5" />
                        Career
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-h)] tracking-tight mb-3">
                        Work Experience
                    </h2>
                    <p className="text-[var(--text)] opacity-70 text-sm sm:text-base max-w-lg">
                        My professional journey in building web applications and digital products.
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                    <div className="absolute left-[18px] sm:left-1/2 top-0 bottom-0 w-px bg-[var(--border)] sm:-translate-x-px" />
                    <div className="flex flex-col gap-8">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-10 w-full text-[var(--accent)]">
                                <Icon icon="ph:spinner-bold" className="w-10 h-10 animate-spin" />
                            </div>
                        ) : experiences.map((exp: any, i: number) => {
                            const isEven = i % 2 === 0
                            
                            return (
                                <motion.div
                                    key={exp._id || i}
                                    className={`relative flex gap-6 sm:gap-0 ${isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
                                    style={{
                                        opacity,
                                        x: isEven ? xEven : xOdd
                                    }}
                                >
                                    {/* Dot */}
                                    <div className={`absolute left-0 sm:left-1/2 sm:-translate-x-1/2 w-9 h-9 rounded-full flex items-center justify-center border-2 z-10 shrink-0 transition-colors duration-300 ${exp.current ? 'border-[var(--accent)] bg-[var(--accent-bg)]' : 'border-[var(--border)] bg-[var(--bg)]'}`}>
                                        <Icon icon={exp.icon || "ph:briefcase-bold"} className={`w-4 h-4 ${exp.current ? 'text-[var(--accent)]' : 'text-[var(--text)]'}`} />
                                    </div>

                                    {/* Card */}
                                    <div className={`ml-14 sm:ml-0 sm:w-[calc(50%-2.5rem)] ${isEven ? 'sm:pr-8' : 'sm:pl-8'}`}>
                                        <div className="group p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg)]/40 backdrop-blur-md hover:border-[var(--accent)]/40 hover:bg-[var(--accent-bg)]/30 transition-all duration-300">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <div>
                                                    <h3 className="font-bold text-[var(--text-h)] text-base leading-tight">{exp.position}</h3>
                                                    <p className="text-[var(--accent)] text-sm font-semibold">{exp.companyName}</p>
                                                </div>
                                                <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${exp.current ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' : 'border-[var(--border)] text-[var(--text)] opacity-60'}`}>
                                                    {exp.type}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-[var(--text)] opacity-60 mb-3">
                                                <Icon icon="ph:calendar-blank" className="w-3.5 h-3.5" />
                                                {exp.period}
                                            </div>
                                            <p className="text-[var(--text)] opacity-75 text-sm leading-relaxed mb-3">{exp.summary}</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {exp.responsibilities?.map((tag: string) => (
                                                    <span key={tag} className="px-2 py-0.5 rounded-md bg-[var(--bg)]/60 border border-[var(--border)] text-[var(--text)] text-[10px] font-semibold">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block sm:w-[calc(50%-2.5rem)]" />
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                <motion.div className="flex justify-center mt-10" style={{ opacity }}>
                    <a href="/about#experience" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:opacity-80 transition-opacity no-underline">
                        View full experience
                        <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
                    </a>
                </motion.div>
            </div>
        </section>
    )
}
