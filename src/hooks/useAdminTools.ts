import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import ToolsServices from '@/services/toolss.services'

export interface ApiTool {
    _id: string
    label: string
    icon: string        // raw SVG string from API
    value: number
    status: string
    order?: number | null
    createdAt: string
    updatedAt: string
}

export interface DragState {
    type: 'ordered' | 'unordered'
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

export const useAdminTools = () => {
    const [tools, setTools] = useState<ApiTool[]>([])
    const [drag, setDrag] = useState<DragState | null>(null)
    const [overIndex, setOverIndex] = useState<number | null>(null)
    const [overDropZone, setOverDropZone] = useState(false)
    const cardRefs = useRef<(HTMLDivElement | null)[]>([])
    const dropZoneRef = useRef<HTMLDivElement | null>(null)

    const fetchTools = useCallback(() => {
        ToolsServices.getAllTools()
            .then(res => setTools(res.data ?? res))
            .catch(console.error)
    }, [])

    useEffect(() => {
        fetchTools()
    }, [fetchTools])

    const orderedTools = useMemo(() => tools.filter(t => t.order !== null && t.order !== undefined).sort((a, b) => a.order! - b.order!), [tools])
    const unorderedTools = useMemo(() => tools.filter(t => t.order === null || t.order === undefined), [tools])

    const getUpdatePayload = (t: ApiTool, newOrder: number | null) => {
        const { _id, createdAt, updatedAt, __v, ...rest } = t as any;
        return { ...rest, order: newOrder };
    };

    const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>, type: 'ordered' | 'unordered', index: number) => {
        if (e.button !== 0) return
        const el = e.currentTarget
        const rect = el.getBoundingClientRect()
        el.setPointerCapture(e.pointerId)
        setDrag({
            type, index,
            x: e.clientX, y: e.clientY,
            startX: e.clientX, startY: e.clientY,
            w: rect.width, h: rect.height,
            offX: e.clientX - rect.left,
            offY: e.clientY - rect.top,
        })
        setOverIndex(type === 'ordered' ? index : null)
        setOverDropZone(false)
    }, [])

    const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!drag) return
        setDrag(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null)

        if (dropZoneRef.current) {
            const r = dropZoneRef.current.getBoundingClientRect()
            if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
                setOverDropZone(true)
                setOverIndex(null)
                return
            }
        }
        setOverDropZone(false)

        let found = false
        for (let i = 0; i < orderedTools.length; i++) {
            const el = cardRefs.current[i]
            if (!el) continue
            const r = el.getBoundingClientRect()
            if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
                setOverIndex(i)
                found = true
                break
            }
        }
        if (!found) setOverIndex(null)
    }, [drag, orderedTools.length])

    const handlePointerUp = useCallback(async (e: React.PointerEvent<HTMLDivElement>) => {
        if (!drag) return
        const moved = Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > 6

        if (moved) {
            if (drag.type === 'unordered' && overDropZone) {
                const tool = unorderedTools[drag.index];
                const nextOrder = orderedTools.length > 0
                    ? Math.max(...orderedTools.map(t => t.order!)) + 1
                    : 1;

                // Optimistic UI
                setTools(prev => prev.map(t => t._id === tool._id ? { ...t, order: nextOrder } : t));

                try {
                    await ToolsServices.updateOrder(tool._id, getUpdatePayload(tool, nextOrder));
                    fetchTools();
                } catch (err: any) {
                    alert("Gagal menambahkan ke urutan: " + (err.response?.data?.message || err.message));
                    fetchTools(); // revert on fail
                }
            } else if (drag.type === 'unordered' && overIndex !== null) {
                // SWAP: Unordered takes Ordered's place, Ordered goes back to Unordered
                const sourceTool = unorderedTools[drag.index];
                const targetTool = orderedTools[overIndex];
                const targetOrder = targetTool.order!;

                // Optimistic UI Swap
                setTools(prev => prev.map(t => {
                    if (t._id === sourceTool._id) return { ...t, order: targetOrder };
                    if (t._id === targetTool._id) return { ...t, order: null };
                    return t;
                }));

                try {
                    // Update target to null first to free up the unique order
                    await ToolsServices.updateOrder(targetTool._id, getUpdatePayload(targetTool, null));
                    await ToolsServices.updateOrder(sourceTool._id, getUpdatePayload(sourceTool, targetOrder));
                    fetchTools();
                } catch (err: any) {
                    alert("Gagal menukar dengan urutan baru: " + (err.response?.data?.message || err.message));
                    fetchTools();
                }

            } else if (drag.type === 'ordered' && overIndex !== null && overIndex !== drag.index) {
                // SWAP: Ordered Tool swaps order with another Ordered Tool
                const sourceTool = orderedTools[drag.index];
                const targetTool = orderedTools[overIndex];
                const sourceOrder = sourceTool.order!;
                const targetOrder = targetTool.order!;

                // Optimistic UI Swap
                setTools(prev => prev.map(t => {
                    if (t._id === sourceTool._id) return { ...t, order: targetOrder };
                    if (t._id === targetTool._id) return { ...t, order: sourceOrder };
                    return t;
                }));

                try {
                    // Temporarily move source out of the way
                    await ToolsServices.updateOrder(sourceTool._id, getUpdatePayload(sourceTool, 99999));
                    // Move target into source's old spot
                    await ToolsServices.updateOrder(targetTool._id, getUpdatePayload(targetTool, sourceOrder));
                    // Move source into target's old spot
                    await ToolsServices.updateOrder(sourceTool._id, getUpdatePayload(sourceTool, targetOrder));

                    fetchTools();
                } catch (err: any) {
                    alert("Gagal menukar posisi urutan: " + (err.response?.data?.message || err.message));
                    fetchTools();
                }
            }
        }

        setDrag(null)
        setOverIndex(null)
        setOverDropZone(false)
    }, [drag, overIndex, overDropZone, orderedTools, unorderedTools, fetchTools])

    const handlePointerCancel = useCallback(() => {
        setDrag(null)
        setOverIndex(null)
        setOverDropZone(false)
    }, [])

    const handleRemoveTool = async (e: React.MouseEvent, tool: ApiTool) => {
        e.stopPropagation();

        // Optimistic Remove
        setTools(prev => prev.map(t => t._id === tool._id ? { ...t, order: null } : t));

        try {
            await ToolsServices.updateOrder(tool._id, getUpdatePayload(tool, null));
            fetchTools();
        } catch (err: any) {
            alert("Gagal menghapus dari urutan: " + (err.response?.data?.message || err.message));
            fetchTools();
        }
    }

    const handleDeleteTool = async (tool: ApiTool) => {
        setTools(prev => prev.filter(t => t._id !== tool._id));

        try {
            await ToolsServices.deleteTool(tool._id);
            fetchTools();
        } catch (err: any) {
            alert("Gagal menghapus secara permanen: " + (err.response?.data?.message || err.message));
            fetchTools();
        }
    }

    const handleAddNewTool = (newTool: ApiTool) => {
        setTools(prev => [...prev, newTool]);
    }

    const handleUpdateTool = (updatedTool: ApiTool) => {
        setTools(prev => prev.map(t => t._id === updatedTool._id ? { ...t, ...updatedTool } : t));
    }

    return {
        tools,
        drag,
        overIndex,
        overDropZone,
        cardRefs,
        dropZoneRef,
        orderedTools,
        unorderedTools,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
        handlePointerCancel,
        handleRemoveTool,
        handleDeleteTool,
        handleAddNewTool,
        handleUpdateTool
    }
}
