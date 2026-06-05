import { AsciiArt } from './ui/ascii-art'
import { Icon } from '@iconify/react'
import { GitHub } from './icons/GitHub'
import { LinkedIn } from './icons/LinkedIn'
import { Instagram } from './icons/Instagram'
import profileImg from '../assets/01.webp'
import { motion, useMotionValue, useTransform } from 'motion/react'
import { useRef, useEffect } from 'react'

function useSectionProgress(ref: React.RefObject<HTMLDivElement | null>) {
    const progress = useMotionValue(0)

    useEffect(() => {
        const update = () => {
            if (!ref.current) return
            const rect = ref.current.getBoundingClientRect()
            const vh = window.innerHeight
            // 0 = section bottom just enters viewport (below screen)
            // 0.5 = section centered in viewport
            // 1 = section top just exits viewport (above screen)
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

export default function Portfolio() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const progress = useSectionProgress(sectionRef)

    // Left: enter from left, exit to left
    const leftX = useTransform(progress, [0, 0.25, 0.75, 1], [-100, 0, 0, -100])
    // Right: enter from right, exit to right
    const rightX = useTransform(progress, [0, 0.25, 0.75, 1], [100, 0, 0, 100])
    // Fade in on enter, fade out on exit
    const opacity = useTransform(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

    return (
        <div
            ref={sectionRef}
            id="next-section"
            className="relative bg-[var(--bg)] border-t border-[var(--border)] px-6 py-16 lg:py-0 flex flex-col items-center justify-center z-10 overflow-hidden w-full h-auto min-h-[calc(100vh-60px)] lg:h-[calc(100vh-60px)] lg:min-h-[calc(100vh-60px)]"
        >
            {/* Ambient glowing orb */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-500/10 to-emerald-500/10 rounded-full blur-[120px] pointer-events-none select-none" />

            <div className="max-w-6xl w-full relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                    {/* Left Column — enter from left, exit to left */}
                    <motion.div
                        className="lg:col-span-6 flex flex-col items-start text-left"
                        style={{ x: leftX, opacity }}
                    >
                        <p className="text-[var(--text)] text-base sm:text-lg font-medium mb-2 select-none">
                            Hi, I'am 👋
                        </p>
                        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[var(--text-h)] tracking-tight mb-4 leading-none">
                            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent font-black">Andrianto</span>
                        </h2>

                        <div className="flex flex-wrap items-center gap-1.5 mb-5">
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-[var(--border)] bg-[var(--bg)]/50 backdrop-blur-md text-[10px] sm:text-xs font-semibold text-[var(--text)] select-none">
                                <Icon icon="ph:map-pin-fill" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--accent)]" />
                                <span>Surabaya, Indonesia 🇮🇩</span>
                            </div>
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-[10px] sm:text-xs font-semibold text-emerald-400 select-none">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span>Freelance</span>
                            </div>
                        </div>

                        <p className="text-[var(--text)] opacity-85 leading-relaxed text-sm sm:text-base mb-3">
                            I am a <span className="text-[var(--text-h)] font-semibold">Full-Stack Web Developer</span> with a strong foundation in Informatics Engineering and a passion for creating impactful digital solutions.
                        </p>
                        <p className="text-[var(--text)] opacity-85 leading-relaxed text-sm sm:text-base mb-3">
                            I specialize in <span className="text-[var(--accent)] font-semibold">Laravel, React.js, Express.js,</span> and <span className="text-[var(--accent)] font-semibold">Next.js</span> — building applications that balance efficient back-end logic with clean and engaging front-end design.
                        </p>
                        <p className="text-[var(--text)] opacity-75 leading-relaxed text-sm sm:text-base mb-8">
                            My focus is on <span className="text-[var(--text-h)] font-medium">scalability, performance, and user experience</span>, ensuring every project delivers real value for both users and businesses.
                        </p>

                        <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full mb-6 sm:mb-8">
                            <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--bg)]/30 backdrop-blur-md hover:border-[var(--accent)] hover:bg-[var(--bg)]/50 transition-all duration-300">
                                <div className="text-[var(--accent)] mb-2 sm:mb-3">
                                    <Icon icon="ph:code-bold" className="w-4 h-4 sm:w-6 sm:h-6" />
                                </div>
                                <h3 className="font-bold text-[var(--text-h)] text-xs sm:text-base mb-1">Fullstack Code</h3>
                                <p className="text-[10px] sm:text-xs text-[var(--text)] opacity-80 leading-relaxed">
                                    Laravel, React.js, Express.js & Next.js — robust APIs to fast UIs.
                                </p>
                            </div>
                            <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--bg)]/30 backdrop-blur-md hover:border-[var(--accent)] hover:bg-[var(--bg)]/50 transition-all duration-300">
                                <div className="text-emerald-400 mb-2 sm:mb-3">
                                    <Icon icon="ph:palette-bold" className="w-4 h-4 sm:w-6 sm:h-6" />
                                </div>
                                <h3 className="font-bold text-[var(--text-h)] text-xs sm:text-base mb-1">Creative UI/UX</h3>
                                <p className="text-[10px] sm:text-xs text-[var(--text)] opacity-80 leading-relaxed">
                                    Micro-interactions, responsive grids, and glassmorphic aesthetics.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <a
                                href="mailto:andri@creative.dev"
                                className="px-6 py-3 rounded-xl bg-[var(--text-h)] hover:bg-[var(--accent)] text-[var(--bg)] font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 no-underline"
                            >
                                <Icon icon="ph:paper-plane-tilt-fill" className="w-4 h-4" />
                                <span>Get in touch</span>
                            </a>
                            <div className="flex items-center gap-3">
                                <a href="#" aria-label="GitHub" className="w-10 h-10 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text-h)] hover:text-[var(--accent)] hover:border-[var(--accent)] bg-[var(--bg)]/40 hover:-translate-y-1 transition-all duration-300">
                                    <GitHub className="w-5 h-5" />
                                </a>
                                <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-xl border border-[var(--border)] flex items-center justify-center hover:border-[#0A66C2]/60 bg-[var(--bg)]/40 hover:-translate-y-1 transition-all duration-300">
                                    <LinkedIn className="w-5 h-5" />
                                </a>
                                <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-xl border border-[var(--border)] flex items-center justify-center hover:border-pink-500/60 bg-[var(--bg)]/40 hover:-translate-y-1 transition-all duration-300">
                                    <Instagram className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column — enter from right, exit to right */}
                    <motion.div
                        className="lg:col-span-6 flex items-center justify-center w-full"
                        style={{ x: rightX, opacity }}
                    >
                        <div className="w-full" style={{ aspectRatio: '1 / 1' }}>
                            <AsciiArt
                                src={profileImg}
                                resolution={100}
                                charset="binary"
                                color="#10b981"
                                inverted={true}
                                animated={false}
                                className="w-full h-full bg-transparent"
                            />
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    )
}
