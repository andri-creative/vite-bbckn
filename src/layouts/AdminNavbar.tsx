import { useState, useEffect } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Icon } from '@iconify/react';

const NAV_ITEMS = [
    { label: 'Dashboard', to: '/admin/dashboard' },
    { label: 'Bio', to: '/admin/bio' },
    { label: 'Gallery', to: '/admin/galely' },
    { label: 'Tools', to: '/admin/tools' },
    { label: 'Projects', to: '/admin/project' },
    { label: 'Experience', to: '/admin/experience' },
    { label: 'Settings', to: '/admin/settings' },
];

interface AdminNavbarProps {
    onMobileOpen: () => void;
}

export default function AdminNavbar({ onMobileOpen }: AdminNavbarProps) {
    const location = useLocation();
    const currentPath = location.pathname;

    // Resolve current page label dynamically
    const currentItem = NAV_ITEMS.find(item => currentPath === item.to || currentPath.startsWith(item.to + '/'));
    const pageLabel = currentItem ? currentItem.label : 'Admin';

    // Theme logic
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
            if (saved) return saved;
            return 'dark';
        }
        return 'dark';
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
        } else {
            root.classList.add('light');
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleToggleTheme = () => {
        const oldTheme = theme;
        const newTheme = oldTheme === 'dark' ? 'light' : 'dark';
        const root = document.documentElement;

        root.classList.add(`vt-from-${oldTheme}`);

        const applyTheme = () => {
            setTheme(newTheme);
            root.classList.remove('dark', 'light');
            root.classList.add(newTheme);
            localStorage.setItem('theme', newTheme);
        };

        if ('startViewTransition' in document) {
            const transition = (document as any).startViewTransition(applyTheme);
            transition.finished.finally(() => {
                root.classList.remove(`vt-from-${oldTheme}`);
            });
        } else {
            applyTheme();
            root.classList.remove(`vt-from-${oldTheme}`);
        }
    };

    return (
        <header
            className="flex items-center justify-between h-[60px] px-4 sm:px-6 shrink-0 z-30"
            style={{ 
                borderBottom: '1px solid var(--border)', 
                background: 'var(--bg)',
                backdropFilter: 'blur(20px)',
            }}
        >
            {/* Left Side: Mobile Menu Button & Breadcrumb */}
            <div className="flex items-center gap-3">
                {/* Mobile Menu Toggle */}
                <button
                    onClick={onMobileOpen}
                    className="lg:hidden flex w-8 h-8 rounded-lg items-center justify-center transition-all duration-200 cursor-pointer"
                    style={{ background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}
                >
                    <Icon icon="ph:list-bold" className="w-4 h-4" />
                </button>

                {/* Breadcrumbs */}
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold select-none">
                    <span style={{ color: 'var(--text)', opacity: 0.5 }}>Admin</span>
                    <span style={{ color: 'var(--text)', opacity: 0.35 }}>/</span>
                    <span style={{ color: 'var(--accent)' }}>{pageLabel}</span>
                </div>
            </div>

            {/* Right Side: View Site Link & Theme Toggle */}
            <div className="flex items-center gap-3">
                {/* View Website Link */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:bg-black/5 dark:hover:bg-white/5 no-underline"
                    style={{ color: 'var(--text-h)', borderColor: 'var(--border)' }}
                >
                    <Icon icon="ph:arrow-square-out-bold" className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">View Website</span>
                </Link>

                {/* Theme Switcher */}
                <button
                    onClick={handleToggleTheme}
                    aria-label="Toggle Theme"
                    className="flex items-center justify-center cursor-pointer"
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        background: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                        color: 'var(--text-h)',
                        transition: 'all 0.3s ease',
                    }}
                >
                    {theme === 'dark' ? (
                        <Icon icon="ph:sun-duotone" className="w-4.5 h-4.5" style={{ color: '#fbbf24' }} />
                    ) : (
                        <Icon icon="ph:moon-duotone" className="w-4.5 h-4.5" style={{ color: '#6366f1' }} />
                    )}
                </button>
            </div>
        </header>
    );
}
