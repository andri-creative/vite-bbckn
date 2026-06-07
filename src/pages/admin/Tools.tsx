import { useState } from 'react';
import { useAdminTools } from '@/hooks/useAdminTools'
import ToolsServices from '@/services/toolss.services';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

// ── SVG Icon renderer (icon is raw SVG string) ─────────────────────────────
function SvgIcon({ svg, className }: { svg: string; className?: string }) {
    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    )
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function AdminToolsPage() {
    const {
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
    } = useAdminTools();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingToolId, setEditingToolId] = useState<string | null>(null);
    const [newLabel, setNewLabel] = useState('');
    const [newIcon, setNewIcon] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const openCreateForm = () => {
        setEditingToolId(null);
        setNewLabel('');
        setNewIcon('');
        setIsFormOpen(true);
    };

    const openEditForm = (tool: any) => {
        setEditingToolId(tool._id);
        setNewLabel(tool.label);
        setNewIcon(tool.icon);
        setIsFormOpen(true);
    };

    // Delete state
    const [toolToDelete, setToolToDelete] = useState<any | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingToolId(null);
        setNewLabel('');
        setNewIcon('');
    };

    const handleSubmitTool = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLabel || !newIcon) return;
        setIsSubmitting(true);
        try {
            if (editingToolId) {
                const res = await ToolsServices.updateTool(editingToolId, { label: newLabel, icon: newIcon });
                const responseData = res?.data ?? res ?? {};
                handleUpdateTool({ 
                    _id: editingToolId, 
                    label: newLabel, 
                    icon: newIcon, 
                    ...responseData 
                });
            } else {
                const res = await ToolsServices.createTool({ label: newLabel, icon: newIcon });
                handleAddNewTool(res.data ?? res);
            }
            closeForm();
        } catch (error) {
            console.error("Failed to save tool", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isDragging = drag !== null
    const hasMoved = drag ? Math.hypot(drag.x - drag.startX, drag.y - drag.startY) > 6 : false
    const ghostTool = drag ? (drag.type === 'ordered' ? orderedTools[drag.index] : unorderedTools[drag.index]) : null

    cardRefs.current = cardRefs.current.slice(0, orderedTools.length);

    // ── Render ──────────────────────────────────────────────────────────
    return (
        <div
            className="p-6 lg:p-8"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{ userSelect: isDragging ? 'none' : undefined }}
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-h)' }}>
                        Tools
                    </h1>
                    <p className="text-sm" style={{ color: 'var(--text)', opacity: 0.55 }}>
                        Manage your portfolio content.
                    </p>
                </div>
                {!isFormOpen && (
                    <button
                        onClick={openCreateForm}
                        className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150"
                        style={{
                            background: 'var(--accent)',
                            color: 'var(--bg)',
                            border: '1px solid var(--accent)'
                        }}
                    >
                        Add New Tool
                    </button>
                )}
            </div>

            {/* Form Container (Create / Edit) */}
            {isFormOpen && (
                <div className="mb-8 p-5 rounded-2xl" style={{ background: 'var(--accent-bg)', border: '1px solid var(--border)' }}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold" style={{ color: 'var(--text-h)' }}>
                            {editingToolId ? 'Edit Tool' : 'Create New Tool'}
                        </h2>
                        <button onClick={closeForm} className="text-sm px-3 py-1 rounded-lg transition-colors hover:opacity-70" style={{ color: 'var(--text)' }}>
                            Cancel
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmitTool} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Label</label>
                            <input
                                type="text"
                                value={newLabel}
                                onChange={e => setNewLabel(e.target.value)}
                                placeholder="e.g. Next.js"
                                className="w-full px-4 py-2 rounded-xl text-sm transition-all focus:outline-none focus:ring-2"
                                style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>SVG Icon</label>
                            <textarea
                                value={newIcon}
                                onChange={e => setNewIcon(e.target.value)}
                                placeholder="<svg>...</svg>"
                                rows={4}
                                className="w-full px-4 py-2 rounded-xl text-sm transition-all resize-none font-mono focus:outline-none focus:ring-2"
                                style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                                required
                            />
                        </div>
                        <div className="flex justify-end mt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                                style={{ background: 'var(--accent)', color: 'var(--bg)', opacity: isSubmitting ? 0.7 : 1 }}
                            >
                                {isSubmitting ? 'Saving...' : (editingToolId ? 'Update Tool' : 'Save Tool')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Ordered Tools Section */}
            <div className="mb-4 mt-2">
                <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-h)' }}>Displayed Tools</h2>
                <p className="text-xs mb-4" style={{ color: 'var(--text)', opacity: 0.55 }}>Drag to reorder. Drop available tools into the empty card to add them.</p>

                <div className="grid gap-3 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mb-10">
                    {orderedTools.map((tool, i) => {
                        const isSource = drag?.type === 'ordered' && drag.index === i && hasMoved
                        const isTarget = overIndex === i && hasMoved

                        return (
                            <div
                                key={tool._id}
                                ref={el => { cardRefs.current[i] = el }}
                                onPointerDown={e => handlePointerDown(e, 'ordered', i)}
                                onPointerCancel={handlePointerCancel}
                                className="relative flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-150 group"
                                style={{
                                    background: 'var(--accent-bg)',
                                    border: `1.5px ${isTarget ? 'dashed' : 'solid'} ${isTarget ? 'var(--accent)' : 'var(--border)'}`,
                                    opacity: isSource ? 0.2 : 1,
                                    cursor: isDragging ? (hasMoved ? 'grabbing' : 'grab') : 'grab',
                                    transform: isTarget ? 'scale(1.04)' : 'scale(1)',
                                    touchAction: 'none',
                                    userSelect: 'none',
                                }}
                            >
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onPointerDown={(e) => e.stopPropagation()}
                                        onClick={(e) => { e.stopPropagation(); openEditForm(tool); }}
                                        className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                                        title="Edit Tool"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                    </button>
                                    <button 
                                        onPointerDown={(e) => e.stopPropagation()}
                                        onClick={(e) => handleRemoveTool(e, tool)}
                                        className="w-6 h-6 rounded-full flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                        title="Remove from displayed"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                </div>

                                {/* Position number */}
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

                    {/* The Empty Drop Zone Card */}
                    <div
                        ref={dropZoneRef}
                        className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl transition-all duration-150"
                        style={{
                            background: overDropZone ? 'var(--accent-bg)' : 'transparent',
                            border: `1.5px dashed ${overDropZone ? 'var(--accent)' : 'var(--border)'}`,
                            transform: overDropZone ? 'scale(1.04)' : 'scale(1)',
                            minHeight: '120px'
                        }}
                    >
                        <div className="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-2 opacity-50" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text)' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            <div className="text-[12px] font-semibold" style={{ color: 'var(--text)', opacity: 0.5 }}>Drop Here</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Unordered Tools Section */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-h)' }}>Available Tools</h2>
                <p className="text-xs mb-4" style={{ color: 'var(--text)', opacity: 0.55 }}>Drag items to the drop zone above to add them.</p>
                
                {unorderedTools.length === 0 && (
                    <div className="p-4 rounded-xl text-center text-sm mb-6" style={{ background: 'var(--accent-bg)', border: '1px dashed var(--border)', color: 'var(--text)' }}>
                        All tools are displayed.
                    </div>
                )}

                <div className="grid gap-3 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
                    {unorderedTools.map((tool, i) => {
                        const isSource = drag?.type === 'unordered' && drag.index === i && hasMoved

                        return (
                            <div
                                key={tool._id}
                                onPointerDown={e => handlePointerDown(e, 'unordered', i)}
                                onPointerCancel={handlePointerCancel}
                                className="relative flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-150 cursor-grab hover:-translate-y-1 group"
                                style={{
                                    background: 'var(--accent-bg)',
                                    border: `1.5px solid var(--border)`,
                                    opacity: isSource ? 0.2 : 1,
                                    touchAction: 'none',
                                    userSelect: 'none',
                                }}
                            >
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onPointerDown={(e) => e.stopPropagation()}
                                        onClick={(e) => { e.stopPropagation(); openEditForm(tool); }}
                                        className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                                        title="Edit Tool"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                    </button>
                                    <button 
                                        onPointerDown={(e) => e.stopPropagation()}
                                        onClick={(e) => { e.stopPropagation(); setToolToDelete(tool); }}
                                        className="w-6 h-6 rounded-full flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                        title="Permanently Delete Tool"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </div>

                                <div className="w-12 h-12 rounded-xl flex items-center justify-center p-2"
                                    style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                                    <SvgIcon svg={tool.icon} className="w-full h-full [&_svg]:w-full [&_svg]:h-full" />
                                </div>

                                <div className="text-center w-full">
                                    <div className="text-[12px] font-semibold leading-tight" style={{ color: 'var(--text-h)' }}>
                                        {tool.label}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

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
                    {drag.type === 'ordered' && (
                        <span className="self-start text-[11px] font-black leading-none tabular-nums"
                            style={{ color: 'var(--accent)', opacity: 0.5 }}>
                            {String(drag.index + 1).padStart(2, '0')}
                        </span>
                    )}
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center p-2"
                        style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                        <SvgIcon svg={ghostTool.icon} className="w-full h-full [&_svg]:w-full [&_svg]:h-full" />
                    </div>
                    <div className="text-center w-full">
                        <div className="text-[12px] font-semibold leading-tight" style={{ color: 'var(--text-h)' }}>
                            {ghostTool.label}
                        </div>
                        {drag.type === 'ordered' && (
                            <div className="mt-2 h-px w-full" style={{ background: 'var(--border)' }} />
                        )}
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={!!toolToDelete}
                toolLabel={toolToDelete?.label || ''}
                isDeleting={isDeleting}
                onCancel={() => setToolToDelete(null)}
                onConfirm={async () => {
                    setIsDeleting(true);
                    await handleDeleteTool(toolToDelete);
                    setIsDeleting(false);
                    setToolToDelete(null);
                }}
            />
        </div>
    )
}