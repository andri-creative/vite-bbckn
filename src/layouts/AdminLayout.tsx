import { Outlet, useLocation } from '@tanstack/react-router'
import { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminNavbar from './AdminNavbar'

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
                {/* Admin Top Navbar */}
                <AdminNavbar onMobileOpen={() => setMobileOpen(true)} />

                {/* Page content */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
