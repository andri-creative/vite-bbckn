import { Icon } from '@iconify/react'
import { ImagesBadge } from "@/components/ui/images-badge";
import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform } from 'motion/react'

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

export default function Certificates() {
    const sectionRef = useRef<HTMLElement>(null)
    const progress = useSectionProgress(sectionRef)
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    const opacity = useTransform(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
    const headerY = useTransform(progress, [0, 0.25, 0.75, 1], [50, 0, 0, -50])
    const badgeScale = useTransform(progress, [0, 0.25, 0.75, 1], [0.8, 1, 1, 0.8])

    return (
        <section ref={sectionRef} className="relative bg-[var(--bg)] border-t border-[var(--border)] px-6 py-20 flex flex-col justify-center items-center z-10 overflow-hidden w-full min-h-screen">
            <div className="absolute top-1/3 right-0 w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl w-full flex-1 flex flex-col justify-between relative z-10 py-10 sm:py-0">

                {/* Header */}
                <motion.div
                    className="flex flex-col items-center text-center"
                    style={{ opacity, y: headerY }}
                >
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--accent-bg)] text-[var(--accent)] text-xs font-semibold tracking-wider uppercase mb-4 select-none">
                        <Icon icon="ph:seal-check-bold" className="w-3.5 h-3.5" />
                        Credentials
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-h)] tracking-tight mb-3">
                        Certificates
                    </h2>
                    <p className="text-[var(--text)] opacity-70 text-sm sm:text-base max-w-lg">
                        Professional certifications that validate my expertise across cloud, development, and design disciplines.
                    </p>
                </motion.div>

                {/* Badge */}
                <div className="flex-1 flex flex-col justify-center my-12">
                    <motion.div
                        className="flex w-full items-center justify-center"
                        style={{ opacity, scale: badgeScale }}
                    >
                        <ImagesBadge
                            text=""
                            images={[
                                "https://assets.aceternity.com/pro/agenforce-2.webp",
                                "https://assets.aceternity.com/pro/minimal-3-min.webp",
                                "https://assets.aceternity.com/pro/bento-4.png",
                            ]}
                            folderSize={isDesktop ? { width: 220, height: 180 } : { width: 110, height: 100 }}
                            teaserImageSize={isDesktop ? { width: 200, height: 160 } : { width: 100, height: 90 }}
                            hoverImageSize={isDesktop ? { width: 360, height: 280 } : { width: 180, height: 160 }}
                            hoverTranslateY={isDesktop ? -200 : -110}
                            hoverSpread={isDesktop ? 100 : 50}
                        />
                    </motion.div>
                </div>

                {/* Footer */}
                <motion.div className="flex justify-center mt-auto" style={{ opacity }}>
                    <a href="/about#certificates" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:opacity-80 transition-opacity no-underline">
                        View all certificates
                        <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
                    </a>
                </motion.div>
            </div>
        </section>
    )
}
