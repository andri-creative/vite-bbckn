import { useState } from 'react'
import { Icon } from '@iconify/react'
import { motion, useTransform, AnimatePresence } from 'motion/react'
import { useSectionProgress } from '../../hooks/useSectionProgress'
import { CERTIFICATES } from '../../data/certificates'
import { Link } from '@tanstack/react-router'
import { CardBody, CardContainer, CardItem } from '../ui/3d-card'

export default function WorkCertificates() {
    const { ref, progress } = useSectionProgress()
    const opacity = useTransform(progress, [0, 0.15, 0.85, 1], [0, 1, 1, 0])
    const y = useTransform(progress, [0, 0.2, 0.8, 1], [100, 0, 0, -100])

    const [visibleCount, setVisibleCount] = useState(6)
    const [isLoading, setIsLoading] = useState(false)

    const displayedCertificates = CERTIFICATES.slice(0, visibleCount)

    const loadMore = () => {
        if (isLoading || visibleCount >= CERTIFICATES.length) return
        setIsLoading(true)
        setTimeout(() => {
            setVisibleCount(prev => prev + 6)
            setIsLoading(false)
        }, 800)
    }

    return (
        <section
            ref={ref}
            id="certificates"
            className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 py-32 overflow-hidden bg-[var(--bg)]"
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '5s' }} />
                <div className="absolute bottom-[20%] left-[10%] w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '7s' }} />
            </div>

            <motion.div style={{ opacity, y }} className="max-w-[1400px] w-full relative z-10 flex flex-col gap-16">
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--accent-bg)]/50 backdrop-blur-md text-[var(--accent)] text-xs font-bold tracking-widest uppercase mb-6 shadow-xl"
                    >
                        <Icon icon="ph:seal-check-fill" className="w-4 h-4" />
                        Credentials & Honors
                    </motion.div>
                    <h2 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[var(--text-h)] to-[var(--text-h)]/50 tracking-tighter mb-6 leading-tight">
                        Achievements
                    </h2>
                    <p className="text-[var(--text)] opacity-70 text-lg sm:text-xl max-w-2xl leading-relaxed font-medium">
                        Validasi keahlian profesional, capaian, dan komitmen belajar berkelanjutan.
                    </p>
                </div>

                <div className="flex flex-col gap-12 w-full">
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-10">
                        <AnimatePresence mode="popLayout">
                            {displayedCertificates.map((cert) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                                    transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
                                    key={cert.id}
                                    className="z-10 w-full h-full flex"
                                >
                                    <CardContainer className="inter-var">
                                        <CardBody className="bg-[var(--accent-bg)]/30 backdrop-blur-xl relative group/card flex flex-col hover:shadow-2xl hover:shadow-amber-500/[0.1] border border-[var(--border)] hover:border-amber-500/40 transition-colors duration-500 w-full h-full rounded-3xl p-6">
                                            <CardItem
                                                translateZ="50"
                                                className="text-xl sm:text-2xl font-black text-[var(--text-h)] group-hover/card:text-amber-500 transition-colors duration-300 line-clamp-2"
                                            >
                                                {cert.title}
                                            </CardItem>
                                            <CardItem
                                                as="p"
                                                translateZ="60"
                                                className="text-[var(--text)] opacity-70 text-sm font-medium mt-2 flex items-center gap-2"
                                            >
                                                <Icon icon="ph:medal-fill" className="text-amber-500" />
                                                {cert.issuer} • {cert.issueDate}
                                            </CardItem>
                                            <CardItem translateZ="100" className="w-full mt-6 rounded-2xl overflow-hidden border border-[var(--border)]/50 shadow-xl group-hover/card:shadow-amber-500/20">
                                                <img
                                                    src={cert.image}
                                                    height="1000"
                                                    width="1000"
                                                    className="h-48 w-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                                                    alt={cert.title}
                                                />
                                            </CardItem>
                                            <div className="flex justify-between items-center mt-auto pt-8">
                                                <CardItem
                                                    translateZ={20}
                                                    className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg)]/50 text-[10px] font-black tracking-widest uppercase text-[var(--text)] opacity-80"
                                                >
                                                    {cert.category}
                                                </CardItem>
                                                <CardItem
                                                    translateZ={20}
                                                    as={Link}
                                                    to="/certificate/$id"
                                                    params={{ id: cert.id }}
                                                    className="px-5 py-2.5 rounded-xl bg-amber-500 text-white text-xs font-black tracking-wider uppercase hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-shadow duration-300 flex items-center gap-2"
                                                >
                                                    <Icon icon="ph:eye-bold" className="w-4 h-4" />
                                                    Detail
                                                </CardItem>
                                            </div>
                                        </CardBody>
                                    </CardContainer>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {visibleCount < CERTIFICATES.length && (
                        <motion.div
                            onViewportEnter={loadMore}
                            viewport={{ margin: "100px" }}
                            className="w-full flex justify-center py-12"
                        >
                            {isLoading ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-amber-500 text-white shadow-2xl"
                                >
                                    <Icon icon="ph:spinner-bold" className="w-5 h-5 animate-spin" />
                                    <span className="text-xs font-black tracking-widest uppercase">Loading More...</span>
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
