import { Link, useRouterState } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'
import logoLight from '../assets/logo-light.png'
import logoDark from '../assets/logo-dark.png'

const NAV_LINKS = [
    { to: '/', label: 'Home', icon: 'ph:house-duotone' },
    { to: '/about', label: 'About', icon: 'ph:user-duotone' },
    {
        label: 'Work',
        icon: 'ph:folder-open-duotone',
        subLinks: [
            { to: '/work', label: 'Projects', icon: 'ph:squares-four-duotone' },
            { to: '/certificates', label: 'Achievements', icon: 'ph:seal-check-duotone' },
        ]
    },
    { to: '/album', label: 'Gallery', icon: 'ph:images-duotone' },
    { to: '/contact', label: 'Contact', icon: 'ph:envelope-duotone' },
]

// Flat links for mobile bottom nav (excluding dropdown parent, adding sub items instead)
const MOBILE_LINKS = [
    { to: '/', label: 'Home', icon: 'ph:house-duotone' },
    { to: '/about', label: 'About', icon: 'ph:user-duotone' },
    { to: '/work', label: 'Projects', icon: 'ph:squares-four-duotone' },
    { to: '/certificates', label: 'Certs', icon: 'ph:seal-check-duotone' },
    { to: '/album', label: 'Gallery', icon: 'ph:images-duotone' },
    { to: '/contact', label: 'Contact', icon: 'ph:envelope-duotone' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [workOpen, setWorkOpen] = useState(false)
    const workRef = useRef<HTMLLIElement>(null)
    const routerState = useRouterState()
    const currentPath = routerState.location.pathname

    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
            if (saved) return saved
            return 'dark'
        }
        return 'dark'
    })

    // Apply theme class to <html>
    useEffect(() => {
        const root = document.documentElement
        if (theme === 'dark') {
            root.classList.add('dark')
            root.classList.remove('light')
        } else {
            root.classList.add('light')
            root.classList.remove('dark')
        }
        localStorage.setItem('theme', theme)
    }, [theme])

    // Track scroll
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 16)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (workRef.current && !workRef.current.contains(e.target as Node)) {
                setWorkOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    /**
     * View Transitions API split-screen theme wipe
     */
    const handleToggleTheme = () => {
        const oldTheme = theme
        const newTheme = oldTheme === 'dark' ? 'light' : 'dark'
        const root = document.documentElement

        root.classList.add(`vt-from-${oldTheme}`)

        const applyTheme = () => {
            setTheme(newTheme)
            root.classList.remove('dark', 'light')
            root.classList.add(newTheme)
            localStorage.setItem('theme', newTheme)
        }

        if ('startViewTransition' in document) {
            const transition = (document as any).startViewTransition(applyTheme)
            transition.finished.finally(() => {
                root.classList.remove(`vt-from-${oldTheme}`)
            })
        } else {
            applyTheme()
            root.classList.remove(`vt-from-${oldTheme}`)
        }
    }

    const isWorkActive = currentPath === '/work' || currentPath === '/certificates'

    return (
        <>
            {/* ─────────── TOP NAVBAR (Desktop) ─────────── */}
            <nav
                className={`navbar fixed top-0 left-0 right-0 z-[100] w-full transition-all duration-500 ${
                    scrolled ? 'nav-scrolled' : 'nav-top'
                }`}
                style={{
                    background: scrolled
                        ? theme === 'dark'
                            ? 'rgba(3, 8, 12, 0.72)'
                            : 'rgba(248, 250, 252, 0.72)'
                        : 'transparent',
                    backdropFilter: scrolled ? 'blur(20px) saturate(200%)' : 'none',
                    borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
                    boxShadow: scrolled
                        ? theme === 'dark'
                            ? '0 8px 32px rgba(0,0,0,0.4), 0 1px 0 rgba(0,245,255,0.06)'
                            : '0 8px 32px rgba(0,0,0,0.08)'
                        : 'none',
                }}
            >
                <div className="max-w-[1200px] mx-auto px-6 h-[64px] flex items-center justify-between">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 no-underline group" style={{ textDecoration: 'none' }}>
                        <div className="relative">
                            <div
                                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"
                                style={{ background: 'var(--accent)', filter: 'blur(8px)', opacity: 0 }}
                            />
                            <img
                                src={theme === 'dark' ? logoDark : logoLight}
                                alt="Andri Creative"
                                className="h-8 w-auto object-contain relative transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <span
                            className="hidden sm:inline font-extrabold text-[15px] tracking-tight"
                            style={{
                                background: 'linear-gradient(135deg, var(--text-h) 0%, var(--accent) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Andri Creative
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <ul className="hidden md:flex list-none m-0 p-0 items-center gap-1">
                        {NAV_LINKS.map((link) =>
                            link.subLinks ? (
                                <li key={link.label} className="relative" ref={workRef}>
                                    <button
                                        onClick={() => setWorkOpen(v => !v)}
                                        className="nav-pill flex items-center gap-1.5 cursor-pointer border-none bg-transparent"
                                        style={{
                                            color: isWorkActive ? 'var(--accent)' : 'var(--text)',
                                            background: isWorkActive ? 'var(--accent-bg)' : 'transparent',
                                            padding: '6px 16px',
                                            borderRadius: '99px',
                                            fontSize: '13.5px',
                                            fontWeight: isWorkActive ? 600 : 500,
                                            transition: 'all 0.25s ease',
                                        }}
                                    >
                                        {link.label}
                                        <Icon
                                            icon="ph:caret-down-bold"
                                            className="w-3 h-3"
                                            style={{
                                                opacity: 0.6,
                                                transform: workOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.3s ease',
                                            }}
                                        />
                                    </button>

                                    {/* Dropdown */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 'calc(100% + 10px)',
                                            left: '50%',
                                            transform: workOpen
                                                ? 'translateX(-50%) translateY(0) scale(1)'
                                                : 'translateX(-50%) translateY(-8px) scale(0.96)',
                                            opacity: workOpen ? 1 : 0,
                                            pointerEvents: workOpen ? 'auto' : 'none',
                                            width: '200px',
                                            padding: '8px',
                                            borderRadius: '16px',
                                            border: '1px solid var(--border)',
                                            background: theme === 'dark'
                                                ? 'rgba(5, 12, 20, 0.92)'
                                                : 'rgba(255, 255, 255, 0.96)',
                                            backdropFilter: 'blur(24px) saturate(180%)',
                                            boxShadow: theme === 'dark'
                                                ? '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,245,255,0.06), inset 0 1px 0 rgba(255,255,255,0.04)'
                                                : '0 20px 60px rgba(0,0,0,0.12)',
                                            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                                            zIndex: 50,
                                        }}
                                    >
                                        {link.subLinks.map(sub => {
                                            const isActive = currentPath === sub.to
                                            return (
                                                <Link
                                                    key={sub.to}
                                                    to={sub.to}
                                                    onClick={() => setWorkOpen(false)}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '10px',
                                                        padding: '10px 14px',
                                                        borderRadius: '10px',
                                                        fontSize: '13.5px',
                                                        fontWeight: isActive ? 600 : 500,
                                                        color: isActive ? 'var(--accent)' : 'var(--text)',
                                                        background: isActive ? 'var(--accent-bg)' : 'transparent',
                                                        textDecoration: 'none',
                                                        transition: 'all 0.2s ease',
                                                    }}
                                                    className="dropdown-item"
                                                >
                                                    <Icon icon={sub.icon} style={{ width: 16, height: 16, flexShrink: 0 }} />
                                                    {sub.label}
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </li>
                            ) : (
                                <li key={link.to}>
                                    <Link
                                        to={link.to!}
                                        style={{
                                            display: 'inline-block',
                                            padding: '6px 16px',
                                            borderRadius: '99px',
                                            fontSize: '13.5px',
                                            fontWeight: currentPath === link.to ? 600 : 500,
                                            color: currentPath === link.to ? 'var(--accent)' : 'var(--text)',
                                            background: currentPath === link.to ? 'var(--accent-bg)' : 'transparent',
                                            textDecoration: 'none',
                                            transition: 'all 0.25s ease',
                                            letterSpacing: '0.01em',
                                        }}
                                        className="nav-pill"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            )
                        )}
                    </ul>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-3">

                        {/* Separator */}
                        <div className="hidden md:block" style={{ width: 1, height: 20, background: 'var(--border)' }} />

                        {/* Theme Toggle */}
                        <button
                            onClick={handleToggleTheme}
                            aria-label="Toggle Theme"
                            className="theme-btn flex items-center justify-center cursor-pointer"
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: '10px',
                                border: '1px solid var(--border)',
                                background: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                                color: 'var(--text-h)',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            {theme === 'dark' ? (
                                <Icon icon="ph:sun-duotone" style={{ width: 18, height: 18, color: '#fbbf24' }} />
                            ) : (
                                <Icon icon="ph:moon-duotone" style={{ width: 18, height: 18, color: '#6366f1' }} />
                            )}
                        </button>

                    </div>
                </div>
            </nav>

            {/* ─────────── BOTTOM NAV BAR (Mobile only) ─────────── */}
            <nav
                className="md:hidden fixed bottom-0 left-0 right-0 z-[200]"
                style={{
                    background: theme === 'dark'
                        ? 'rgba(3, 8, 12, 0.88)'
                        : 'rgba(248, 250, 252, 0.92)',
                    backdropFilter: 'blur(24px) saturate(200%)',
                    borderTop: '1px solid var(--border)',
                    boxShadow: theme === 'dark'
                        ? '0 -8px 32px rgba(0,0,0,0.5), 0 -1px 0 rgba(0,245,255,0.06)'
                        : '0 -8px 32px rgba(0,0,0,0.06)',
                    paddingBottom: 'env(safe-area-inset-bottom)',
                }}
            >
                <div className="flex items-center justify-around px-2 py-2">
                    {MOBILE_LINKS.map(link => {
                        const isActive = currentPath === link.to
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="bottom-nav-item flex flex-col items-center gap-1 no-underline"
                                style={{
                                    textDecoration: 'none',
                                    flex: 1,
                                    padding: '6px 4px',
                                    borderRadius: '12px',
                                    transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    position: 'relative',
                                }}
                            >
                                {/* Active indicator pill */}
                                {isActive && (
                                    <span
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: 32,
                                            height: 3,
                                            borderRadius: '0 0 4px 4px',
                                            background: 'var(--accent)',
                                            boxShadow: '0 0 8px var(--accent)',
                                        }}
                                    />
                                )}

                                <div
                                    style={{
                                        width: 44,
                                        height: 28,
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: isActive ? 'var(--accent-bg)' : 'transparent',
                                        transition: 'all 0.25s ease',
                                    }}
                                >
                                    <Icon
                                        icon={link.icon}
                                        style={{
                                            width: 22,
                                            height: 22,
                                            color: isActive ? 'var(--accent)' : 'var(--text)',
                                            transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                            transform: isActive ? 'scale(1.15)' : 'scale(1)',
                                        }}
                                    />
                                </div>

                                <span
                                    style={{
                                        fontSize: '10px',
                                        fontWeight: isActive ? 700 : 500,
                                        color: isActive ? 'var(--accent)' : 'var(--text)',
                                        letterSpacing: isActive ? '0.04em' : '0.01em',
                                        transition: 'all 0.25s ease',
                                        lineHeight: 1,
                                    }}
                                >
                                    {link.label}
                                </span>
                            </Link>
                        )
                    })}
                </div>
            </nav>

            {/* ─── Hover style injection ─── */}
            <style>{`
                .nav-pill:hover {
                    color: var(--text-h) !important;
                    background: rgba(127,127,127,0.08) !important;
                }
                .dropdown-item:hover {
                    color: var(--accent) !important;
                    background: var(--accent-bg) !important;
                }
                .theme-btn:hover {
                    border-color: var(--accent-border) !important;
                    background: var(--accent-bg) !important;
                }
                .bottom-nav-item:active {
                    transform: scale(0.93);
                }
            `}</style>
        </>
    )
}
