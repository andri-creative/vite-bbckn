import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import {
    useAchievements,
    useCreateAchievement,
    useUpdateAchievement,
    useDeleteAchievement
} from '@/hooks/useAchievement';
import TiptapEditor from '@/components/ui/TiptapEditor';
import { compressImage, slugify } from '@/components/admin/project/utils';

const initialFormState = {
    title: '',
    slug: '',
    category: 'Sertifikat',
    description: '',
    issuer: '',
    issueDate: '',
    level: 'Nasional',
    pinned: false,  
    tags: [] as string[],
    label: '',
    status: true
};

export default function CertificateAdmin() {
    const { data: achievements, isLoading } = useAchievements();
    const { mutateAsync: createAchievement, isPending: isCreating } = useCreateAchievement();
    const { mutateAsync: updateAchievement, isPending: isUpdating } = useUpdateAchievement();
    const { mutateAsync: deleteAchievement, isPending: isDeleting } = useDeleteAchievement();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isCompressing, setIsCompressing] = useState(false);

    const [formData, setFormData] = useState(initialFormState);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [existingImage, setExistingImage] = useState<string | null>(null);

    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => {
            const next = { ...prev, [name]: val };
            if (name === 'title' && !editId) {
                next.slug = slugify(value);
            }
            return next;
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrorMsg('');
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            const nextPreview = URL.createObjectURL(file);
            if (preview) URL.revokeObjectURL(preview);
            setPreview(nextPreview);
        }
    };

    const removeSelectedFile = () => {
        setSelectedFile(null);
        if (preview) {
            URL.revokeObjectURL(preview);
            setPreview(null);
        }
    };

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const tag = tagInput.trim().replace(/,$/, '');
            if (tag && !formData.tags.includes(tag)) {
                setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
            }
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setEditId(null);
        setErrorMsg('');
        setSelectedFile(null);
        if (preview) {
            URL.revokeObjectURL(preview);
            setPreview(null);
        }
        setExistingImage(null);
        setTagInput('');
    };

    const handleOpenCreate = () => {
        resetForm();
        setIsFormOpen(true);
    };

    const handleOpenEdit = (cert: any) => {
        setFormData({
            title: cert.title || '',
            slug: cert.slug || '',
            category: cert.category || 'Sertifikat',
            description: cert.description || '',
            issuer: cert.issuer || '',
            issueDate: cert.issueDate || '',
            level: cert.level || 'Nasional',
            pinned: cert.pinned ?? false,
            tags: Array.isArray(cert.tags) ? cert.tags : [],
            label: cert.label || '',
            status: cert.status ?? true
        });
        setExistingImage(cert.image || null);
        setSelectedFile(null);
        setPreview(null);
        setEditId(cert._id);
        setIsFormOpen(true);
        setErrorMsg('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (!selectedFile && !existingImage) {
            setErrorMsg('Harap pilih atau upload 1 gambar sertifikat.');
            return;
        }

        const formDataPayload = new FormData();
        formDataPayload.append('title', formData.title);
        formDataPayload.append('slug', formData.slug);
        formDataPayload.append('category', formData.category);
        formDataPayload.append('description', formData.description);
        formDataPayload.append('issuer', formData.issuer);
        formDataPayload.append('issueDate', formData.issueDate);
        formDataPayload.append('level', formData.level);
        if (formData.label) {
            formDataPayload.append('label', formData.label);
        }
        const pinnedValue = (formData.pinned === undefined || formData.pinned === null) ? false : formData.pinned;
        const statusValue = (formData.status === undefined || formData.status === null) ? true : formData.status;
        formDataPayload.append('pinned', String(pinnedValue));
        formDataPayload.append('status', String(statusValue));

        // Append tags
        formData.tags.forEach(tag => formDataPayload.append('tags', tag));

        try {
            if (selectedFile) {
                setIsCompressing(true);
                const compressed = await compressImage(selectedFile);
                setIsCompressing(false);
                formDataPayload.append('image', compressed);
            } else if (existingImage) {
                formDataPayload.append('image', existingImage);
            }

            if (editId) {
                await updateAchievement({ id: editId, data: formDataPayload });
                setSuccessMsg('Sertifikat berhasil diperbarui!');
            } else {
                await createAchievement(formDataPayload);
                setSuccessMsg('Sertifikat berhasil ditambahkan!');
            }
            setIsFormOpen(false);
            resetForm();
            setTimeout(() => setSuccessMsg(''), 5000);
        } catch (error: any) {
            console.error("Gagal menyimpan sertifikat. Detail error backend:", error.response?.data || error);
            setErrorMsg('Gagal menyimpan sertifikat: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsCompressing(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteAchievement(deleteId);
            setSuccessMsg('Sertifikat berhasil dihapus!');
            setDeleteId(null);
            setTimeout(() => setSuccessMsg(''), 5000);
        } catch (error: any) {
            alert('Gagal menghapus sertifikat: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <main className="p-6 lg:p-8 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-h)' }}>
                        Certificates
                    </h1>
                    <p className="text-sm" style={{ color: 'var(--text)', opacity: 0.55 }}>
                        Manage achievements, certifications, credentials and pinning options.
                    </p>
                </div>
                {!isFormOpen && (
                    <button
                        onClick={handleOpenCreate}
                        className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center gap-2 cursor-pointer"
                        style={{
                            background: 'var(--accent)',
                            color: 'var(--bg)',
                            border: '1px solid var(--accent)'
                        }}
                    >
                        <Icon icon="ph:plus-bold" />
                        Create Certificate
                    </button>
                )}
            </div>

            {/* Success Message Banner */}
            {successMsg && !isFormOpen && (
                <div className="mb-6 p-4 rounded-xl flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400">
                    <Icon icon="ph:check-circle-bold" className="w-5 h-5" />
                    <span className="text-sm font-medium">{successMsg}</span>
                </div>
            )}

            {/* CRUD Form */}
            {isFormOpen && (
                <div className="mb-8 p-5 rounded-2xl" style={{ background: 'var(--accent-bg)', border: '1px solid var(--border)' }}>
                    <div className="flex justify-between items-center mb-6 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
                        <h2 className="text-lg font-semibold" style={{ color: 'var(--text-h)' }}>
                            {editId ? 'Edit Certificate' : 'Create New Certificate'}
                        </h2>
                        <button
                            type="button"
                            onClick={() => { setIsFormOpen(false); resetForm(); }}
                            className="text-sm px-4 py-1.5 rounded-lg border hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                            style={{ color: 'var(--text)', borderColor: 'var(--border)' }}
                        >
                            Cancel
                        </button>
                    </div>

                    {errorMsg && (
                        <div className="mb-6 p-4 rounded-xl flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
                            <Icon icon="ph:warning-bold" className="w-5 h-5" />
                            <span className="text-sm font-medium">{errorMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* COLUMN 1: Basic Info & Details */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-2 border-b pb-1 text-amber-500" style={{ borderColor: 'var(--border)' }}>
                                Credential Info
                            </h3>

                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Certificate Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2"
                                    style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                                    placeholder="e.g. Google Cloud Certified Architect"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Slug *</label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2"
                                    style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                                    placeholder="e.g. google-cloud-certified-architect"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Issuer *</label>
                                    <input
                                        type="text"
                                        name="issuer"
                                        value={formData.issuer}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2"
                                        style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                                        placeholder="e.g. Google Cloud"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Issue Date *</label>
                                    <input
                                        type="text"
                                        name="issueDate"
                                        value={formData.issueDate}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2"
                                        style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                                        placeholder="e.g. January 2026 atau Jun 2025"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Category *</label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2"
                                        style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                                        placeholder="e.g. Coding, Sertifikat, dll."
                                    />
                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                        {['Sertifikat', 'Penghargaan', 'Lainnya'].map(opt => (
                                            <button
                                                type="button"
                                                key={opt}
                                                onClick={() => setFormData(prev => ({ ...prev, category: opt }))}
                                                className="text-[10px] px-2 py-0.5 rounded border border-dashed hover:bg-amber-500/10 hover:text-amber-500 transition-colors cursor-pointer"
                                                style={{ borderColor: 'var(--border)', color: 'var(--text)', opacity: formData.category === opt ? 1 : 0.6 }}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Level *</label>
                                    <input
                                        type="text"
                                        name="level"
                                        value={formData.level}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2"
                                        style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                                        placeholder="e.g. Beginner, Internasional, dll."
                                    />
                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                        {['Nasional', 'Internasional', 'Regional'].map(opt => (
                                            <button
                                                type="button"
                                                key={opt}
                                                onClick={() => setFormData(prev => ({ ...prev, level: opt }))}
                                                className="text-[10px] px-2 py-0.5 rounded border border-dashed hover:bg-amber-500/10 hover:text-amber-500 transition-colors cursor-pointer"
                                                style={{ borderColor: 'var(--border)', color: 'var(--text)', opacity: formData.level === opt ? 1 : 0.6 }}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Credential Label (e.g. Cloud Architecture)</label>
                                <input
                                    type="text"
                                    name="label"
                                    value={formData.label}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2"
                                    style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                                    placeholder="e.g. Cloud Architecture"
                                />
                            </div>

                            <div className="flex items-center gap-2.5 mt-2 bg-amber-500/5 p-4 rounded-xl border border-amber-500/20">
                                <input
                                    type="checkbox"
                                    name="pinned"
                                    id="pinned"
                                    checked={formData.pinned}
                                    onChange={handleChange}
                                    className="w-4.5 h-4.5 accent-amber-500 rounded cursor-pointer"
                                />
                                <label htmlFor="pinned" className="text-sm font-semibold select-none cursor-pointer text-amber-500">
                                    Pin to Featured (Tampilkan di halaman utama)
                                </label>
                            </div>
                        </div>

                        {/* COLUMN 2: Image Uploader, Tags, Description */}
                        <div className="flex flex-col gap-6">
                            {/* Image Uploader */}
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-h)' }}>Certificate Image (1 Image Only) *</label>

                                {!preview && !existingImage ? (
                                    <label
                                        className="relative flex flex-col items-center justify-center w-full h-40 rounded-2xl border-2 border-dashed transition-all cursor-pointer group"
                                        style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
                                    >
                                        <div className="flex flex-col items-center justify-center text-center px-4 py-6">
                                            <Icon icon="ph:cloud-arrow-up-bold" className="w-8 h-8 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
                                            <p className="mb-1 text-xs font-semibold" style={{ color: 'var(--text-h)' }}>Click to upload image</p>
                                            <p className="text-[10px]" style={{ color: 'var(--text)', opacity: 0.6 }}>PNG, JPG, WEBP (Single Image Only)</p>
                                        </div>
                                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                    </label>
                                ) : (
                                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 group bg-black/10">
                                        <img
                                            src={preview || existingImage || ''}
                                            alt="Certificate Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-md text-white text-[10px] font-bold select-none border border-white/10">
                                            {preview ? 'New File' : 'Existing Image'}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeSelectedFile}
                                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500/90 text-white flex items-center justify-center hover:bg-red-600 transition-all cursor-pointer shadow-lg"
                                            title="Remove Image"
                                        >
                                            <Icon icon="ph:trash-bold" className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Tag Builder */}
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-h)' }}>
                                    Tags & Skills
                                </label>
                                <div className="flex flex-wrap gap-2 p-3 rounded-xl border mb-2 min-h-12" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
                                    {formData.tags.length === 0 ? (
                                        <span className="text-xs opacity-50 select-none py-1">No tags added yet. Type below...</span>
                                    ) : (
                                        formData.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center gap-1.5"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-amber-500/20 text-amber-500"
                                                >
                                                    <Icon icon="ph:x-bold" className="w-2.5 h-2.5" />
                                                </button>
                                            </span>
                                        ))
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={e => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                    placeholder="Type a tag and press Enter or Comma (,)"
                                    className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2"
                                    style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                                />
                            </div>

                            {/* Description Editor */}
                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Credential Description</label>
                                <TiptapEditor
                                    value={formData.description}
                                    onChange={(content) => setFormData(prev => ({ ...prev, description: content }))}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="lg:col-span-2 flex justify-end mt-4 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                            <button
                                type="submit"
                                disabled={isCreating || isUpdating || isCompressing}
                                className="px-8 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-85 flex items-center gap-2 cursor-pointer shadow-lg"
                                style={{ background: 'var(--accent)', color: 'var(--bg)', opacity: (isCreating || isUpdating || isCompressing) ? 0.7 : 1 }}
                            >
                                {isCreating || isUpdating || isCompressing ? (
                                    <>
                                        <Icon icon="line-md:loading-twotone-loop" className="w-4 h-4" />
                                        {isCompressing ? 'Compressing image...' : 'Saving certificate...'}
                                    </>
                                ) : (
                                    <>
                                        <Icon icon="ph:check-bold" className="w-4 h-4" />
                                        Save Certificate
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Certificates List View */}
            {!isFormOpen && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {isLoading ? (
                        <div className="col-span-full text-center py-20 opacity-55 flex flex-col items-center gap-2">
                            <Icon icon="line-md:loading-twotone-loop" className="w-8 h-8 text-amber-500" />
                            <span>Loading certificates...</span>
                        </div>
                    ) : !achievements || achievements.length === 0 ? (
                        <div className="col-span-full text-center py-20 opacity-50 flex flex-col items-center gap-3" style={{ border: '1px dashed var(--border)', borderRadius: '1rem' }}>
                            <Icon icon="ph:seal-check-bold" className="w-12 h-12 text-gray-500" />
                            <span>No certificates found. Create one to get started!</span>
                        </div>
                    ) : (
                        achievements.map((cert: any) => (
                            <div
                                key={cert._id}
                                className="rounded-2xl overflow-hidden border flex flex-col transition-all duration-200 hover:-translate-y-1 shadow-sm relative"
                                style={{ background: 'var(--accent-bg)', borderColor: 'var(--border)' }}
                            >
                                {/* Pinned seal */}
                                {cert.pinned && (
                                    <div
                                        className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-amber-500/90 text-white flex items-center justify-center shadow-lg border border-amber-400/20"
                                        title="Pinned to featured"
                                    >
                                        <Icon icon="ph:seal-check-fill" className="w-4.5 h-4.5" />
                                    </div>
                                )}

                                {/* Cover image */}
                                <div className="w-full h-44 bg-black/10 relative">
                                    {cert.image ? (
                                        <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs opacity-50">No Image</div>
                                    )}
                                    <div
                                        className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500/80 text-white border border-amber-400/10"
                                    >
                                        {cert.level}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md">
                                            {cert.category}
                                        </span>
                                        <h3 className="font-extrabold text-base mt-2.5 line-clamp-1" style={{ color: 'var(--text-h)' }}>
                                            {cert.title}
                                        </h3>
                                        <p className="text-xs font-semibold mt-1" style={{ color: 'var(--text)', opacity: 0.6 }}>
                                            {cert.issuer} • {cert.issueDate}
                                        </p>

                                        {/* Description preview */}
                                        {cert.description && (
                                            <p
                                                className="text-xs line-clamp-2 mt-2 leading-relaxed"
                                                style={{ color: 'var(--text)', opacity: 0.7 }}
                                                dangerouslySetInnerHTML={{
                                                    __html: cert.description.replace(/<[^>]*>/g, '') // Basic HTML tags stripping for summary
                                                }}
                                            />
                                        )}

                                        {/* Tags display */}
                                        {Array.isArray(cert.tags) && cert.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-3">
                                                {cert.tags.map((tag: string) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-0.5 rounded text-[9px] font-bold border"
                                                        style={{ borderColor: 'var(--border)', background: 'var(--bg)', color: 'var(--text-h)' }}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: 'var(--border)' }}>
                                        <span className="text-[9px] text-gray-500 font-mono select-none">
                                            Slug: {cert.slug}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleOpenEdit(cert)}
                                                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                                                style={{ color: 'var(--text)' }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => setDeleteId(cert._id)}
                                                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Inline Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-200">
                    <div
                        className="w-full max-w-sm rounded-2xl p-6 shadow-xl relative border"
                        style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
                    >
                        <h3 className="text-lg font-bold mb-2 text-red-500">Delete Certificate?</h3>
                        <p className="text-sm mb-6" style={{ color: 'var(--text)', opacity: 0.8 }}>
                            Are you sure you want to permanently delete this certificate? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setDeleteId(null)}
                                disabled={isDeleting}
                                className="px-4 py-2 rounded-xl text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                                style={{ color: 'var(--text-h)' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                                {isDeleting ? (
                                    <>
                                        <Icon icon="line-md:loading-twotone-loop" className="w-3.5 h-3.5" />
                                        Deleting...
                                    </>
                                ) : (
                                    'Yes, Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
