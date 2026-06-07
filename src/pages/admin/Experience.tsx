import React, { useState } from 'react';
import { useExperience, useCreateExperience, useUpdateExperience, useDeleteExperience } from '@/hooks/useExperience';
import ExperienceServices from '@/services/experience.services';
import TiptapEditor from '@/components/ui/TiptapEditor';

const initialFormState = {
    companyName: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    icon: 'ph:briefcase-bold',
    summary: '',
    content: '',
    current: false,
    responsibilities: '',
    type: 'Full-time',
    mode: 'WFO',
    status: 'active'
};

export default function ExperienceAdmin() {
    const { data: experiences, isLoading } = useExperience();
    const { mutateAsync: createExperience, isPending: isCreating } = useCreateExperience();
    const { mutateAsync: updateExperience, isPending: isUpdating } = useUpdateExperience();
    const { mutateAsync: deleteExperience, isPending: isDeleting } = useDeleteExperience();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const [formData, setFormData] = useState(initialFormState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setEditId(null);
        setErrorMsg('');
    };

    const handleOpenCreate = () => {
        resetForm();
        setIsFormOpen(true);
    };

    const [isFetchingDetail, setIsFetchingDetail] = useState(false);

    const handleOpenEdit = async (exp: any) => {
        setIsFetchingDetail(true);
        try {
            // Fetch full details in case the list endpoint omits summary/content
            const response = await ExperienceServices.getById(exp._id);
            const fullExp = response.data || response;

            setFormData({
                companyName: fullExp.companyName || exp.companyName || '',
                position: fullExp.position || exp.position || '',
                location: fullExp.location || exp.location || '',
                startDate: fullExp.startDate ? fullExp.startDate.split('T')[0] : (exp.startDate ? exp.startDate.split('T')[0] : ''),
                endDate: fullExp.endDate ? fullExp.endDate.split('T')[0] : (exp.endDate ? exp.endDate.split('T')[0] : ''),
                icon: fullExp.icon || exp.icon || 'ph:briefcase-bold',
                summary: fullExp.summary || exp.summary || '',
                content: fullExp.content || exp.content || '',
                current: fullExp.current ?? exp.current ?? false,
                responsibilities: (fullExp.responsibilities || exp.responsibilities || []).join(', '),
                type: fullExp.type || exp.type || 'Full-time',
                mode: fullExp.mode || exp.mode || 'WFO',
                status: fullExp.status || exp.status || 'active'
            });
            setEditId(exp._id);
            setIsFormOpen(true);
            setErrorMsg('');
        } catch (error) {
            console.error("Failed to fetch detail", error);
            // Fallback to list data if getById fails
            setFormData({
                companyName: exp.companyName || '',
                position: exp.position || '',
                location: exp.location || '',
                startDate: exp.startDate ? exp.startDate.split('T')[0] : '',
                endDate: exp.endDate ? exp.endDate.split('T')[0] : '',
                icon: exp.icon || 'ph:briefcase-bold',
                summary: exp.summary || '',
                content: exp.content || '',
                current: exp.current || false,
                responsibilities: (exp.responsibilities || []).join(', '),
                type: exp.type || 'Full-time',
                mode: exp.mode || 'WFO',
                status: exp.status || 'active'
            });
            setEditId(exp._id);
            setIsFormOpen(true);
        } finally {
            setIsFetchingDetail(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        // Parse responsibilities
        const responsibilitiesArray = formData.responsibilities
            .split(',')
            .map(r => r.trim())
            .filter(r => r.length > 0);

        const payload = {
            ...formData,
            endDate: formData.current ? null : formData.endDate,
            responsibilities: responsibilitiesArray,
        };

        try {
            if (editId) {
                await updateExperience({ id: editId, data: payload });
                setSuccessMsg('Experience berhasil diupdate!');
            } else {
                await createExperience(payload);
                setSuccessMsg('Experience berhasil ditambahkan!');
            }
            setIsFormOpen(false);
            resetForm();
            setTimeout(() => setSuccessMsg(''), 5000);
        } catch (error: any) {
            setErrorMsg('Terjadi kesalahan: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteExperience(deleteId);
            setSuccessMsg('Experience berhasil dihapus!');
            setDeleteId(null);
            setTimeout(() => setSuccessMsg(''), 5000);
        } catch (error: any) {
            alert('Gagal menghapus: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <main className="p-6 lg:p-8 min-h-screen">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-h)' }}>
                        Experience
                    </h1>
                    <p className="text-sm" style={{ color: 'var(--text)', opacity: 0.55 }}>
                        Manage your work experience and job history.
                    </p>
                </div>
                {!isFormOpen && (
                    <button
                        onClick={handleOpenCreate}
                        className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150"
                        style={{
                            background: 'var(--accent)',
                            color: 'var(--bg)',
                            border: '1px solid var(--accent)'
                        }}
                    >
                        Create Experience
                    </button>
                )}
            </div>

            {successMsg && !isFormOpen && (
                <div className="mb-6 p-4 rounded-xl flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <span className="text-sm font-medium">{successMsg}</span>
                </div>
            )}

            {isFormOpen && (
                <div className="mb-8 p-5 rounded-2xl" style={{ background: 'var(--accent-bg)', border: '1px solid var(--border)' }}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold" style={{ color: 'var(--text-h)' }}>
                            {editId ? 'Edit Experience' : 'Create Experience'}
                        </h2>
                        <button onClick={() => { setIsFormOpen(false); resetForm(); }} className="text-sm px-3 py-1 rounded-lg transition-colors hover:opacity-70" style={{ color: 'var(--text)' }}>
                            Cancel
                        </button>
                    </div>

                    {errorMsg && (
                        <div className="mb-4 p-4 rounded-xl flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
                            <span className="text-sm font-medium">{errorMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Company Name</label>
                                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Position</label>
                                <input type="text" name="position" value={formData.position} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Start Date</label>
                            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium" style={{ color: 'var(--text-h)' }}>End Date</label>
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                    <input type="checkbox" name="current" checked={formData.current} onChange={handleChange} className="rounded" />
                                    <span>Current</span>
                                </label>
                            </div>
                            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} disabled={formData.current} required={!formData.current} className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 disabled:opacity-50" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Location</label>
                            <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Remote, Jakarta" className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Icon (Iconify)</label>
                            <input type="text" name="icon" value={formData.icon} onChange={handleChange} placeholder="e.g. ph:laptop-bold" className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Type</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Freelance">Freelance</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Mode</label>
                            <select name="mode" value={formData.mode} onChange={handleChange} className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                                <option value="WFO">WFO</option>
                                <option value="WFH">WFH</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="Remote">Remote</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Responsibilities (comma separated)</label>
                            <input type="text" name="responsibilities" value={formData.responsibilities} onChange={handleChange} placeholder="e.g. React, TypeScript, UI Design" className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Summary</label>
                            <textarea name="summary" value={formData.summary} onChange={handleChange} rows={2} className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Content (Rich Text)</label>
                            <TiptapEditor 
                                value={formData.content} 
                                onChange={(val) => setFormData(prev => ({ ...prev, content: val }))} 
                            />
                        </div>

                        <div className="md:col-span-2 flex justify-end mt-2">
                            <button
                                type="submit"
                                disabled={isCreating || isUpdating}
                                className="px-6 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                                style={{ background: 'var(--accent)', color: 'var(--bg)', opacity: (isCreating || isUpdating) ? 0.7 : 1 }}
                            >
                                {isCreating || isUpdating ? 'Saving...' : 'Save Experience'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {!isFormOpen && (
                <div className="flex flex-col gap-3">
                    {isLoading ? (
                        <div className="text-center py-10" style={{ color: 'var(--text)', opacity: 0.5 }}>Loading...</div>
                    ) : experiences?.length === 0 ? (
                        <div className="text-center py-10" style={{ color: 'var(--text)', opacity: 0.5 }}>No experiences found.</div>
                    ) : (
                        experiences?.map((exp: any) => (
                            <div key={exp._id} className="p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all" style={{ background: 'var(--accent-bg)', border: '1px solid var(--border)' }}>
                                <div>
                                    <h3 className="font-bold text-base" style={{ color: 'var(--text-h)' }}>{exp.position}</h3>
                                    <p className="text-sm font-medium" style={{ color: 'var(--accent)' }}>{exp.companyName} • {exp.type}</p>
                                    <p className="text-xs mt-1" style={{ color: 'var(--text)', opacity: 0.7 }}>{exp.period} • {exp.location}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleOpenEdit(exp)}
                                        disabled={isFetchingDetail}
                                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50"
                                        style={{ color: 'var(--text)' }}
                                    >
                                        {isFetchingDetail ? 'Loading...' : 'Edit'}
                                    </button>
                                    <button
                                        onClick={() => setDeleteId(exp._id)}
                                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Simple Delete Modal (Inline) */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-200">
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-2xl p-6 shadow-xl relative border border-black/10 dark:border-white/10"
                        style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
                        <h3 className="text-lg font-bold mb-2 text-red-500">Hapus Experience?</h3>
                        <p className="text-sm mb-6" style={{ color: 'var(--text)', opacity: 0.8 }}>
                            Apakah Anda yakin ingin menghapus data ini?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setDeleteId(null)} disabled={isDeleting} className="px-4 py-2 rounded-xl text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5" style={{ color: 'var(--text-h)' }}>
                                Batal
                            </button>
                            <button onClick={handleDelete} disabled={isDeleting} className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600">
                                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}