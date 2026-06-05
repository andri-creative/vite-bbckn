import { Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import logoLight from '../assets/logo-light.png'
import logoDark from '../assets/logo-dark.png'

const NAV_LINKS = [
    { to: '/', label: 'Home', icon: 'ph:house-bold' },
    { to: '/about', label: 'About', icon: 'ph:user-bold' },
    { 
        label: 'Work', 
        icon: 'ph:folder-open-bold',
        subLinks: [
            { to: '/work', label: 'Projects', icon: 'ph:squares-four-bold' },
            { to: '/certificates', label: 'Achievements', icon: 'ph:seal-check-bold' },
        ]
    },
    { to: '/album', label: 'Gallery', icon: 'ph:images-bold' },
    { to: '/contact', label: 'Contact', icon: 'ph:envelope-bold' },
]

export default function Navbar() {
    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
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

    // Lock body scroll when sidebar is open
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [open])

    // Track scroll position to toggle navbar appearance
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    /**
     * View Transitions API split-screen theme wipe:
     * 1. Add class to mark the direction (vt-from-dark or vt-from-light)
     * 2. Browser captures screenshot of current page (old)
     * 3. Inside startViewTransition callback, apply new theme
     * 4. Browser captures screenshot of new page (new)
     * 5. CSS animates old (one half) and new (other half) simultaneously — REAL UI on both sides!
     * 6. Fallback: just apply theme directly if API not supported
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

    return (
        <>

            <nav
                className={`navbar sticky top-0 z-[100] w-full transition-all duration-400 ${
                    scrolled
                        ? 'border-b border-[var(--border)] shadow-lg shadow-black/10'
                        : 'border-b border-transparent'
                }`}
                style={{
                    background: scrolled
                        ? (theme === 'dark' ? 'rgba(3, 8, 12, 0.75)' : 'rgba(255, 255, 255, 0.75)')
                        : 'transparent',
                    backdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'none',
                }}
            >
                <div className="navbar-inner max-w-[1200px] mx-auto px-6 h-[60px] flex items-center justify-between">

                    <Link
                        to="/"
                        className="flex items-center gap-3 text-lg font-bold tracking-tight text-[var(--text-h)] no-underline transition-all duration-300 hover:text-[var(--accent)]"
                    >
                        <img
                            src={theme === 'dark' ? logoDark : logoLight}
                            alt="Andri Creative Logo"
                            className="h-8 w-auto object-contain transition-all duration-300 transform hover:scale-105"
                        />
                        <span className="hidden sm:inline bg-gradient-to-r from-[var(--text-h)] to-[var(--accent)] bg-clip-text text-transparent font-extrabold">
                            Andri Creative
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">


                        <ul className="hidden md:flex list-none m-0 p-0 gap-1">
                            {NAV_LINKS.map((link) => (
                                link.subLinks ? (
                                    <li key={link.label} className="relative group">
                                        <button className="navbar-link flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[var(--text)] no-underline text-sm transition-all hover:text-[var(--text-h)] hover:bg-white/5 border-none bg-transparent cursor-pointer">
                                            {link.label}
                                            <Icon icon="ph:caret-down-bold" className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform duration-300" />
                                        </button>
                                        
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform translate-y-2 group-hover:translate-y-0 backdrop-blur-xl">
                                            {link.subLinks.map(sub => (
                                                <Link
                                                    key={sub.to}
                                                    to={sub.to}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text)] hover:text-[var(--accent)] hover:bg-[var(--accent-bg)] transition-colors no-underline mx-2 rounded-lg"
                                                    activeProps={{ className: 'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors no-underline mx-2 rounded-lg text-[var(--accent)] bg-[var(--accent-bg)] font-medium' }}
                                                >
                                                    <Icon icon={sub.icon} className="w-4 h-4 shrink-0" />
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </li>
                                ) : (
                                    <li key={link.to}>
                                        <Link
                                            to={link.to!}
                                            className="navbar-link px-4 py-1.5 rounded-lg text-[var(--text)] no-underline text-sm transition-all hover:text-[var(--text-h)] hover:bg-white/5"
                                            activeProps={{ className: 'navbar-link active px-4 py-1.5 rounded-lg no-underline text-sm text-[var(--accent)] bg-[var(--accent-bg)]' }}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                )
                            ))}
                        </ul>

                        {/* Divider */}
                        <div className="hidden md:block w-[1px] h-5 bg-[var(--border)]" />

                        {/* Theme Toggle Button */}
                        <button
                            onClick={handleToggleTheme}
                            className="theme-toggle flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--border)] text-[var(--text-h)] cursor-pointer bg-white/5 hover:bg-white/10 hover:text-[var(--accent)] hover:border-[var(--accent-border)] transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? (
                                <Icon icon="gg:sun" className="w-[20px] h-[20px] text-amber-400 transition-transform duration-500 hover:rotate-45" />
                            ) : (
                                <Icon icon="gg:moon" className="w-[20px] h-[20px] text-indigo-500 transition-transform duration-500 hover:-rotate-12" />
                            )}
                        </button>

                        {/* Hamburger (mobile only) */}
                        <button
                            className="md:hidden flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1"
                            onClick={() => setOpen(true)}
                            aria-label="Open menu"
                        >
                            <span className="block w-[22px] h-[2px] bg-[var(--text-h)] rounded-sm" />
                            <span className="block w-[22px] h-[2px] bg-[var(--text-h)] rounded-sm" />
                            <span className="block w-[22px] h-[2px] bg-[var(--text-h)] rounded-sm" />
                        </button>

                    </div>
                </div>
            </nav>

            {/* ── Sidebar Overlay ── */}
            <div
                className={`fixed inset-0 z-[200] md:hidden transition-all duration-300 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
            >
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setOpen(false)}
                />

                {/* Drawer Panel */}
                <div
                    className={`absolute top-0 right-0 h-full w-[280px] flex flex-col transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
                    style={{
                        background: theme === 'dark'
                            ? 'rgba(5, 10, 16, 0.95)'
                            : 'rgba(255, 255, 255, 0.97)',
                        backdropFilter: 'blur(24px)',
                        borderLeft: '1px solid var(--border)',
                    }}
                >
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between px-5 h-[60px] border-b border-[var(--border)] shrink-0">
                        <span className="text-sm font-semibold text-[var(--text)] opacity-60 uppercase tracking-widest">
                            Menu
                        </span>
                        <button
                            onClick={() => setOpen(false)}
                            aria-label="Close menu"
                            className="w-8 h-8 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--text-h)] hover:text-[var(--accent)] hover:border-[var(--accent)] bg-white/5 transition-all duration-200"
                        >
                            <Icon icon="ph:x-bold" className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto">
                        {NAV_LINKS.map((link) => (
                            link.subLinks ? (
                                <div key={link.label} className="flex flex-col gap-1 mb-1">
                                    <div className="flex items-center gap-3 px-4 py-2 text-[var(--text)] text-sm font-bold opacity-50 uppercase tracking-widest mt-2">
                                        <Icon icon={link.icon} className="w-4 h-4 shrink-0" />
                                        {link.label}
                                    </div>
                                    <div className="flex flex-col gap-1 pl-3">
                                        {link.subLinks.map(sub => (
                                            <Link
                                                key={sub.to}
                                                to={sub.to}
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text)] no-underline text-sm font-medium transition-all duration-200 hover:text-[var(--text-h)] hover:bg-white/5"
                                                activeProps={{
                                                    className: 'flex items-center gap-3 px-4 py-3 rounded-xl no-underline text-sm font-semibold text-[var(--accent)] bg-[var(--accent-bg)] border border-[var(--accent)]/20',
                                                }}
                                                onClick={() => setOpen(false)}
                                            >
                                                <Icon icon={sub.icon} className="w-4 h-4 shrink-0" />
                                                {sub.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    key={link.to}
                                    to={link.to!}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text)] no-underline text-sm font-medium transition-all duration-200 hover:text-[var(--text-h)] hover:bg-white/5"
                                    activeProps={{
                                        className: 'flex items-center gap-3 px-4 py-3 rounded-xl no-underline text-sm font-semibold text-[var(--accent)] bg-[var(--accent-bg)] border border-[var(--accent)]/20',
                                    }}
                                    onClick={() => setOpen(false)}
                                >
                                    <Icon icon={link.icon} className="w-4 h-4 shrink-0" />
                                    {link.label}
                                </Link>
                            )
                        ))}
                    </nav>

                    {/* Drawer Footer — Theme Toggle */}
                    <div className="p-4 border-t border-[var(--border)] shrink-0">
                        <button
                            onClick={handleToggleTheme}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--text)] hover:text-[var(--accent)] hover:border-[var(--accent)] bg-white/5 hover:bg-white/10 transition-all duration-200 disabled:opacity-50"
                        >
                            {theme === 'dark' ? (
                                <>
                                    <Icon icon="gg:sun" className="w-4 h-4 text-amber-400 shrink-0" />
                                    <span>Switch to Light Mode</span>
                                </>
                            ) : (
                                <>
                                    <Icon icon="gg:moon" className="w-4 h-4 text-indigo-500 shrink-0" />
                                    <span>Switch to Dark Mode</span>
                                </>
                            )}
                        </button>
                        <p className="text-center text-[10px] text-[var(--text)] opacity-30 mt-3 select-none">
                            © 2025 Andri Creative
                        </p>
                    </div>

                </div>
            </div>
        </>
    )
}
