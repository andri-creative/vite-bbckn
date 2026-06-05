import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { motion, useTransform, AnimatePresence } from 'motion/react'
import { useSectionProgress } from '../../hooks/useSectionProgress'
import { PROJECTS } from '../../data/projects'
import { Link } from '@tanstack/react-router'

export default function WorkProjects() {
    const { ref, progress } = useSectionProgress()
    const opacity = useTransform(progress, [0, 0.15, 0.85, 1], [0, 1, 1, 0])
    const y = useTransform(progress, [0, 0.2, 0.8, 1], [100, 0, 0, -100])

    const [activeCategory, setActiveCategory] = useState('All')
    const [visibleCount, setVisibleCount] = useState(6)
    const [isLoading, setIsLoading] = useState(false)

    const categories = ['All', ...new Set(PROJECTS.map(p => p.category))]

    useEffect(() => {
        setVisibleCount(6)
    }, [activeCategory])

    const filteredProjects = activeCategory === 'All'
        ? PROJECTS
        : PROJECTS.filter(p => p.category === activeCategory)

    const displayedProjects = filteredProjects.slice(0, visibleCount)

    const loadMore = () => {
        if (isLoading || visibleCount >= filteredProjects.length) return
        setIsLoading(true)
        setTimeout(() => {
            setVisibleCount(prev => prev + 6)
            setIsLoading(false)
        }, 800)
    }

    return (
        <section
            ref={ref}
            id="projects"
            className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 py-32 border-b border-[var(--border)] overflow-hidden bg-[var(--bg)]"
        >
            {/* Cinematic Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-[10%] right-[20%] w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '6s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[300px] bg-[var(--accent)]/5 rounded-full blur-[100px]" />
            </div>

            <motion.div style={{ opacity, y }} className="max-w-[1400px] w-full relative z-10 flex flex-col gap-16">

                {/* Header Section */}
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--accent-bg)]/50 backdrop-blur-md text-[var(--accent)] text-xs font-bold tracking-widest uppercase mb-6 shadow-xl"
                    >
                        <Icon icon="ph:star-four-fill" className="w-4 h-4 animate-spin-slow" />
                        Selected Works
                    </motion.div>
                    <h1 className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[var(--text-h)] to-[var(--text-h)]/50 tracking-tighter mb-6 leading-tight">
                        Featured Projects
                    </h1>
                    <p className="text-[var(--text)] opacity-70 text-lg sm:text-xl max-w-2xl leading-relaxed font-medium">
                        A curated selection of my most impactful digital products.
                        Blending cutting-edge technology with world-class design.
                    </p>
                </div>

                {/* Modern Filter Tabs */}
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 z-20">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-extrabold tracking-wide transition-all duration-300 transform active:scale-95 ${activeCategory === cat
                                    ? 'bg-[var(--text-h)] text-[var(--bg)] shadow-xl scale-105'
                                    : 'bg-[var(--accent-bg)] border border-[var(--border)] text-[var(--text)] hover:text-[var(--text-h)] hover:border-[var(--text-h)]/30 hover:bg-[var(--border)]'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col gap-12 w-full">
                    {/* The Grid */}
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-10">
                        <AnimatePresence mode="popLayout">
                            {displayedProjects.map((project) => {
                                const coverImage = Array.isArray(project.image) ? project.image[0] : project.image;
                                return (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                                        transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
                                        key={project.slug}
                                        className={`group relative flex flex-col rounded-3xl bg-[var(--accent-bg)]/30 backdrop-blur-xl border border-[var(--border)] hover:border-[var(--text-h)]/20 overflow-hidden transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] z-10`}
                                    >
                                        {/* Floating Inner Image Frame */}
                                        <div className="relative h-64 sm:h-72 p-3 pb-0">
                                            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                                                <img
                                                    src={coverImage}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />

                                                {/* Premium Glass Badge */}
                                                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 z-20 shadow-2xl">
                                                    <div className="relative flex items-center justify-center">
                                                        <div className={`absolute w-3 h-3 rounded-full ${project.accent.replace('text-', 'bg-')} opacity-50 animate-ping`} />
                                                        <div className={`relative w-1.5 h-1.5 rounded-full ${project.accent.replace('text-', 'bg-')} shadow-[0_0_10px_currentColor]`} style={{ color: 'white' }} />
                                                    </div>
                                                    <span className="text-[10px] font-black text-white uppercase tracking-widest drop-shadow-md">
                                                        {project.category}
                                                    </span>
                                                </div>

                                                {/* Icon */}
                                                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-transform duration-700 group-hover:scale-110 z-20 shadow-lg">
                                                    <Icon icon={project.icon} className="w-5 h-5" />
                                                </div>

                                                {/* Tags over image */}
                                                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 z-20">
                                                    {project.tags.slice(0, 3).map(tag => (
                                                        <span key={tag} className="px-3 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white tracking-wider shadow-sm">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    {project.tags.length > 3 && (
                                                        <span className="px-2 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white shadow-sm">
                                                            +{project.tags.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Body */}
                                        <div className="flex flex-col p-8 pt-6 flex-1 gap-5">
                                            <div className="flex flex-col gap-3">
                                                <h3 className={`text-2xl font-black text-[var(--text-h)] group-hover:${project.accent} transition-colors duration-500 line-clamp-1 tracking-tight`}>
                                                    {project.title}
                                                </h3>

                                                {/* Metadata */}
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold text-[var(--text)] opacity-60">
                                                    {project.company && (
                                                        <span className="flex items-center gap-1.5">
                                                            <Icon icon="ph:buildings-fill" className="w-4 h-4" />
                                                            {project.company}
                                                        </span>
                                                    )}
                                                    {project.workType && (
                                                        <span className="flex items-center gap-1.5">
                                                            <Icon icon="ph:briefcase-fill" className="w-4 h-4" />
                                                            {project.workType}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-[var(--text)] opacity-70 text-sm leading-relaxed flex-1 font-medium">
                                                {project.summary}
                                            </p>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-3 mt-4 pt-6 border-t border-[var(--border)]/50">
                                                <a
                                                    href={project.live}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-br ${project.color} border border-[var(--border)] ${project.accent} text-[11px] font-black uppercase tracking-widest hover:brightness-125 transition-all duration-300 hover:shadow-lg`}
                                                >
                                                    <Icon icon="ph:globe-bold" className="w-4 h-4" /> Demo
                                                </a>
                                                <Link
                                                    to="/project/$slug"
                                                    params={{ slug: project.slug }}
                                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text-h)] text-[11px] font-black uppercase tracking-widest hover:bg-[var(--text-h)] hover:text-[var(--bg)] transition-all duration-300 hover:shadow-lg"
                                                >
                                                    <Icon icon="ph:arrow-right-bold" className="w-4 h-4" /> Detail
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </motion.div>

                    {/* Infinite Scroll Trigger */}
                    {visibleCount < filteredProjects.length && (
                        <motion.div
                            onViewportEnter={loadMore}
                            viewport={{ margin: "100px" }}
                            className="w-full flex justify-center py-12"
                        >
                            {isLoading ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[var(--text-h)] text-[var(--bg)] shadow-2xl"
                                >
                                    <Icon icon="ph:spinner-bold" className="w-5 h-5 animate-spin" />
                                    <span className="text-xs font-black tracking-widest uppercase">Loading Magic...</span>
                                </motion.div>
                            ) : (
                                <div className="h-10 w-full" />
                            )}
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </section>
    )
}
