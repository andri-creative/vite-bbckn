import { Icon } from '@iconify/react'
import { Link } from '@tanstack/react-router'
import { useProjects } from '../hooks/useProject'
import { motion, useMotionValue, useTransform, MotionValue } from 'motion/react'
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

const ProjectCard = ({ project, i, opacity, progress }: { project: any, i: number, opacity: MotionValue<number>, progress: MotionValue<number> }) => {
    const y = useTransform(progress,
        [Math.max(0, 0.15 + i * 0.03), Math.min(0.45, 0.3 + i * 0.03), Math.max(0.55, 0.7 - i * 0.03), Math.min(1, 0.85 - i * 0.03)],
        [70, 0, 0, -70]
    );

    const themeColor = project.color || project.accent || '#9ca3af';

    return (
        <motion.div
            className={`group relative flex flex-col h-full rounded-2xl border bg-[var(--accent-bg)]/30 backdrop-blur-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
            style={{
                opacity,
                y,
                '--theme-color': themeColor,
                borderColor: `${themeColor}33`
            } as any}
        >
            {/* Image Container */}
            <div className="relative w-full h-52 sm:h-48 md:h-52 lg:h-56 xl:h-60 overflow-hidden border-b border-[var(--border)] group/slider">
                <div
                    className="flex w-full h-full overflow-x-auto snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {Array.isArray(project.imageUrls) && project.imageUrls.length > 0 ? project.imageUrls.map((img: string, idx: number) => (
                        <img key={idx} src={img} alt={`${project.title} - ${idx + 1}`} className="w-full h-full object-cover shrink-0 snap-center transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    )) : (
                        Array.isArray(project.image) && project.image.length > 0 ? project.image.map((img: string, idx: number) => (
                            <img key={idx} src={img} alt={`${project.title} - ${idx + 1}`} className="w-full h-full object-cover shrink-0 snap-center transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                        )) : (
                            <img src={(typeof project.image === 'string' && project.image) || 'https://via.placeholder.com/600'} alt={project.title} className="w-full h-full object-cover shrink-0 snap-center transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                        )
                    )}
                </div>
                {((Array.isArray(project.imageUrls) && project.imageUrls.length > 1) || (!project.imageUrls && Array.isArray(project.image) && project.image.length > 1)) && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 pointer-events-none opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300">
                        {(Array.isArray(project.imageUrls) && project.imageUrls.length > 0 ? project.imageUrls : project.image).map((_: any, idx: number) => (
                            <div key={idx} className="w-1.5 h-1.5 rounded-full bg-white/80 shadow-sm" />
                        ))}
                    </div>
                )}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300 pointer-events-none" />
                <div
                    className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-[var(--bg)]/90 backdrop-blur-sm border flex items-center justify-center shadow-md pointer-events-none z-20`}
                    style={{ color: themeColor, borderColor: `${themeColor}33` }}
                >
                    <Icon icon={project.icon || 'ph:folder-bold'} className="w-4 h-4" />
                </div>

                {/* Tech Stack over image */}
                {project.techStack?.length > 0 && (
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex flex-wrap gap-1 z-20 pointer-events-none">
                        {project.techStack.slice(0, 3).map((tag: any) => (
                            <span key={tag._id || tag.label} className="px-1.5 py-0.5 rounded bg-black/50 backdrop-blur-md border border-white/10 text-[8px] font-bold text-white shadow-sm">
                                {tag.label}
                            </span>
                        ))}
                        {project.techStack.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded bg-black/50 backdrop-blur-md border border-white/10 text-[8px] font-bold text-white shadow-sm">
                                +{project.techStack.length - 3}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4 sm:p-5 gap-3">
                <div className="flex flex-col gap-1.5">
                    <h3 className="text-[var(--text-h)] font-bold text-base sm:text-lg leading-tight transition-colors duration-300 group-hover:text-[var(--theme-color)]">{project.title}</h3>
                    {(project.company || project.location || project.duration || project.workType) && (
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-[var(--text)] opacity-75">
                            {project.company && <span className="flex items-center gap-1"><Icon icon="ph:buildings-bold" className="w-3.5 h-3.5" />{project.company}</span>}
                            {project.location && <span className="flex items-center gap-1"><Icon icon="ph:map-pin-bold" className="w-3.5 h-3.5" />{project.location}</span>}
                            {project.duration && <span className="flex items-center gap-1"><Icon icon="ph:clock-bold" className="w-3.5 h-3.5" />{project.duration}</span>}
                            {project.workType && <span className="flex items-center gap-1"><Icon icon="ph:briefcase-bold" className="w-3.5 h-3.5" />{project.workType}</span>}
                        </div>
                    )}
                </div>
                <p className="text-[var(--text)] opacity-75 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">{project.summary}</p>
                {project.tools?.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mb-5 mt-auto">
                        {project.tools.map((item: any, index: number) => (
                            item.icon && (
                                <span 
                                    key={item._id || item.label || index} 
                                    title={item.label}
                                    className={`flex items-center justify-center w-7 h-7 rounded-full bg-[var(--accent)]/10 border border-[var(--border)]/50 shadow-sm backdrop-blur-sm transition-transform hover:scale-110`}
                                    style={{ color: themeColor }}
                                >
                                    <span className="w-4 h-4 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full" dangerouslySetInnerHTML={{ __html: item.icon }} />
                                </span>
                            )
                        ))}
                    </div>
                )}
                <div className="flex items-center gap-4 pt-4 border-t border-[var(--border)] mt-auto">
                    {project.demoUrl && (
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-1.5 text-xs font-semibold hover:opacity-80 no-underline transition-opacity`} style={{ color: themeColor }}>
                            <Icon icon="ph:arrow-square-out-bold" className="w-4 h-4" />
                            Live Demo
                        </a>
                    )}
                    {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text)] hover:text-[var(--text-h)] no-underline transition-colors">
                            <Icon icon="ph:github-logo-bold" className="w-4 h-4" />
                            Source
                        </a>
                    )}
                    <Link
                        to="/project/$slug"
                        params={{ slug: project.slug }}
                        className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text)] hover:text-[var(--text-h)] no-underline transition-colors ml-auto"
                    >
                        <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
                        Detail
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default function Projects() {
    const sectionRef = useRef<HTMLElement>(null)
    const progress = useSectionProgress(sectionRef)

    const opacity = useTransform(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
    const headerY = useTransform(progress, [0, 0.25, 0.75, 1], [50, 0, 0, -50])

    const { data } = useProjects(3);
    const projects = (data?.pages.flatMap(page => page.data) || []).slice(0, 3);

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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {projects.map((project: any, i: number) => (
                        <ProjectCard key={project._id || project.title} project={project} i={i} opacity={opacity} progress={progress} />
                    ))}
                </div>

                <motion.div className="flex justify-center mt-8" style={{ opacity }}>
                    <Link to="/work" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border)] text-sm font-semibold text-[var(--text-h)] hover:border-[var(--accent)] hover:text-[var(--accent)] bg-[var(--bg)]/40 transition-all duration-300 no-underline">
                        View all projects
                        <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
