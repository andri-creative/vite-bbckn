import { useState, useRef, useCallback, useEffect } from 'react'
import ToolsServices from '@/services/toolss.services'

// ── Types ──────────────────────────────────────────────────────────────────
interface ApiTool {
    _id: string
    label: string
    icon: string        // raw SVG string from API
    value: number
    status: string
    order: number | null
    createdAt: string
    updatedAt: string
}

interface DragState {
    index: number
    x: number
    y: number
    startX: number
    startY: number
    w: number
    h: number
    offX: number
    offY: number
}

// ── SVG Icon renderer (icon is raw SVG string) ─────────────────────────────
function SvgIcon({ svg, className }: { svg: string; className?: string }) {
    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    )
}

// ── Sort helper: null order → push to end ──────────────────────────────────
function sortByOrder(items: ApiTool[]) {
    return [...items].sort((a, b) => {
        if (a.order === null && b.order === null) return 0
        if (a.order === null) return 1
        if (b.order === null) return -1
        return a.order - b.order
    })
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function AdminToolsPage() {
    const [tools, setTools] = useState<ApiTool[]>([])
    const [loading, setLoading] = useState(true)
    const [drag, setDrag] = useState<DragState | null>(null)
    const [overIndex, setOverIndex] = useState<number | null>(null)
    const cardRefs = useRef<(HTMLDivElement | null)[]>([])

    // ── Fetch tools ──────────────────────────────────────────────────────
    useEffect(() => {
        ToolsServices.getAllTools()
            .then(res => setTools(sortByOrder(res.data ?? res)))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    // ── Drag handlers ────────────────────────────────────────────────────
    const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>, index: number) => {
        if (e.button !== 0) return
        const el = cardRefs.current[index]
        if (!el) return
        const rect = el.getBoundingClientRect()
        ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
        setDrag({
            index, x: e.clientX, y: e.clientY,
            startX: e.clientX, startY: e.clientY,
            w: rect.width, h: rect.height,
            offX: e.clientX - rect.left,
            offY: e.clientY - rect.top,
        })
        setOverIndex(index)
    }, [])

    const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!drag) return
        setDrag(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null)
        for (let i = 0; i < cardRefs.current.length; i++) {
            const el = cardRefs.current[i]
            if (!el) continue
            const r = el.getBoundingClientRect()
            if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
                setOverIndex(i)
                break
            }
        }
    }, [drag])

    const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!drag) return
        const moved = Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > 6

        if (!moved) {
            // click → navigate (no admin route for tools items, just close drag)
        } else if (overIndex !== null && overIndex !== drag.index) {
            setTools(prev => {
                const next = [...prev]
                
                // Move item (shift instead of swap)
                const [item] = next.splice(drag.index, 1)
                next.splice(overIndex, 0, item)

                // Update orders for all affected items
                const updated = next.map((tool, index) => {
                    const expectedOrder = index + 1
                    if (tool.order !== expectedOrder) {
                        ToolsServices.updateOrder(tool._id, expectedOrder).catch(console.error)
                        return { ...tool, order: expectedOrder }
                    }
                    return tool
                })

                return updated
            })
        }

        setDrag(null)
        setOverIndex(null)
    }, [drag, overIndex])

    const isDragging = drag !== null
    const hasMoved = drag ? Math.hypot(drag.x - drag.startX, drag.y - drag.startY) > 6 : false
    const ghostTool = drag ? tools[drag.index] : null

    // ── Render ──────────────────────────────────────────────────────────
    return (
        <div
            className="p-6 lg:p-8"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{ userSelect: isDragging ? 'none' : undefined }}
        >
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-h)' }}>
                    Tools
                </h1>
                <p className="text-sm" style={{ color: 'var(--text)', opacity: 0.55 }}>
                    Manage your portfolio content. Drag to reorder.
                </p>
            </div>

            {/* Loading skeleton */}
            {loading && (
                <div className="grid gap-3 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="h-[120px] rounded-2xl animate-pulse"
                            style={{ background: 'var(--accent-bg)', border: '1px solid var(--border)' }} />
                    ))}
                </div>
            )}

            {/* Grid */}
            {!loading && (
                <div className="grid gap-3 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
                    {tools.map((tool, i) => {
                        const isSource = drag?.index === i && hasMoved
                        const isTarget = overIndex === i && drag?.index !== i && hasMoved

                        return (
                            <div
                                key={tool._id}
                                ref={el => { cardRefs.current[i] = el }}
                                onPointerDown={e => handlePointerDown(e, i)}
                                className="flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-150"
                                style={{
                                    background: 'var(--accent-bg)',
                                    border: `1.5px ${isTarget ? 'dashed' : 'solid'} ${isTarget ? 'var(--accent)' : 'var(--border)'}`,
                                    opacity: isSource ? 0.2 : 1,
                                    cursor: isDragging ? (hasMoved ? 'grabbing' : 'grab') : 'grab',
                                    transform: isTarget ? 'scale(1.04)' : 'scale(1)',
                                }}
                            >
                                {/* Position number — always index based */}
                                <span
                                    className="self-start text-[11px] font-black leading-none tabular-nums"
                                    style={{ color: 'var(--accent)', opacity: 0.5 }}
                                >
                                    {String(i + 1).padStart(2, '0')}
                                </span>

                                {/* SVG Icon */}
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center p-2"
                                    style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                                    <SvgIcon svg={tool.icon} className="w-full h-full [&_svg]:w-full [&_svg]:h-full" />
                                </div>

                                {/* Label + divider */}
                                <div className="text-center w-full">
                                    <div className="text-[12px] font-semibold leading-tight" style={{ color: 'var(--text-h)' }}>
                                        {tool.label}
                                    </div>
                                    <div className="mt-2 h-px w-full" style={{ background: 'var(--border)' }} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Floating ghost card */}
            {ghostTool && hasMoved && drag && (
                <div
                    className="fixed pointer-events-none z-50 flex flex-col items-center gap-3 p-4 rounded-2xl"
                    style={{
                        left: drag.x - drag.offX,
                        top: drag.y - drag.offY,
                        width: drag.w,
                        background: 'var(--bg)',
                        border: '1.5px solid var(--accent)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        transform: 'rotate(2deg) scale(1.06)',
                    }}
                >
                    <span className="self-start text-[11px] font-black leading-none tabular-nums"
                        style={{ color: 'var(--accent)', opacity: 0.5 }}>
                        {String(drag.index + 1).padStart(2, '0')}
                    </span>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center p-2"
                        style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                        <SvgIcon svg={ghostTool.icon} className="w-full h-full [&_svg]:w-full [&_svg]:h-full" />
                    </div>
                    <div className="text-center w-full">
                        <div className="text-[12px] font-semibold leading-tight" style={{ color: 'var(--text-h)' }}>
                            {ghostTool.label}
                        </div>
                        <div className="mt-2 h-px w-full" style={{ background: 'var(--border)' }} />
                    </div>
                </div>
            )}
        </div>
    )
}