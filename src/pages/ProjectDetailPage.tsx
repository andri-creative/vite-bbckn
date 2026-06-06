import { Icon } from '@iconify/react'
import { motion } from 'motion/react'
import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { GitHub } from '@/components/icons/GitHub'
import { Situs } from '@/components/icons/Situs'
import { useProjectById } from '../hooks/useProject'

interface ProjectDetailPageProps {
    slug: string
}

export default function ProjectDetailPage({ slug }: ProjectDetailPageProps) {
    const { data: project, isLoading } = useProjectById(slug)

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    if (isLoading && !project) {
        return null;
    }

    if (!project) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] px-6">
                <Icon icon="ph:file-dashed-bold" className="w-20 h-20 text-[var(--text)] opacity-20 mb-6" />
                <h1 className="text-3xl font-bold text-[var(--text-h)] mb-4">Project Not Found</h1>
                <p className="text-[var(--text)] opacity-60 text-center mb-8">
                    The project you're looking for doesn't exist or has been removed.
                </p>
                <Link
                    to="/work"
                    className="px-6 py-3 rounded-xl bg-[var(--accent-bg)] border border-[var(--border)] text-[var(--text-h)] font-bold tracking-widest uppercase text-sm hover:shadow-lg transition-all hover:-translate-y-1"
                >
                    Back to Work
                </Link>
            </div>
        )
    }

    const images = Array.isArray(project.image) && project.image.length > 0 ? project.image : (project.imageUrls || ['https://via.placeholder.com/600'])
    const themeColor = project.color || project.accent || '#9ca3af'
    const techStack = project.techStack || project.tags || []
    const tools = project.tools || []

    return (
        <main className="relative w-full min-h-screen bg-[var(--bg)] pt-24 pb-32 overflow-hidden">
            {/* Background Glow */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] blur-[120px] opacity-20 pointer-events-none rounded-full`} style={{ background: `linear-gradient(to bottom, ${themeColor}, transparent)` }} />

            <div className="max-w-5xl w-full mx-auto px-6 relative z-10">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-12"
                >
                    <Link
                        to="/work"
                        className="inline-flex items-center gap-2 text-[var(--text)] opacity-60 hover:opacity-100 transition-opacity font-medium"
                    >
                        <Icon icon="ph:arrow-left-bold" /> Back to Projects
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-6 mb-16"
                >
                    <div className="flex flex-wrap items-center gap-4">
                        <span className="px-3 py-1.5 rounded-lg bg-[var(--accent-bg)] border border-[var(--border)] text-[var(--text-h)] text-xs font-bold uppercase tracking-widest shadow-sm">
                            {project.category || 'PROJECT'}
                        </span>
                        <div
                            className={`w-10 h-10 rounded-xl bg-[var(--bg)]/80 backdrop-blur-md border flex items-center justify-center shadow-lg`}
                            style={{ color: themeColor, borderColor: `${themeColor}40` }}
                        >
                            <Icon icon={project.icon || 'ph:folder-bold'} className="w-5 h-5" />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--text-h)] tracking-tight leading-tight">
                        {project.title}
                    </h1>

                    <p className="text-[var(--text)] opacity-70 text-lg md:text-xl max-w-3xl leading-relaxed font-medium">
                        {project.summary || 'SUMMARY IS MISSING'}
                    </p>
                </motion.div>

                {/* Cover / Gallery */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col gap-6 mb-20"
                >
                    {/* Main Big Image */}
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-[var(--border)] shadow-2xl shadow-black/20">
                        <img
                            src={images[0]}
                            alt={`${project.title} Cover`}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                    </div>

                    {/* Additional Images Grid if array has more than 1 image */}
                    {images.length > 1 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {images.slice(1).map((img: string, idx: number) => (
                                <div key={idx} className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[var(--border)] shadow-lg">
                                    <img
                                        src={img}
                                        alt={`${project.title} screenshot ${idx + 1}`}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Main Content Area */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 flex flex-col gap-10"
                    >
                        <div>
                            <h2
                                className="text-2xl font-bold mb-6 flex items-center gap-3"
                                style={{ color: themeColor }}
                            >
                                <Icon icon="ph:info-bold" />
                                About The Project
                            </h2>
                            {/* Render HTML content safely with premium prose styles */}
                            <div
                                className="prose prose-invert prose-lg max-w-none text-[var(--text)]/80 leading-loose prose-headings:text-[var(--text-h)] prose-headings:font-bold prose-a:text-[var(--accent)] prose-strong:text-[var(--text-h)] prose-img:rounded-2xl prose-img:shadow-2xl prose-hr:border-[var(--border)]"
                                dangerouslySetInnerHTML={{ __html: project.content || '<p>No detailed content available.</p>' }}
                            />
                        </div>
                    </motion.div>

                    {/* Sidebar Metadata */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col gap-10"
                    >
                        <div className="p-8 rounded-3xl bg-[var(--accent-bg)] border border-[var(--border)] shadow-lg flex flex-col gap-8">
                            <h3 className="text-xl font-bold text-[var(--text-h)] border-b border-[var(--border)] pb-4">
                                Project Details
                            </h3>

                            <ul className="flex flex-col gap-6">
                                {project.company && (
                                    <li className="flex flex-col gap-1">
                                        <span className="text-[var(--text)] opacity-50 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                            <Icon icon="ph:buildings-bold" /> Company
                                        </span>
                                        <span className="text-[var(--text-h)] font-medium">{project.company}</span>
                                    </li>
                                )}
                                {project.workType && (
                                    <li className="flex flex-col gap-1">
                                        <span className="text-[var(--text)] opacity-50 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                            <Icon icon="ph:briefcase-bold" /> Work Type
                                        </span>
                                        <span className="text-[var(--text-h)] font-medium">{project.workType}</span>
                                    </li>
                                )}
                                {project.duration && (
                                    <li className="flex flex-col gap-1">
                                        <span className="text-[var(--text)] opacity-50 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                            <Icon icon="ph:clock-bold" /> Duration
                                        </span>
                                        <span className="text-[var(--text-h)] font-medium">{project.duration}</span>
                                    </li>
                                )}
                                {project.location && (
                                    <li className="flex flex-col gap-1">
                                        <span className="text-[var(--text)] opacity-50 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                            <Icon icon="ph:map-pin-bold" /> Location
                                        </span>
                                        <span className="text-[var(--text-h)] font-medium">{project.location}</span>
                                    </li>
                                )}
                            </ul>
                        </div>

                        <div className="flex flex-col gap-4">
                            <h3 className="text-sm font-bold text-[var(--text)] opacity-60 uppercase tracking-widest mb-2 border-b border-[var(--border)] pb-2">Technologies</h3>
                            <div className="flex flex-wrap gap-2">
                                {techStack.map((tag: any) => {
                                    const label = typeof tag === 'string' ? tag : tag.label;
                                    return (
                                        <span key={label} className="px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-xs font-bold text-[var(--text-h)] shadow-sm">
                                            {label}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>

                        {tools.length > 0 && (
                            <div className="flex flex-col gap-4 mt-2">
                                <h3 className="text-sm font-bold text-[var(--text)] opacity-60 uppercase tracking-widest mb-2 border-b border-[var(--border)] pb-2">Tools & Integrations</h3>
                                <div className="flex flex-wrap items-center gap-3">
                                    {tools.map((item: any, index: number) => (
                                        item.icon && (
                                            <span
                                                key={item._id || item.label || index}
                                                title={item.label}
                                                className={`flex items-center justify-center w-11 h-11 rounded-xl bg-[var(--bg)] border border-[var(--border)] shadow-md transition-transform hover:scale-110 hover:shadow-xl`}
                                                style={{ color: themeColor }}
                                            >
                                                <span className="w-6 h-6 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full" dangerouslySetInnerHTML={{ __html: item.icon }} />
                                            </span>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 mt-6">
                            {(project.live || project.demoUrl) && (
                                <a
                                    href={project.live || project.demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 border transition-all shadow-lg hover:-translate-y-1 font-extrabold uppercase tracking-widest text-sm`}
                                    style={{ backgroundColor: `${themeColor}20`, borderColor: themeColor, color: themeColor }}
                                >
                                    <Situs className="w-5 h-5" />
                                    Visit Live Site
                                </a>
                            )}
                            {(project.repo || project.githubUrl) && (
                                <a
                                    href={project.repo || project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-4 rounded-xl flex items-center justify-center gap-3 bg-[var(--bg)] border border-[var(--border)] text-[var(--text-h)] text-sm font-extrabold uppercase tracking-widest hover:bg-[var(--border)] transition-all shadow-md hover:-translate-y-1"
                                >
                                    <GitHub className="w-5 h-5" />
                                    Source Code
                                </a>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    )
}
