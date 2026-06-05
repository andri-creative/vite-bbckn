import { Icon } from '@iconify/react'
import { motion, useTransform, useMotionValue, useAnimationFrame } from 'motion/react'
import { useSectionProgress } from '../../hooks/useSectionProgress'
import { useTools } from '../../hooks/tools'
import { useEffect, useRef, useState } from 'react'

export default function AboutSkills() {
    const { ref, progress } = useSectionProgress()
    const opacity = useTransform(progress, [0, 0.15, 0.85, 1], [0, 1, 1, 0])
    const y = useTransform(progress, [0, 0.2, 0.8, 1], [50, 0, 0, -50])

    const { data: tools, isLoading } = useTools(true)

    return (
        <section
            ref={ref}
            id="skills"
            className="relative w-full flex flex-col items-center justify-center px-6 pt-10 md:pt-12 pb-24 md:pb-32 border-b border-[var(--border)] overflow-hidden bg-[var(--bg)]"
        >
            <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

            <motion.div style={{ opacity, y }} className="max-w-full w-full relative z-10 flex flex-col gap-16">
                <div className="flex flex-col items-center text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--accent-bg)] text-[var(--accent)] text-xs font-semibold tracking-wider uppercase mb-4 select-none">
                        <Icon icon="ph:lightning-fill" className="w-3.5 h-3.5" />
                        Tech Stack
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-h)] tracking-tight mb-3">
                        Skills & Tools
                    </h2>
                    <p className="text-[var(--text)] opacity-60 text-sm sm:text-base max-w-lg">
                        The technologies, frameworks, and tools I use to build scalable and efficient applications.
                    </p>
                </div>

                {isLoading ? (
                    <div className="w-full flex justify-center items-center py-12">
                        <Icon icon="ph:spinner-gap-bold" className="w-6 h-6 animate-spin text-[var(--accent)]" />
                    </div>
                ) : (
                    <div className="relative w-full flex flex-col gap-3 sm:gap-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] py-10">
                        {/* Garis Vertikal Teal (Satu garis membentang menembus 3 baris) */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-cyan-500 to-transparent shadow-[0_0_15px_3px_rgba(6,182,212,0.6)] -translate-x-1/2 z-20 pointer-events-none" />

                        {/* Particles (Melayang di sekitar tengah layar) */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[300px] z-10 pointer-events-none">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="w-full h-full absolute origin-center">
                                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full absolute top-10 left-10 shadow-[0_0_10px_cyan]" />
                                <div className="w-1 h-1 bg-[var(--text-h)] rounded-full absolute bottom-20 right-10 shadow-[0_0_10px_white]" />
                            </motion.div>
                            <motion.div animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="w-full h-full absolute origin-center">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full absolute top-1/2 -left-4 shadow-[0_0_10px_emerald]" />
                                <div className="w-1.5 h-1.5 bg-violet-400 rounded-full absolute top-1/4 right-0 shadow-[0_0_10px_violet]" />
                            </motion.div>
                        </div>

                        {(() => {
                            const toolsList = tools || [];
                            const third = Math.ceil(toolsList.length / 3);
                            return (
                                <>
                                    <CoverFlowMarquee items={toolsList.slice(0, third)} direction="left" speed={1.2} />
                                    <CoverFlowMarquee items={toolsList.slice(third, third * 2)} direction="right" speed={1.5} />
                                    <CoverFlowMarquee items={toolsList.slice(third * 2)} direction="left" speed={1.0} />
                                </>
                            );
                        })()}
                    </div>
                )}
            </motion.div>
        </section>
    )
}

function CoverFlowMarquee({ items, direction = "left", speed = 1.5 }: { items: any[], direction?: "left" | "right", speed?: number }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [containerW, setContainerW] = useState(1000)

    useEffect(() => {
        const updateW = () => {
            if (containerRef.current) setContainerW(containerRef.current.offsetWidth)
        }
        updateW()
        window.addEventListener('resize', updateW)
        return () => window.removeEventListener('resize', updateW)
    }, [])

    const ITEM_W = containerW < 640 ? 90 : 130; // Jarak antar ikon responsif
    let displayItems = [...items]

    // Jangan gandakan items agar jika data hanya 1, maka yang tampil dan berputar benar-benar hanya 1.
    const contentW = displayItems.length * ITEM_W;
    
    // Pastikan area scroll (TOTAL_W) minimal selebar layar agar item bisa menyeberang dan tidak melompat-lompat di satu titik
    const TOTAL_W = Math.max(contentW, containerW + ITEM_W * 4);

    const baseX = useMotionValue(0)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    useAnimationFrame((_t, delta) => {
        const moveBy = (delta / 16) * speed
        let nextX = baseX.get() + (direction === "left" ? -moveBy : moveBy)

        if (direction === "left" && nextX <= -TOTAL_W) nextX += TOTAL_W
        if (direction === "right" && nextX > 0) nextX -= TOTAL_W

        baseX.set(nextX)
    })

    return (
        <div ref={containerRef} className="relative w-full h-[90px] sm:h-[120px] flex items-center justify-center">
            {displayItems.map((tool, i) => (
                <CoverFlowItem key={i} index={i} tool={tool} baseX={baseX} itemW={ITEM_W} totalW={TOTAL_W} containerW={containerW} />
            ))}
        </div>
    )
}

function CoverFlowItem({ index, tool, baseX, itemW, totalW, containerW }: any) {
    const x = useTransform(baseX, (v: number) => {
        let pos = (index * itemW + v) % totalW
        if (pos < 0) pos += totalW
        return pos
    })

    const OFFSET = 300 // Offset agar elemen wrap di luar layar
    const center = containerW / 2
    // Basis icon width 64px di desktop, 48px di mobile. Kita ambil tengahnya (56) untuk kalkulasi center yang aman
    const itemCenter = center + OFFSET - (56 / 2) 

    const range = [
        itemCenter - itemW * 3.5,
        itemCenter - itemW * 1.5,
        itemCenter,
        itemCenter + itemW * 1.5,
        itemCenter + itemW * 3.5
    ]

    // Saat mendekati tengah, scale membesar. Di pinggir tetap terlihat sangat jelas
    const scale = useTransform(x, range, [0.85, 0.95, 1.4, 0.95, 0.85])
    // Opacity ditingkatkan agar ikon yang tidak di tengah tetap jelas terlihat
    const opacity = useTransform(x, range, [0.6, 0.8, 1, 0.8, 0.6])
    const zIndex = useTransform(x, [itemCenter - itemW, itemCenter, itemCenter + itemW], [0, 30, 0])
    // Mengurangi efek blur agar logo tetap tajam dan bisa dikenali
    const filter = useTransform(x, range, ["blur(1px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(1px)"])

    return (
        <motion.div
            style={{ x, scale, opacity, zIndex, filter, position: 'absolute', left: -OFFSET }}
            className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl shadow-lg hover:border-cyan-500/50 transition-colors duration-300"
            title={tool.label}
        >
            <div
                className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-[var(--text-h)] hover:text-cyan-400 [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full transition-colors duration-300"
                dangerouslySetInnerHTML={{ __html: tool.icon }}
            />
        </motion.div>
    )
}
