import { Icon } from '@iconify/react'
import { motion, useTransform } from 'motion/react'
import { useSectionProgress } from '../../hooks/useSectionProgress'
import AutoSlider from '../ui/AutoSlider'
import { useBio } from '../../hooks/useBio'
import profileImg from '../../assets/andri_profile.png'

export default function AboutBio() {
    const { ref, progress } = useSectionProgress()

    const opacity = useTransform(progress, [0, 0.15, 0.85, 1], [0, 1, 1, 0])
    const y = useTransform(progress, [0, 0.2, 0.8, 1], [50, 0, 0, -50])

    const { data: bioData } = useBio();
    const bio = bioData || {};
    const BIO_STATS = bio.stats || [];
    const EDUCATION = bio.educations || [];
    const PUBLICATIONS = bio.publications || [];

    return (
        <motion.section
            ref={ref}
            id="bio"
            style={{ opacity, y }}
            className="relative w-full flex flex-col items-center justify-center px-6 pt-24 md:pt-32 pb-10 md:pb-12 border-b border-[var(--border)] bg-[var(--bg)]"
        >
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[var(--accent)]/4 rounded-full blur-[160px] pointer-events-none -translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-500/4 rounded-full blur-[140px] pointer-events-none translate-x-1/3 translate-y-1/3" />

            <div className="max-w-6xl w-full relative z-10 flex flex-col gap-20">
                {/* ── Bio + Stats ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
                    {/* Left Column — Intro */}
                    <motion.div
                        initial={{ x: -80, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="lg:col-span-7 flex flex-col gap-7"
                    >
                        <div className="flex flex-col gap-3">
                            <span className="inline-flex items-center gap-2 px-3 py-1 w-fit rounded-full border border-[var(--border)] bg-[var(--accent-bg)] text-[var(--accent)] text-xs font-semibold tracking-wider uppercase select-none">
                                <Icon icon="ph:user-circle-bold" className="w-3.5 h-3.5" />
                                About Me
                            </span>
                            <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-h)] tracking-tight leading-[1.1]">
                                A brief{' '}
                                <span className="bg-gradient-to-r from-[var(--accent)] to-violet-400 bg-clip-text text-transparent font-black">
                                    introduction
                                </span>
                            </h1>
                            <p className="text-[var(--text)] opacity-50 text-sm">to who I am.</p>
                        </div>

                        <div className="flex flex-col gap-4 text-[var(--text)] text-sm sm:text-[15px] leading-[1.85] opacity-75">
                            <p>
                                I am an experienced and passionate{' '}
                                <span className="text-[var(--text-h)] font-semibold">Full-Stack Developer</span> with a strong
                                foundation in Informatics Engineering from{' '}
                                <span className="text-[var(--text-h)] font-semibold">University 17 August 1945 Surabaya</span>.
                                I specialize in developing scalable, efficient, and user-centric digital solutions across platforms.
                            </p>
                            <p>
                                On the frontend, I use{' '}
                                <span className="text-[var(--accent)] font-medium">React.js</span>,{' '}
                                <span className="text-[var(--accent)] font-medium">Next.js</span>, and{' '}
                                <span className="text-[var(--accent)] font-medium">Tailwind CSS</span> to build responsive interfaces.
                                On the backend, I work with{' '}
                                <span className="text-[var(--accent)] font-medium">Laravel</span>,{' '}
                                <span className="text-[var(--accent)] font-medium">Express.js</span>, and{' '}
                                <span className="text-[var(--accent)] font-medium">Golang</span> to design reliable services.
                            </p>
                            <p>
                                I thrive in collaborative environments, am detail-oriented and adaptable,
                                and committed to continuous learning — delivering high-performance applications
                                that create meaningful impact.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 pt-4 border-t border-[var(--border)]">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--accent)] to-violet-500 flex items-center justify-center shadow-lg shadow-[var(--accent)]/20">
                                <Icon icon="ph:user-bold" className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-[var(--text-h)] text-sm font-semibold">Andrianto</p>
                                <p className="text-[var(--text)] text-xs opacity-40">Best regards</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column — Profile Image */}
                    <motion.div
                        initial={{ x: 80, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                        className="lg:col-span-5 flex flex-col gap-8 w-full"
                    >
                        {/* Profile Image wrapper */}
                        <div className="relative w-full">
                            {/* Decorative background glow */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent)]/15 to-violet-500/15 rounded-3xl blur-2xl transform scale-95 -z-10" />
                            
                            <div className="relative group overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg)]/40 p-3 backdrop-blur-md shadow-2xl transition-all duration-500 hover:border-[var(--accent)]/50 hover:shadow-[var(--accent)]/10">
                                {/* Photo aspect ratio */}
                                <div className="relative overflow-hidden rounded-2xl aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] w-full max-w-[420px] mx-auto">
                                    <motion.img
                                        src={profileImg}
                                        alt="Andrianto Profile"
                                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    {/* Overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/80 via-transparent to-transparent opacity-65 pointer-events-none" />
                                </div>
                                
                                {/* Decorative badge overlay on the photo */}
                                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between bg-[var(--bg)]/70 backdrop-blur-md border border-[var(--border)] px-4 py-3 rounded-xl shadow-lg">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold text-[var(--text-h)] leading-tight">Andrianto</span>
                                            <span className="text-[10px] text-[var(--text)] opacity-60">Full-Stack Developer</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors">
                                            <Icon icon="ph:github-logo-bold" className="w-4 h-4" />
                                        </a>
                                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors">
                                            <Icon icon="ph:linkedin-logo-bold" className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Stats spanning full width in a single horizontal row */}
                {BIO_STATS.length > 0 && (
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full"
                    >
                        {BIO_STATS.map((stat: any) => (
                            <div
                                key={stat._id || stat.label}
                                className="group rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-6 flex flex-col gap-1 hover:border-[var(--accent)]/40 hover:bg-[var(--accent-bg)] transition-all duration-300"
                            >
                                <span className="text-3xl sm:text-4xl font-extrabold text-[var(--text-h)] group-hover:text-[var(--accent)] transition-colors duration-300">
                                    {stat.value}
                                </span>
                                <span className="text-xs sm:text-sm text-[var(--text)] opacity-50 font-medium tracking-wide">{stat.label}</span>
                            </div>
                        ))}
                    </motion.div>
                )}

                {/* ── Education + Publications ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">

                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                        className="flex flex-col gap-4 h-full"
                    >
                        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
                            <Icon icon="ph:graduation-cap-bold" className="w-4 h-4" />
                            Education
                            {EDUCATION.length > 1 && (
                                <span className="ml-auto text-[var(--text)] opacity-30 normal-case tracking-normal font-normal">
                                    {EDUCATION.length} entries
                                </span>
                            )}
                        </div>
                        {EDUCATION.length > 0 ? (
                            <AutoSlider interval={5000} showArrows={false}>
                                {EDUCATION.map((edu: any, i: number) => (
                                    <div key={i} className="h-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] overflow-hidden hover:border-[var(--accent)]/40 transition-colors duration-300">
                                        <div className="h-1 w-full bg-gradient-to-r from-[var(--accent)] to-violet-500" />
                                        <div className="p-6 flex flex-col gap-5">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--accent-bg)] border border-[var(--accent)]/20 flex items-center justify-center shrink-0">
                                                    <Icon icon="ph:buildings-bold" className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--accent)]" />
                                                </div>
                                                <div className="flex flex-col gap-1 min-w-0">
                                                    <p className="text-[var(--text-h)] font-bold text-sm leading-snug">{edu.institution}</p>
                                                    <p className="text-[var(--accent)] text-xs font-semibold">{edu.major}</p>
                                                    <p className="text-[var(--text)] text-xs opacity-50">{edu.degree}</p>
                                                    <div className="flex flex-wrap gap-3 text-xs text-[var(--text)] opacity-50 mt-1">
                                                        <span className="flex items-center gap-1">
                                                            <Icon icon="ph:calendar-blank-bold" className="w-3 h-3" />
                                                            {edu.period}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Icon icon="ph:map-pin-bold" className="w-3 h-3" />
                                                            {edu.location}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {edu.thesis && (
                                                <div className="rounded-xl bg-[var(--accent-bg)] border border-[var(--accent)]/10 p-4 flex flex-col gap-3">
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest">
                                                        <Icon icon="ph:book-open-bold" className="w-3.5 h-3.5" />
                                                        {edu.thesis.label}
                                                    </div>
                                                    <p className="text-[var(--text-h)] text-xs font-semibold leading-snug">{edu.thesis.title}</p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {edu.thesis.tags.map((tag: string) => (
                                                            <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-semibold border border-[var(--accent)]/20 text-[var(--accent)] bg-[var(--bg)]">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </AutoSlider>
                        ) : (
                            <div className="h-full min-h-[200px] flex items-center justify-center rounded-2xl border border-[var(--border)] text-[var(--text)] opacity-50 text-sm">
                                No education data available.
                            </div>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
                        className="flex flex-col gap-4 h-full"
                    >
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 uppercase tracking-wider">
                            <Icon icon="ph:article-bold" className="w-4 h-4" />
                            Journal Publications
                            {PUBLICATIONS.length > 1 && (
                                <span className="ml-auto text-[var(--text)] opacity-30 normal-case tracking-normal font-normal">
                                    {PUBLICATIONS.length} papers
                                </span>
                            )}
                        </div>
                        {PUBLICATIONS.length > 0 ? (
                            <AutoSlider interval={4500} showArrows={false}>
                                {PUBLICATIONS.map((pub: any, i: number) => (
                                    <div key={i} className="h-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] overflow-hidden hover:border-emerald-500/40 transition-colors duration-300">
                                        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
                                        <div className="p-6 flex flex-col gap-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">#{i + 1} Publication</span>
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">{pub.status}</span>
                                            </div>
                                            <p className="text-[var(--text-h)] font-bold text-sm leading-snug">{pub.title}</p>
                                            <div className="flex flex-col gap-1.5 text-xs text-[var(--text)] opacity-60">
                                                <span className="flex items-start gap-2">
                                                    <Icon icon="ph:newspaper-bold" className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                                    {pub.journal}
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <Icon icon="ph:hash-bold" className="w-3.5 h-3.5 shrink-0" />
                                                    {pub.volume}
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <Icon icon="ph:calendar-blank-bold" className="w-3.5 h-3.5 shrink-0" />
                                                    {pub.date}
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <Icon icon="ph:link-bold" className="w-3.5 h-3.5 shrink-0" />
                                                    DOI: {pub.doi}
                                                </span>
                                                <span className="flex items-center gap-2 flex-wrap">
                                                    <Icon icon="ph:users-three-bold" className="w-3.5 h-3.5 shrink-0" />
                                                    {pub.authors.map((a: string, j: number) => (
                                                        <span key={j} className={a === 'Andrianto' ? 'text-[var(--text-h)] font-semibold' : ''}>
                                                            {a}{j < pub.authors.length - 1 ? ',' : ''}
                                                        </span>
                                                    ))}
                                                </span>
                                            </div>
                                            <a href={pub.link} target="_blank" rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-500 hover:opacity-80 transition-opacity no-underline pt-4 border-t border-[var(--border)]">
                                                <Icon icon="ph:arrow-square-out-bold" className="w-4 h-4" />
                                                Read Full Paper
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </AutoSlider>
                        ) : (
                            <div className="h-full min-h-[200px] flex items-center justify-center rounded-2xl border border-[var(--border)] text-[var(--text)] opacity-50 text-sm">
                                No publication data available.
                            </div>
                        )}
                    </motion.div>

                </div>
            </div>
        </motion.section>
    )
}
