import { useState, useMemo } from 'react'
import { Icon } from '@iconify/react'
import { motion, useTransform, AnimatePresence } from 'motion/react'
import { useSectionProgress } from '../../hooks/useSectionProgress'
import { useProjects } from '../../hooks/useProject'
import { Link } from '@tanstack/react-router'

export default function WorkProjects() {
    const { ref, progress } = useSectionProgress()
    const opacity = useTransform(progress, [0, 0.15, 0.85, 1], [0, 1, 1, 0])
    const y = useTransform(progress, [0, 0.2, 0.8, 1], [100, 0, 0, -100])

    const [activeCategory, setActiveCategory] = useState('All')
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useProjects(6); // Fetch 6 items per page

    const projects = data?.pages.flatMap(page => page.data) || [];

    // Extract categories from available data (or define standard categories if preferred)
    const categories = useMemo(() => {
        const cats = new Set(projects.map((p: any) => p.category).filter(Boolean));
        return ['All', ...Array.from(cats)];
    }, [projects]);

    const filteredProjects = activeCategory === 'All'
        ? projects
        : projects.filter((p: any) => p.category === activeCategory)

    const loadMore = () => {
        if (!isFetchingNextPage && hasNextPage) {
            fetchNextPage();
        }
    }

    return (
        <section
            ref={ref}
            id="projects"
            className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 py-32 border-b border-[var(--border)] overflow-hidden bg-[var(--bg)]"
        >
            {/* Cinematic Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[20%] w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[150px]" />
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
                            key={cat as string}
                            onClick={() => setActiveCategory(cat as string)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-extrabold tracking-wide transition-all duration-300 transform active:scale-95 ${activeCategory === cat
                                ? 'bg-[var(--text-h)] text-[var(--bg)] shadow-xl scale-105'
                                : 'bg-[var(--accent-bg)] border border-[var(--border)] text-[var(--text)] hover:text-[var(--text-h)] hover:border-[var(--text-h)]/30 hover:bg-[var(--border)]'
                                }`}
                        >
                            {cat as string}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col gap-12 w-full">
                    {/* The Grid */}
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        <AnimatePresence mode="popLayout">
                            {filteredProjects.map((project: any) => {
                                const coverImage = Array.isArray(project.imageUrls) && project.imageUrls.length > 0 ? project.imageUrls[0] : (Array.isArray(project.image) && project.image.length > 0 ? project.image[0] : (project.image || 'https://via.placeholder.com/600'));
                                const techStack = project.techStack || [];
                                const tools = project.tools || [];
                                const themeColor = project.color || project.accent || '#9ca3af';

                                return (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                                        transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
                                        key={project.slug || project._id}
                                        className={`group relative flex flex-col rounded-3xl bg-[var(--accent-bg)]/30 backdrop-blur-xl border border-[var(--border)] overflow-hidden transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] z-10`}
                                        style={{ '--theme-color': themeColor } as any}
                                    >
                                        {/* Floating Inner Image Frame */}
                                        <div className="relative h-32 sm:h-40 p-2 pb-0">
                                            <div className="relative w-full h-full rounded-[14px] overflow-hidden shadow-xl">
                                                <img
                                                    src={coverImage}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />

                                                {/* Premium Glass Badge */}
                                                {project.category && (
                                                    <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 z-20 shadow-sm">
                                                        <div className="relative flex items-center justify-center">
                                                            <div className="absolute w-1.5 h-1.5 rounded-full opacity-50 animate-ping" style={{ backgroundColor: themeColor }} />
                                                            <div className="relative w-1 h-1 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: themeColor, color: themeColor }} />
                                                        </div>
                                                        <span className="text-[8px] font-black text-white uppercase tracking-widest drop-shadow-md">
                                                            {project.category}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Icon */}
                                                <div
                                                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-transform duration-700 group-hover:scale-110 z-20 shadow-sm"
                                                    style={{ color: themeColor }}
                                                >
                                                    <Icon icon={project.icon || 'ph:folder-bold'} className="w-4 h-4" />
                                                </div>

                                                {/* Tech Stack over image */}
                                                {techStack.length > 0 && (
                                                    <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1 z-20 pointer-events-none">
                                                        {techStack.slice(0, 3).map((tag: any) => (
                                                            <span key={tag._id || tag.label} className="px-1.5 py-0.5 rounded bg-black/50 backdrop-blur-md border border-white/10 text-[8px] font-bold text-white tracking-wider shadow-sm">
                                                                {tag.label}
                                                            </span>
                                                        ))}
                                                        {techStack.length > 3 && (
                                                            <span className="px-1.5 py-0.5 rounded bg-black/50 backdrop-blur-md border border-white/10 text-[8px] font-bold text-white shadow-sm">
                                                                +{techStack.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}


                                            </div>
                                        </div>

                                        {/* Content Body */}
                                        <div className="flex flex-col p-4 sm:p-5 pt-3 flex-1 gap-3">
                                            <div className="flex flex-col gap-1.5">
                                                <h3 className="text-base sm:text-lg font-bold text-[var(--text-h)] transition-colors duration-500 line-clamp-1 tracking-tight group-hover:text-[var(--theme-color)]">
                                                    {project.title}
                                                </h3>

                                                {/* Metadata */}
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold text-[var(--text)] opacity-60">
                                                    {project.company && (
                                                        <span className="flex items-center gap-1">
                                                            <Icon icon="ph:buildings-fill" className="w-3.5 h-3.5" />
                                                            {project.company}
                                                        </span>
                                                    )}
                                                    {project.workType && (
                                                        <span className="flex items-center gap-1">
                                                            <Icon icon="ph:briefcase-fill" className="w-3.5 h-3.5" />
                                                            {project.workType}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-[var(--text)] opacity-70 text-sm leading-relaxed flex-1 font-medium">
                                                {project.summary}
                                            </p>

                                            {/* Tools */}
                                            {tools.length > 0 && (
                                                <div className="flex flex-wrap items-center gap-1.5 mb-2 mt-auto">
                                                    {tools.map((item: any, index: number) => (
                                                        item.icon && (
                                                            <span
                                                                key={item._id || item.label || index}
                                                                title={item.label}
                                                                className={`flex items-center justify-center w-7 h-7 rounded-full bg-[var(--accent-bg)]/80 border border-[var(--border)] shadow-sm backdrop-blur-sm transition-transform hover:scale-110`}
                                                                style={{ color: themeColor }}
                                                            >
                                                                <span className="w-4 h-4 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full" dangerouslySetInnerHTML={{ __html: item.icon }} />
                                                            </span>
                                                        )
                                                    ))}
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2 mt-auto pt-3 border-t border-[var(--border)]/30">
                                                {project.demoUrl && (
                                                    <a
                                                        href={project.demoUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--text)]/5 hover:bg-[var(--text)]/10 text-[var(--text)] text-[9px] font-bold uppercase tracking-wider transition-colors"
                                                        style={{ color: themeColor }}
                                                    >
                                                        <Icon icon="ph:globe-bold" className="w-3.5 h-3.5" /> Demo
                                                    </a>
                                                )}
                                                {project.githubUrl && (
                                                    <a
                                                        href={project.githubUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--text)]/5 hover:bg-[var(--text)]/10 text-[var(--text)] text-[9px] font-bold uppercase tracking-wider transition-colors"
                                                    >
                                                        <Icon icon="ph:github-logo-bold" className="w-3.5 h-3.5" /> Source
                                                    </a>
                                                )}
                                                <Link
                                                    to="/project/$slug"
                                                    params={{ slug: project.slug }}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--text)]/10 text-[var(--text-h)] hover:bg-[var(--text-h)] hover:text-[var(--bg)] text-[9px] font-bold uppercase tracking-wider transition-colors ml-auto"
                                                >
                                                    Detail <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5" />
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </motion.div>

                    {/* Infinite Scroll Trigger */}
                    {(hasNextPage || isLoading) && (
                        <motion.div
                            onViewportEnter={loadMore}
                            viewport={{ margin: "100px" }}
                            className="w-full flex justify-center py-12"
                        >
                            <div className="h-10 w-full flex items-center justify-center">
                                <button onClick={loadMore} className="text-sm font-bold opacity-50 hover:opacity-100 transition-opacity">
                                    Load More
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </section>
    )
}
