import { Icon } from '@iconify/react'
import { motion, useTransform } from 'motion/react'
import { useSectionProgress } from '../../hooks/useSectionProgress'
import { useExperience } from '../../hooks/useExperience'

export default function AboutExperience() {
    const { ref, progress } = useSectionProgress()
    const { data: experiences = [], isLoading } = useExperience()
    const opacity = useTransform(progress, [0, 0.15, 0.85, 1], [0, 1, 1, 0])
    const y = useTransform(progress, [0, 0.2, 0.8, 1], [50, 0, 0, -50])

    return (
        <section
            ref={ref}
            id="experience"
            className="relative w-full flex flex-col items-center justify-center px-6 pt-16 md:pt-24 pb-32 overflow-hidden bg-[var(--bg)]"
        >
            <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

            <motion.div style={{ opacity, y }} className="max-w-4xl w-full relative z-10 flex flex-col gap-16">
                <div className="flex flex-col items-center text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--accent-bg)] text-[var(--accent)] text-xs font-semibold tracking-wider uppercase mb-4 select-none">
                        <Icon icon="ph:briefcase-bold" className="w-3.5 h-3.5" />
                        Career
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-h)] tracking-tight mb-3">
                        Experience
                    </h2>
                    <p className="text-[var(--text)] opacity-60 text-sm sm:text-base max-w-lg">
                        My professional journey in software development and the roles that shaped my expertise.
                    </p>
                </div>

                <div className="relative flex flex-col gap-8 md:gap-4 max-w-5xl mx-auto w-full mt-6">
                    {/* Garis vertikal timeline */}
                    <div className="absolute left-[24px] md:left-1/2 -translate-x-1/2 top-2 bottom-2 w-[2px] bg-gradient-to-b from-[var(--border)] via-[var(--border)] to-transparent" />

                    {experiences.map((exp: any, i: number) => {
                        const isEven = i % 2 === 0;
                        return (
                            <div key={exp._id || i} className="relative flex md:justify-center group">
                                {/* Dot / Icon */}
                                <div className="absolute left-[24px] md:left-1/2 -translate-x-1/2 z-10 w-12 h-12 rounded-full border-2 border-[var(--border)] bg-[var(--bg)] flex items-center justify-center shadow-lg shrink-0 group-hover:border-emerald-500/50 transition-colors duration-300">
                                    {exp.current && (
                                        <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
                                    )}
                                    <Icon icon={exp.icon || "ph:briefcase-bold"} className={`w-5 h-5 md:w-6 md:h-6 transition-colors duration-300 ${exp.current ? 'text-emerald-500' : 'text-[var(--text-h)] group-hover:text-emerald-500'}`} />
                                </div>

                                {/* Content Wrapper */}
                                <div className={`w-full flex ${isEven ? 'md:justify-start' : 'md:justify-end'} pl-16 md:pl-0`}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        className={`w-full md:w-[45%] flex flex-col gap-3 pb-8 md:pb-12 ${isEven ? 'md:items-end' : 'md:items-start'}`}
                                    >
                                        <div className={`flex flex-col gap-2 ${isEven ? 'md:items-end' : 'md:items-start'}`}>
                                            <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-h)] group-hover:text-emerald-500 transition-colors duration-300">
                                                {exp.position}
                                            </h3>
                                            <div className={`flex flex-wrap items-center gap-2 text-sm ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                                                <span className="font-semibold text-emerald-500">{exp.companyName}</span>
                                                <span className="w-1 h-1 rounded-full bg-[var(--border)] hidden md:block" />
                                                <span className="text-[var(--text)] opacity-60 font-medium">{exp.type}</span>
                                                {exp.location && (
                                                    <>
                                                        <span className="w-1 h-1 rounded-full bg-[var(--border)] hidden md:block" />
                                                        <span className="text-[var(--text)] opacity-50 flex items-center gap-1">
                                                            <Icon icon="ph:map-pin-bold" className="w-3.5 h-3.5" />
                                                            {exp.location}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                            <span className="inline-flex w-fit items-center gap-1.5 px-3 py-1 mt-1 rounded-full border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-xs font-semibold shrink-0">
                                                <Icon icon="ph:calendar-blank-bold" className="w-3.5 h-3.5" />
                                                {exp.period}
                                            </span>
                                        </div>

                                        {/* Text Block Wrapper: Keeps internal text left-aligned, but pushes the whole block to the right if needed */}
                                        <div className={`flex flex-col w-full ${isEven ? 'md:items-end' : 'md:items-start'}`}>
                                            <div className="inline-block text-left max-w-full">
                                                <p className="text-[var(--text)] opacity-80 text-sm sm:text-[15px] leading-relaxed mt-1 font-medium">
                                                    {exp.summary}
                                                </p>
                                                <div
                                                    className="text-[var(--text)] opacity-60 text-sm sm:text-[14.5px] leading-relaxed mt-1 [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mb-1"
                                                    dangerouslySetInnerHTML={{ __html: exp.content }}
                                                />
                                            </div>
                                        </div>

                                        <div className={`flex flex-wrap gap-2 mt-3 w-full ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                                            {exp.responsibilities?.map((tag: string) => (
                                                <span key={tag} className="px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--accent-bg)]/30 text-xs font-medium text-[var(--text)] opacity-80 hover:opacity-100 hover:border-emerald-500/30 hover:text-emerald-400 transition-all cursor-default">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </motion.div>
        </section>
    )
}
