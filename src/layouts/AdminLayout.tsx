import { Outlet, useLocation } from '@tanstack/react-router'
import { Icon } from '@iconify/react'
import { useState } from 'react'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout() {
    const location = useLocation()
    const isSignIn = location.pathname === '/admin/sign-in'
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    // Sign-in page: full screen, no sidebar
    if (isSignIn) {
        return (
            <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
                <Outlet />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen" style={{ background: 'var(--bg)' }}>
            {/* Sidebar */}
            <AdminSidebar
                collapsed={collapsed}
                onToggle={() => setCollapsed(prev => !prev)}
                mobileOpen={mobileOpen}
                onMobileClose={() => setMobileOpen(false)}
            />

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile topbar */}
                <header
                    className="lg:hidden flex items-center h-[60px] px-4 gap-3 shrink-0"
                    style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}
                >
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="flex w-8 h-8 rounded-lg items-center justify-center transition-all duration-200"
                        style={{ background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}
                    >
                        <Icon icon="ph:list-bold" className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center"
                            style={{ background: 'var(--accent)' }}>
                            <Icon icon="ph:code-bold" className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-[13px] font-bold" style={{ color: 'var(--text-h)' }}>
                            Admin Panel
                        </span>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
