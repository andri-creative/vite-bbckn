import { Icon } from '@iconify/react'
import { GitHub } from './icons/GitHub'
import { LinkedIn } from './icons/LinkedIn'
import { Instagram } from './icons/Instagram'
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

export default function ContactCTA() {
    const sectionRef = useRef<HTMLElement>(null)
    const progress = useSectionProgress(sectionRef)

    const opacity = useTransform(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
    const y = useTransform(progress, [0, 0.25, 0.75, 1], [60, 0, 0, -60])

    return (
        <section ref={sectionRef} className="relative bg-[var(--bg)] border-t border-[var(--border)] px-6 py-24 flex flex-col justify-center items-center z-10 overflow-hidden w-full min-h-screen">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gradient-to-b from-cyan-500/8 to-emerald-500/8 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[300px] h-[200px] bg-violet-500/5 rounded-full blur-[80px] pointer-events-none" />

            <motion.div
                className="max-w-3xl w-full relative z-10 flex flex-col items-center text-center"
                style={{ opacity, y }}
            >
                {/* Badge */}
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--accent-bg)] text-[var(--accent)] text-xs font-semibold tracking-wider uppercase mb-6 select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Available for work
                </span>

                {/* Heading */}
                <h2 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-h)] tracking-tight mb-4 leading-tight">
                    Let's build something{' '}
                    <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                        great together
                    </span>
                </h2>

                <p className="text-[var(--text)] opacity-70 text-base sm:text-lg leading-relaxed mb-10 max-w-xl">
                    Whether you have a project in mind, need a collaborator, or just want to say hi — my inbox is always open.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                    <a
                        href="mailto:andri@creative.dev"
                        className="px-8 py-3.5 rounded-xl bg-[var(--text-h)] hover:bg-[var(--accent)] text-[var(--bg)] font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 no-underline shadow-lg hover:shadow-[var(--accent)]/20"
                    >
                        <Icon icon="ph:paper-plane-tilt-fill" className="w-4 h-4" />
                        Send me an email
                    </a>
                    <a
                        href="/contact"
                        className="px-8 py-3.5 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] text-[var(--text-h)] hover:text-[var(--accent)] font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 no-underline bg-[var(--bg)]/40"
                    >
                        <Icon icon="ph:chat-circle-text-bold" className="w-4 h-4" />
                        Contact page
                    </a>
                </div>

                {/* Divider */}
                <div className="w-full flex items-center gap-4 mb-8">
                    <div className="flex-1 h-px bg-[var(--border)]" />
                    <span className="text-xs text-[var(--text)] opacity-40 font-semibold uppercase tracking-widest">or find me on</span>
                    <div className="flex-1 h-px bg-[var(--border)]" />
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-4">
                    <a href="#" aria-label="GitHub" className="group w-12 h-12 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text-h)] hover:text-[var(--accent)] hover:border-[var(--accent)] bg-[var(--bg)]/40 hover:-translate-y-1 transition-all duration-300">
                        <GitHub className="w-5 h-5" />
                    </a>
                    <a href="#" aria-label="LinkedIn" className="group w-12 h-12 rounded-xl border border-[var(--border)] flex items-center justify-center hover:border-[#0A66C2]/60 bg-[var(--bg)]/40 hover:-translate-y-1 transition-all duration-300">
                        <LinkedIn className="w-5 h-5" />
                    </a>
                    <a href="#" aria-label="Instagram" className="group w-12 h-12 rounded-xl border border-[var(--border)] flex items-center justify-center hover:border-pink-500/60 bg-[var(--bg)]/40 hover:-translate-y-1 transition-all duration-300">
                        <Instagram className="w-5 h-5" />
                    </a>
                </div>

                <p className="mt-10 text-xs text-[var(--text)] opacity-30 select-none">
                    © {new Date().getFullYear()} Andri Creative · Built with React + Vite
                </p>
            </motion.div>
        </section>
    )
}
