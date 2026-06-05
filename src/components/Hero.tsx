import { Icon } from '@iconify/react'
import GridBeams from './GridBeams'
import { motion, useScroll, useTransform } from 'motion/react'

interface HeroProps {
    onScrollDown: () => void
}

export default function Hero({ onScrollDown }: HeroProps) {
    const { scrollY } = useScroll();

    // Parallax scroll effects
    const badgeY = useTransform(scrollY, [0, 400], [0, -80]);
    const badgeOpacity = useTransform(scrollY, [0, 300], [1, 0]);

    const titleY = useTransform(scrollY, [0, 400], [0, -120]);
    const titleOpacity = useTransform(scrollY, [0, 300], [1, 0]);

    const subtitleY = useTransform(scrollY, [0, 400], [0, -160]);
    const subtitleOpacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <div
            className="grid-bg relative w-full overflow-hidden flex items-center justify-center"
            style={{ height: 'calc(100vh - 60px)', minHeight: 'calc(100vh - 60px)' }}
        >
            <GridBeams />

            <div className="grid-content relative z-10 max-w-3xl px-6 text-center select-none flex flex-col items-center">
                {/* Waving Badge Container */}
                <motion.div 
                    className="relative mb-8 select-none pointer-events-none"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ y: badgeY, opacity: badgeOpacity }}
                >
                    {/* Authentic Waving/Shine Ray SVG - placed outside & behind the badge with z-0! */}
                    <div className="absolute -top-8 -right-1 w-[20px] h-[48px] animate-pulse pointer-events-none select-none rotate-[15deg] z-0">
                        <svg width="100%" height="100%" viewBox="0 0 18.2 46.493" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="svgGradientCyan" x1="0.5" x2="0.5" y1="1.03" y2="-0.23">
                                    <stop offset="0" stopColor="#00f5ff" />
                                    <stop offset="1" stopColor="#0284c7" />
                                </linearGradient>
                                <linearGradient id="svgGradientGreen" x1="0.5" x2="0.5" y1="1.03" y2="-0.23">
                                    <stop offset="0" stopColor="#10b981" />
                                    <stop offset="1" stopColor="#059669" />
                                </linearGradient>
                                <linearGradient id="svgGradientBlue" x1="0.5" x2="0.5" y1="0.82" y2="-0.22">
                                    <stop offset="0" stopColor="#3b82f6" />
                                    <stop offset="1" stopColor="#1d4ed8" />
                                </linearGradient>
                            </defs>
                            <g transform="matrix(0.656253 0 0 -0.74677 -3.74315 53.6016)">
                                <g transform="matrix(0.777205 0 0 1.58735 2.44419 18.5149)">
                                    <path
                                        d="m25.68,-2.75c-1.07,-0.31 -3.09,-0.38 -6.08,-0.19c0.36,1.78 0.09,3.65 -0.81,5.59c-1.79,3.89 -5.79,6.27 -11.99,7.13l2.68,-0.35c2.15,-0.35 4.18,-0.89 6.08,-1.6c5.97,-2.25 9.33,-5.78 10.11,-10.58z"
                                        fill="url(#svgGradientCyan)" fillRule="evenodd" />
                                    <path
                                        d="m37.49,-2.55c-0.6,-0.15 -1.41,-0.27 -2.42,-0.38c-2.04,-0.19 -3.96,-0.15 -5.81,0.09c0.36,4.04 0.09,8.3 -0.81,12.75c-1.79,8.88 -5.81,14.29 -12.08,16.23c3.22,-0.39 6.51,-1.89 9.84,-4.48c6.73,-5.2 10.49,-13.26 11.27,-24.21z"
                                        fill="url(#svgGradientGreen)" fillRule="evenodd" />
                                    <path
                                        d="m33.46,-2.59c-0.25,-0.1 -0.69,-0.19 -1.34,-0.25c-1.32,-0.12 -2.88,-0.11 -4.74,0.03c-0.36,2.41 -1.54,5.04 -3.58,7.88c-4.07,5.65 -10.35,9.52 -18.87,11.59c4.29,-0.61 8.7,-1.86 13.24,-3.74c9.06,-3.81 14.16,-8.99 15.3,-15.52z"
                                        fill="url(#svgGradientBlue)" fillRule="evenodd" />
                                </g>
                            </g>
                        </svg>
                    </div>

                    {/* Waving Badge Capsule */}
                    <div className="relative z-10 inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--bg)]/40 backdrop-blur-md shadow-sm transition-all duration-300 hover:border-[var(--accent)] hover:bg-[var(--bg)]/60 pointer-events-auto">
                        <span className="text-xs font-bold tracking-wide text-[var(--text-h)]">Hello there!</span>
                        <motion.span 
                            className="text-sm inline-block origin-bottom-right"
                            animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                        >
                            👋
                        </motion.span>
                    </div>
                </motion.div>

                {/* Main Heading: I'm Andri, */}
                <motion.h1 
                    className="text-6xl sm:text-7xl font-extrabold tracking-tight text-[var(--text-h)] mb-4 sm:mb-6 leading-none"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    style={{ y: titleY, opacity: titleOpacity }}
                >
                    I'm <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(6,182,212,0.25)] font-black">Andri,</span>
                </motion.h1>

                {/* Subtitle Outlined Text (Middle is Transparent) with Sparkle */}
                <motion.div 
                    className="mt-4 sm:mt-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    style={{ y: subtitleY, opacity: subtitleOpacity }}
                >
                    <h2
                        className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight uppercase select-none pointer-events-none flex flex-col gap-2 sm:block sm:whitespace-nowrap"
                        style={{
                            color: 'transparent',
                            WebkitTextStroke: '1.5px var(--text-h)',
                            letterSpacing: '0.02em',
                        }}
                    >
                        <span>Fullstack </span>
                        <span className="relative inline-block">
                            Developer
                            {/* Glowing Star/Sparkle in neon green */}
                            <span className="absolute -top-2 -right-6 sm:-top-2 sm:-right-7 text-emerald-400 animate-pulse select-none pointer-events-none">
                                <Icon icon="ph:sparkle-fill" className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-[0_0_8px_#10b981]" />
                            </span>
                        </span>
                    </h2>
                </motion.div>
            </div>

            {/* Bouncing Scroll Down Button */}
            <motion.button
                onClick={onScrollDown}
                className="absolute bottom-6 left-1/2 flex flex-col items-center gap-1 cursor-pointer text-[var(--text)] hover:text-[var(--accent)] transition-all duration-300 z-20 pointer-events-auto bg-transparent border-none"
                aria-label="Scroll Down"
                initial={{ opacity: 0, x: "-50%" }}
                animate={{ opacity: 1, x: "-50%" }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{ opacity: badgeOpacity }}
            >
                <span className="text-[10px] tracking-widest uppercase font-bold select-none">Scroll</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <Icon icon="ph:arrow-down-light" className="w-5 h-5" />
                </motion.div>
            </motion.button>
        </div>
    )
}
