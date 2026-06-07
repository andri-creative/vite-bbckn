import React from 'react';
import { useBio, useCreateBio, useUpdateBio } from '@/hooks/useBio';
import { Icon } from '@iconify/react';
import { getRouteApi, useNavigate } from '@tanstack/react-router';

// Get type-safe route API for the Bio page
const routeApi = getRouteApi('/admin/bio');

export default function BioAdmin() {
    const { data: bio, isLoading } = useBio();
    const { mutateAsync: createBio, isPending: isCreating, error: createError, isSuccess: isCreateSuccess } = useCreateBio();
    const { mutateAsync: updateBio, isPending: isUpdating, error: updateError, isSuccess: isUpdateSuccess } = useUpdateBio();

    // 100% URL-driven state (TanStack Router Search Params) -> Zero useState!
    const searchParams = routeApi.useSearch();
    const navigate = useNavigate();

    const activeTab = searchParams.tab || 'stats';
    const action = searchParams.action || null;
    const editId = searchParams.id || null;

    const isFormOpen = action === 'create' || action === 'edit';
    const editMode = action === 'edit';
    
    // Find the item being edited directly from the query cache
    const editItem = editMode && editId ? bio?.[activeTab]?.find((item: any) => item._id === editId) : null;

    // Derived states from TanStack Query
    const isPending = isCreating || isUpdating;
    const errorMsg = createError?.message || updateError?.message || '';
    const showSuccess = (isCreateSuccess || isUpdateSuccess) && !isFormOpen;

    const switchTab = (tabName: 'stats' | 'educations' | 'publications') => {
        navigate({ to: '/admin/bio', search: { tab: tabName } });
    };

    const openCreateForm = () => {
        navigate({ to: '/admin/bio', search: { tab: activeTab, action: 'create' } });
    };

    const openEditForm = (id: string) => {
        navigate({ to: '/admin/bio', search: { tab: activeTab, action: 'edit', id } });
    };

    const closeForm = () => {
        navigate({ to: '/admin/bio', search: { tab: activeTab } });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Native HTML5 FormData API (Zero local state for inputs!)
        const formData = new FormData(e.currentTarget);
        let finalData: any = Object.fromEntries(formData as any);

        try {
            // Handle nested objects like thesis for education
            if (activeTab === 'educations' && finalData.thesisTitle) {
                finalData.thesis = {
                    label: finalData.thesisLabel || 'Skripsi',
                    title: finalData.thesisTitle,
                    tags: finalData.thesisTags ? finalData.thesisTags.split(',').map((t: string) => t.trim()) : []
                };
                delete finalData.thesisTitle;
                delete finalData.thesisLabel;
                delete finalData.thesisTags;
            }

            if (editMode && bio?._id) {
                // PUT logic
                await updateBio({ 
                    id: bio._id, 
                    data: { [activeTab]: [{ _id: editId, ...finalData }] } 
                });
            } else {
                // POST logic
                await createBio({ [activeTab]: [finalData] });
            }
            
            // Close form on success
            closeForm();
        } catch (error) {
            console.error("Mutation failed", error);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center opacity-50">Loading Bio...</div>;
    }

    return (
        <main className="p-6 lg:p-8 min-h-screen">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-h)' }}>
                        Bio & Profile
                    </h1>
                    <p className="text-sm" style={{ color: 'var(--text)', opacity: 0.55 }}>
                        Manage your stats, education history, and publications.
                        <br/><span className="text-xs text-green-500 font-bold">100% powered by TanStack Query & Router (Zero useState)</span>
                    </p>
                </div>
            </div>

            {showSuccess && (
                <div className="mb-6 p-4 rounded-xl flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400">
                    <Icon icon="ph:check-circle-bold" className="w-5 h-5" />
                    <span className="text-sm font-medium">Data berhasil disimpan!</span>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b" style={{ borderColor: 'var(--border)' }}>
                {(['stats', 'educations', 'publications'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => switchTab(tab)}
                        className={`px-4 py-2 text-sm font-semibold capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                        style={{ color: activeTab === tab ? 'var(--accent)' : 'var(--text)' }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="flex justify-end mb-4">
                {!isFormOpen && (
                    <button
                        onClick={openCreateForm}
                        className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center gap-2"
                        style={{ background: 'var(--accent)', color: 'var(--bg)' }}
                    >
                        <Icon icon="ph:plus-bold" />
                        Add {activeTab}
                    </button>
                )}
            </div>

            {/* Form Section */}
            {isFormOpen && (
                <div className="mb-8 p-5 rounded-2xl" style={{ background: 'var(--accent-bg)', border: '1px solid var(--border)' }}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold capitalize" style={{ color: 'var(--text-h)' }}>
                            {editMode ? 'Edit' : 'Add'} {activeTab}
                        </h2>
                        <button type="button" onClick={closeForm} className="text-sm px-3 py-1 rounded-lg transition-colors hover:opacity-70">
                            Cancel
                        </button>
                    </div>

                    {errorMsg && (
                        <div className="mb-4 p-4 rounded-xl flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-600">
                            <span className="text-sm font-medium">{errorMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeTab === 'stats' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Label</label>
                                    <input type="text" name="label" defaultValue={editItem?.label || ''} required className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} placeholder="e.g. Years Coding" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Value</label>
                                    <input type="text" name="value" defaultValue={editItem?.value || ''} required className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} placeholder="e.g. 5+" />
                                </div>
                            </>
                        )}

                        {activeTab === 'educations' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Institution</label>
                                    <input type="text" name="institution" defaultValue={editItem?.institution || ''} required className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Major</label>
                                    <input type="text" name="major" defaultValue={editItem?.major || ''} required className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Degree</label>
                                    <input type="text" name="degree" defaultValue={editItem?.degree || ''} required className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Period</label>
                                    <input type="text" name="period" defaultValue={editItem?.period || ''} required className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Location</label>
                                    <input type="text" name="location" defaultValue={editItem?.location || ''} required className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }} />
                                </div>
                                <div className="md:col-span-2 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                                    <h3 className="text-sm font-bold mb-3">Thesis Details</h3>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Thesis Label</label>
                                    <input type="text" name="thesisLabel" defaultValue={editItem?.thesis?.label || ''} className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }} placeholder="e.g. Skripsi" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Thesis Tags (comma separated)</label>
                                    <input type="text" name="thesisTags" defaultValue={editItem?.thesis?.tags?.join(', ') || ''} className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-1">Thesis Title</label>
                                    <textarea name="thesisTitle" defaultValue={editItem?.thesis?.title || ''} className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }} />
                                </div>
                            </>
                        )}

                        {activeTab === 'publications' && (
                            <>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-1">Title</label>
                                    <input type="text" name="title" defaultValue={editItem?.title || ''} required className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Journal</label>
                                    <input type="text" name="journal" defaultValue={editItem?.journal || ''} required className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Volume/Issue</label>
                                    <input type="text" name="volume" defaultValue={editItem?.volume || ''} className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Date</label>
                                    <input type="text" name="date" defaultValue={editItem?.date || ''} className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">DOI</label>
                                    <input type="text" name="doi" defaultValue={editItem?.doi || ''} className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Link</label>
                                    <input type="text" name="link" defaultValue={editItem?.link || ''} className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Status</label>
                                    <input type="text" name="status" defaultValue={editItem?.status || ''} className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }} placeholder="e.g. Published" />
                                </div>
                            </>
                        )}

                        <div className="md:col-span-2 flex justify-end mt-4">
                            <button type="submit" disabled={isPending} className="px-6 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80" style={{ background: 'var(--accent)', color: 'var(--bg)', opacity: isPending ? 0.7 : 1 }}>
                                {isPending ? 'Saving...' : `Save ${activeTab}`}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List Section */}
            {!isFormOpen && (
                <div className="flex flex-col gap-3">
                    {(!bio || !bio[activeTab] || bio[activeTab].length === 0) ? (
                        <div className="text-center py-10" style={{ color: 'var(--text)', opacity: 0.5 }}>No {activeTab} found.</div>
                    ) : (
                        bio[activeTab].map((item: any, index: number) => (
                            <div key={item._id || index} className="p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all" style={{ background: 'var(--accent-bg)', border: '1px solid var(--border)' }}>
                                <div>
                                    {activeTab === 'stats' && (
                                        <>
                                            <h3 className="font-bold text-lg" style={{ color: 'var(--text-h)' }}>{item.value}</h3>
                                            <p className="text-sm font-medium" style={{ color: 'var(--accent)' }}>{item.label}</p>
                                        </>
                                    )}
                                    {activeTab === 'educations' && (
                                        <>
                                            <h3 className="font-bold text-base" style={{ color: 'var(--text-h)' }}>{item.institution}</h3>
                                            <p className="text-sm font-medium" style={{ color: 'var(--accent)' }}>{item.major} • {item.degree}</p>
                                            <p className="text-xs mt-1" style={{ color: 'var(--text)', opacity: 0.7 }}>{item.period} • {item.location}</p>
                                        </>
                                    )}
                                    {activeTab === 'publications' && (
                                        <>
                                            <h3 className="font-bold text-base" style={{ color: 'var(--text-h)' }}>{item.title}</h3>
                                            <p className="text-sm font-medium" style={{ color: 'var(--accent)' }}>{item.journal} • {item.date}</p>
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => openEditForm(item._id)}
                                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                                        style={{ color: 'var(--text)' }}
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </main>
    );
}
