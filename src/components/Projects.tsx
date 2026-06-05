
import { Icon } from '@iconify/react'
import { PROJECTS } from '../data/projects'
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

export default function Projects() {
    const sectionRef = useRef<HTMLElement>(null)
    const progress = useSectionProgress(sectionRef)

    const opacity = useTransform(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
    const headerY = useTransform(progress, [0, 0.25, 0.75, 1], [50, 0, 0, -50])

    return (
        <section ref={sectionRef} className="relative bg-[var(--bg)] border-t border-[var(--border)] px-6 py-20 flex flex-col justify-center items-center z-10 overflow-hidden w-full min-h-screen">
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-violet-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl w-full relative z-10">

                {/* Header */}
                <motion.div
                    className="flex flex-col items-center text-center mb-12"
                    style={{ opacity, y: headerY }}
                >
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--accent-bg)] text-[var(--accent)] text-xs font-semibold tracking-wider uppercase mb-4 select-none">
                        <Icon icon="ph:folder-open-bold" className="w-3.5 h-3.5" />
                        Portfolio
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-h)] tracking-tight mb-3">
                        Featured Projects
                    </h2>
                    <p className="text-[var(--text)] opacity-70 text-sm sm:text-base max-w-lg">
                        A selection of projects that showcase my approach to building scalable, performant web applications.
                    </p>
                </motion.div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {PROJECTS.map((project, i) => (
                        <motion.div
                            key={project.title}
                            className={`group relative flex flex-col rounded-2xl border border-[var(--border)] bg-gradient-to-br ${project.color} backdrop-blur-md ${project.border} hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
                            style={{
                                opacity,
                                y: useTransform(progress,
                                    [Math.max(0, 0.15 + i * 0.03), Math.min(0.45, 0.3 + i * 0.03), Math.max(0.55, 0.7 - i * 0.03), Math.min(1, 0.85 - i * 0.03)],
                                    [70, 0, 0, -70]
                                )
                            }}
                        >
                            {/* Image Container */}
                            <div className="relative w-full h-48 overflow-hidden border-b border-[var(--border)] group/slider">
                                <div
                                    className="flex w-full h-full overflow-x-auto snap-x snap-mandatory"
                                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                >
                                    {Array.isArray(project.image) ? project.image.map((img, idx) => (
                                        <img key={idx} src={img} alt={`${project.title} - ${idx + 1}`} className="w-full h-full object-cover shrink-0 snap-center transition-transform duration-500 group-hover:scale-105" />
                                    )) : (
                                        <img src={project.image} alt={project.title} className="w-full h-full object-cover shrink-0 snap-center transition-transform duration-500 group-hover:scale-105" />
                                    )}
                                </div>
                                {Array.isArray(project.image) && project.image.length > 1 && (
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 pointer-events-none opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300">
                                        {project.image.map((_, idx) => (
                                            <div key={idx} className="w-1.5 h-1.5 rounded-full bg-white/80 shadow-sm" />
                                        ))}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300 pointer-events-none" />
                                <div className={`absolute top-3 right-3 w-10 h-10 rounded-full bg-[var(--bg)]/90 backdrop-blur-sm border border-[var(--border)] flex items-center justify-center ${project.accent} shadow-md pointer-events-none z-20`}>
                                    <Icon icon={project.icon} className="w-5 h-5" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col flex-1 p-5 sm:p-6">
                                <h3 className="text-[var(--text-h)] font-bold text-lg mb-2 leading-tight">{project.title}</h3>
                                {(project.company || project.location || project.duration || project.workType) && (
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 text-[11px] font-medium text-[var(--text)] opacity-75">
                                        {project.company && <span className="flex items-center gap-1"><Icon icon="ph:buildings-bold" className="w-3.5 h-3.5" />{project.company}</span>}
                                        {project.location && <span className="flex items-center gap-1"><Icon icon="ph:map-pin-bold" className="w-3.5 h-3.5" />{project.location}</span>}
                                        {project.duration && <span className="flex items-center gap-1"><Icon icon="ph:clock-bold" className="w-3.5 h-3.5" />{project.duration}</span>}
                                        {project.workType && <span className="flex items-center gap-1"><Icon icon="ph:briefcase-bold" className="w-3.5 h-3.5" />{project.workType}</span>}
                                    </div>
                                )}
                                <p className="text-[var(--text)] opacity-75 text-sm leading-relaxed mb-4 flex-1">{project.summary}</p>
                                <div className="flex flex-wrap gap-1.5 mb-5">
                                    {project.tags.map((tag) => (
                                        <span key={tag} className="px-2 py-0.5 rounded-md bg-[var(--bg)]/60 border border-[var(--border)] text-[var(--text)] text-[10px] font-semibold">{tag}</span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-4 pt-4 border-t border-[var(--border)] mt-auto">
                                    <a href={project.live} className={`flex items-center gap-1.5 text-xs font-semibold ${project.accent} hover:opacity-80 no-underline transition-opacity`}>
                                        <Icon icon="ph:arrow-square-out-bold" className="w-4 h-4" />
                                        Live Demo
                                    </a>
                                    <a href={project.repo} className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text)] hover:text-[var(--text-h)] no-underline transition-colors">
                                        <Icon icon="ph:github-logo-bold" className="w-4 h-4" />
                                        Source
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div className="flex justify-center mt-8" style={{ opacity }}>
                    <a href="/projects" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border)] text-sm font-semibold text-[var(--text-h)] hover:border-[var(--accent)] hover:text-[var(--accent)] bg-[var(--bg)]/40 transition-all duration-300 no-underline">
                        View all projects
                        <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
                    </a>
                </motion.div>
            </div>
        </section>
    )
}
