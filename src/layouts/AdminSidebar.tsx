import { Link, useRouterState } from '@tanstack/react-router'
import { Icon } from '@iconify/react'

const NAV_ITEMS = [
    { label: 'Dashboard', icon: 'ph:squares-four-duotone', to: '/admin/dashboard' },
    { label: 'Tools', icon: 'ph:wrench-duotone', to: '/admin/tools' },
    { label: 'Projects', icon: 'ph:folder-open-duotone', to: '/admin/projects' },
    { label: 'Experience', icon: 'ph:briefcase-duotone', to: '/admin/experience' },
    { label: 'Settings', icon: 'ph:gear-six-duotone', to: '/admin/settings' },
]

interface AdminSidebarProps {
    collapsed: boolean
    onToggle: () => void
    mobileOpen: boolean
    onMobileClose: () => void
}

export default function AdminSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: AdminSidebarProps) {
    const routerState = useRouterState()
    const currentPath = routerState.location.pathname

    return (
        <>
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={onMobileClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 h-full z-50 flex flex-col
                    transition-all duration-300 ease-in-out
                    lg:relative lg:translate-x-0
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    ${collapsed ? 'w-[68px]' : 'w-[240px]'}
                `}
                style={{
                    background: 'var(--bg)',
                    borderRight: '1px solid var(--border)',
                }}
            >
                {/* Header */}
                <div className={`flex items-center h-[60px] px-3 shrink-0 ${collapsed ? 'justify-center' : 'justify-between'}`}
                    style={{ borderBottom: '1px solid var(--border)' }}>
                    {!collapsed && (
                        <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                style={{ background: 'var(--accent)' }}>
                                <Icon icon="ph:code-bold" className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-[13px] font-bold tracking-wide whitespace-nowrap"
                                style={{ color: 'var(--text-h)' }}>
                                Admin Panel
                            </span>
                        </div>
                    )}

                    {/* Collapse toggle (desktop) */}
                    <button
                        onClick={onToggle}
                        className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center transition-all duration-200 shrink-0 hover:opacity-80"
                        style={{ background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}
                    >
                        <Icon
                            icon={collapsed ? 'ph:caret-right-bold' : 'ph:caret-left-bold'}
                            className="w-3.5 h-3.5"
                        />
                    </button>

                    {/* Mobile close */}
                    <button
                        onClick={onMobileClose}
                        className="lg:hidden flex w-7 h-7 rounded-lg items-center justify-center"
                        style={{ color: 'var(--text)' }}
                    >
                        <Icon icon="ph:x-bold" className="w-4 h-4" />
                    </button>
                </div>

                {/* Nav items */}
                <nav className="flex-1 py-3 flex flex-col gap-1 px-2 overflow-y-auto">
                    {NAV_ITEMS.map(item => {
                        const isActive = currentPath === item.to || currentPath.startsWith(item.to + '/')
                        return (
                            <Link
                                key={item.to}
                                to={item.to as any}
                                onClick={onMobileClose}
                                className={`
                                    flex items-center gap-3 rounded-[10px] transition-all duration-200
                                    ${collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5'}
                                `}
                                style={{
                                    background: isActive ? 'var(--accent-bg)' : 'transparent',
                                    color: isActive ? 'var(--accent)' : 'var(--text)',
                                    border: isActive ? '1px solid var(--accent-border)' : '1px solid transparent',
                                    fontWeight: isActive ? 600 : 400,
                                    opacity: isActive ? 1 : 0.7,
                                }}
                                title={collapsed ? item.label : undefined}
                            >
                                <Icon icon={item.icon} className="w-[18px] h-[18px] shrink-0" />
                                {!collapsed && (
                                    <span className="text-[13.5px] whitespace-nowrap">{item.label}</span>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className={`p-2 shrink-0 ${collapsed ? '' : ''}`}
                    style={{ borderTop: '1px solid var(--border)' }}>
                    <Link
                        to="/admin/sign-in"
                        className={`flex items-center gap-3 rounded-[10px] px-3 py-2.5 transition-all duration-200 ${collapsed ? 'justify-center px-0' : ''}`}
                        style={{ color: 'var(--text)', opacity: 0.6 }}
                        title={collapsed ? 'Sign Out' : undefined}
                    >
                        <Icon icon="ph:sign-out-duotone" className="w-[18px] h-[18px] shrink-0" />
                        {!collapsed && <span className="text-[13.5px]">Sign Out</span>}
                    </Link>
                </div>
            </aside>
        </>
    )
}
