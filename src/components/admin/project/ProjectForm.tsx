import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import TiptapEditor from '@/components/ui/TiptapEditor';
import type { ApiTool } from '@/hooks/useAdminTools';
import type { Project } from './types';
import { compressImage, slugify } from './utils';

const STYLING_PRESETS = [
    {
        name: 'Cyan/Blue Gradient',
        color: 'from-cyan-500/20 to-blue-500/20',
        accent: 'text-cyan-400',
        border: 'hover:border-cyan-500/40',
        theme: '#06b6d4'
    },
    {
        name: 'Violet/Fuchsia Gradient',
        color: 'from-violet-500/20 to-fuchsia-500/20',
        accent: 'text-violet-400',
        border: 'hover:border-violet-500/40',
        theme: '#8b5cf6'
    },
    {
        name: 'Emerald/Teal Gradient',
        color: 'from-emerald-500/20 to-teal-500/20',
        accent: 'text-emerald-400',
        border: 'hover:border-emerald-500/40',
        theme: '#10b981'
    },
    {
        name: 'Amber/Orange Gradient',
        color: 'from-amber-500/20 to-orange-500/20',
        accent: 'text-amber-400',
        border: 'hover:border-amber-500/40',
        theme: '#f59e0b'
    },
    {
        name: 'Rose/Red Gradient',
        color: 'from-rose-500/20 to-red-500/20',
        accent: 'text-rose-400',
        border: 'hover:border-rose-500/40',
        theme: '#f43f5e'
    },
];

interface FormState {
    title: string;
    slug: string;
    category: string;
    summary: string;
    content: string;
    company: string;
    duration: string;
    location: string;
    workType: string;
    icon: string;
    status: boolean;
    sort: number;
    color: string;
    accent: string;
    border: string;
    demoUrl: string;
    githubUrl: string;
    techStack: string[];
    tools: string[];
}

const initialFormState: FormState = {
    title: '',
    slug: '',
    category: 'Professional',
    summary: '',
    content: '',
    company: '',
    duration: '',
    location: '',
    workType: 'Remote',
    icon: 'ph:folder-bold',
    status: true,
    sort: 1,
    color: 'from-cyan-500/20 to-blue-500/20',
    accent: 'text-cyan-400',
    border: 'hover:border-cyan-500/40',
    demoUrl: '',
    githubUrl: '',
    techStack: [],
    tools: [],
};

interface ProjectFormProps {
    editProject: Project | null;
    allTools: ApiTool[];
    onSubmit: (payload: FormData) => Promise<void>;
    onCancel: () => void;
}

export default function ProjectForm({ editProject, allTools, onSubmit, onCancel }: ProjectFormProps) {
    const [formData, setFormData] = useState<FormState>(() => {
        if (editProject) {
            return {
                title: editProject.title || '',
                slug: editProject.slug || '',
                category: editProject.category || 'Professional',
                summary: editProject.summary || '',
                content: editProject.content || '',
                company: editProject.company || '',
                duration: editProject.duration || '',
                location: editProject.location || '',
                workType: editProject.workType || 'Remote',
                icon: editProject.icon || 'ph:folder-bold',
                status: editProject.status ?? true,
                sort: editProject.sort ?? 1,
                color: editProject.color || 'from-cyan-500/20 to-blue-500/20',
                accent: editProject.accent || 'text-cyan-400',
                border: editProject.border || 'hover:border-cyan-500/40',
                demoUrl: editProject.demoUrl || editProject.live || '',
                githubUrl: editProject.githubUrl || editProject.repo || '',
                techStack: (editProject.techStack || []).map((t: string | ApiTool) => typeof t === 'string' ? t : t._id),
                tools: (editProject.tools || []).map((t: string | ApiTool) => typeof t === 'string' ? t : t._id),
            };
        }
        return initialFormState;
    });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>(() => {
        if (editProject) {
            return Array.isArray(editProject.imageUrls) && editProject.imageUrls.length > 0
                ? editProject.imageUrls
                : (Array.isArray(editProject.image) && editProject.image.length > 0
                    ? editProject.image
                    : (typeof editProject.image === 'string' && editProject.image ? [editProject.image] : []));
        }
        return [];
    });

    const [errorMsg, setErrorMsg] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);

    useEffect(() => {
        return () => {
            previews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previews]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => {
            const next = { ...prev, [name]: val };
            if (name === 'title' && !editProject) {
                next.slug = slugify(value);
            }
            return next;
        });
    };

    const handleTiptapChange = (content: string) => {
        setFormData(prev => ({ ...prev, content }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrorMsg('');
        if (e.target.files) {
            const incomingFiles = Array.from(e.target.files);
            const totalFiles = [...selectedFiles, ...incomingFiles];
            setSelectedFiles(totalFiles);

            const newPreviews = totalFiles.map(file => URL.createObjectURL(file));
            setPreviews(newPreviews);
            e.target.value = ''; // reset input
        }
    };

    const removeNewFile = (idx: number) => {
        const newFiles = [...selectedFiles];
        const newPreviews = [...previews];
        URL.revokeObjectURL(newPreviews[idx]);
        newFiles.splice(idx, 1);
        newPreviews.splice(idx, 1);
        setSelectedFiles(newFiles);
        setPreviews(newPreviews);
    };

    const removeExistingImage = (idx: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== idx));
    };

    const toggleTechSelect = (toolId: string) => {
        setFormData(prev => {
            const index = prev.techStack.indexOf(toolId);
            const updated = [...prev.techStack];
            if (index > -1) {
                updated.splice(index, 1);
            } else {
                updated.push(toolId);
            }
            return { ...prev, techStack: updated };
        });
    };

    const toggleToolSelect = (toolId: string) => {
        setFormData(prev => {
            const index = prev.tools.indexOf(toolId);
            const updated = [...prev.tools];
            if (index > -1) {
                updated.splice(index, 1);
            } else {
                updated.push(toolId);
            }
            return { ...prev, tools: updated };
        });
    };

    const applyPreset = (preset: typeof STYLING_PRESETS[0]) => {
        setFormData(prev => ({
            ...prev,
            color: preset.color,
            accent: preset.accent,
            border: preset.border
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setIsSaving(true);

        try {
            const formDataPayload = new FormData();
            
            // Append primitives
            formDataPayload.append('title', formData.title);
            formDataPayload.append('slug', formData.slug);
            formDataPayload.append('category', formData.category);
            formDataPayload.append('summary', formData.summary);
            formDataPayload.append('content', formData.content);
            formDataPayload.append('company', formData.company);
            formDataPayload.append('duration', formData.duration);
            formDataPayload.append('location', formData.location);
            formDataPayload.append('workType', formData.workType);
            formDataPayload.append('icon', formData.icon);
            formDataPayload.append('status', String(formData.status));
            formDataPayload.append('sort', String(formData.sort));
            formDataPayload.append('color', formData.color);
            formDataPayload.append('accent', formData.accent);
            formDataPayload.append('border', formData.border);
            formDataPayload.append('demoUrl', formData.demoUrl);
            formDataPayload.append('githubUrl', formData.githubUrl);

            // Append Arrays (individual values)
            formData.techStack.forEach(id => formDataPayload.append('techStack', id));
            formData.tools.forEach(id => formDataPayload.append('tools', id));

            // Append existing remaining images
            existingImages.forEach(url => formDataPayload.append('image', url));

            // Compress and append new images
            setIsCompressing(true);
            const compressedFiles = await Promise.all(
                selectedFiles.map(file => compressImage(file))
            );
            setIsCompressing(false);

            compressedFiles.forEach(file => {
                formDataPayload.append('image', file);
            });

            await onSubmit(formDataPayload);
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            setErrorMsg('Gagal menyimpan proyek: ' + (err.response?.data?.message || err.message));
        } finally {
            setIsSaving(false);
            setIsCompressing(false);
        }
    };

    return (
        <div className="mb-8 p-5 rounded-2xl" style={{ background: 'var(--accent-bg)', border: '1px solid var(--border)' }}>
            <div className="flex justify-between items-center mb-6 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-h)' }}>
                    {editProject ? 'Edit Project' : 'Create New Project'}
                </h2>
                <button 
                    type="button" 
                    onClick={onCancel} 
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
                {/* COLUMN 1: Basic Info & Metadata */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-2 border-b pb-1" style={{ color: 'var(--accent)', borderColor: 'var(--border)' }}>
                        Project Details
                    </h3>

                    <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Project Title *</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} placeholder="e.g. E-Commerce Platform" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Slug *</label>
                        <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} placeholder="e.g. e-commerce-platform" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Category</label>
                            <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} placeholder="e.g. Professional" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Icon (Iconify name)</label>
                            <input type="text" name="icon" value={formData.icon} onChange={handleChange} className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} placeholder="e.g. ph:storefront-bold" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Company</label>
                            <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} placeholder="e.g. PT Maju Bersama" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Work Type</label>
                            <select name="workType" value={formData.workType} onChange={handleChange} className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                                <option value="On-site">On-site</option>
                                <option value="Remote">Remote</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="Contract">Contract</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Duration</label>
                            <input type="text" name="duration" value={formData.duration} onChange={handleChange} className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} placeholder="e.g. 8 Months" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Location</label>
                            <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} placeholder="e.g. Jakarta, Indonesia" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Sort Order</label>
                            <input type="number" name="sort" value={formData.sort} onChange={handleChange} className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} min={1} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Status</label>
                            <select name="status" value={formData.status ? 'true' : 'false'} onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value === 'true' }))} className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Live Link (demoUrl)</label>
                            <input type="url" name="demoUrl" value={formData.demoUrl} onChange={handleChange} className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} placeholder="https://..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Repo Link (githubUrl)</label>
                            <input type="url" name="githubUrl" value={formData.githubUrl} onChange={handleChange} className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} placeholder="https://github.com/..." />
                        </div>
                    </div>

                    <div className="mt-2 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-h)' }}>Styling Presets</label>
                        <div className="grid grid-cols-5 gap-2">
                            {STYLING_PRESETS.map((preset, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => applyPreset(preset)}
                                    className="h-10 rounded-xl transition-transform hover:scale-105 shadow-sm border border-black/10 dark:border-white/10 flex items-center justify-center cursor-pointer"
                                    style={{ background: preset.theme }}
                                    title={preset.name}
                                >
                                    <Icon icon="ph:paint-brush-bold" className="w-4 h-4 text-white" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-2">
                        <div>
                            <label className="block text-[11px] font-semibold mb-0.5 text-gray-500">Glow Color</label>
                            <input type="text" name="color" value={formData.color} onChange={handleChange} className="w-full px-2.5 py-1.5 rounded-lg text-xs font-mono" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold mb-0.5 text-gray-500">Accent Text</label>
                            <input type="text" name="accent" value={formData.accent} onChange={handleChange} className="w-full px-2.5 py-1.5 rounded-lg text-xs font-mono" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold mb-0.5 text-gray-500">Border Hover</label>
                            <input type="text" name="border" value={formData.border} onChange={handleChange} className="w-full px-2.5 py-1.5 rounded-lg text-xs font-mono" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                        </div>
                    </div>
                </div>

                {/* COLUMN 2: Description, Images, and Multi-select Lists */}
                <div className="flex flex-col gap-6">
                    {/* Short Summary */}
                    <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Short Summary *</label>
                        <textarea name="summary" value={formData.summary} onChange={handleChange} rows={2} required className="w-full px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} placeholder="A brief overview of the project..." />
                    </div>

                    {/* Tiptap Rich Description */}
                    <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-h)' }}>Long Content (Rich Text Description)</label>
                        <TiptapEditor value={formData.content} onChange={handleTiptapChange} />
                    </div>

                    {/* Image Uploader */}
                    <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-h)' }}>Project Images</label>
                        
                        <label
                            className="relative flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 border-dashed transition-all cursor-pointer group"
                            style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
                        >
                            <div className="flex flex-col items-center justify-center pt-4 pb-4 text-center px-4">
                                <Icon icon="ph:cloud-arrow-up-bold" className="w-8 h-8 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                                <p className="mb-1 text-xs font-semibold" style={{ color: 'var(--text-h)' }}>Click to add images</p>
                                <p className="text-[10px]" style={{ color: 'var(--text)', opacity: 0.6 }}>PNG, JPG, WEBP (Multiple images allowed)</p>
                            </div>
                            <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                        </label>

                        {/* Previews Grid */}
                        {(existingImages.length > 0 || previews.length > 0) && (
                            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                {/* Existing images from backend */}
                                {existingImages.map((src, idx) => (
                                    <div key={`existing-${idx}`} className="relative w-full aspect-square rounded-xl overflow-hidden border border-white/10 group">
                                        <img src={src} alt="Existing" className="w-full h-full object-cover" />
                                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-blue-500 text-white text-[8px] font-bold select-none">Existing</div>
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(idx)}
                                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                                        >
                                            <Icon icon="ph:trash-bold" className="w-5 h-5 text-red-500" />
                                        </button>
                                    </div>
                                ))}

                                {/* New local files selected */}
                                {previews.map((src, idx) => (
                                    <div key={`new-${idx}`} className="relative w-full aspect-square rounded-xl overflow-hidden border border-white/10 group">
                                        <img src={src} alt="New Preview" className="w-full h-full object-cover" />
                                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-green-500 text-white text-[8px] font-bold select-none">New</div>
                                        <button
                                            type="button"
                                            onClick={() => removeNewFile(idx)}
                                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                                        >
                                            <Icon icon="ph:x-bold" className="w-5 h-5 text-red-500" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Tech Stack Multi-Select */}
                    <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-h)' }}>
                            Tech Stack (Pill labels)
                        </label>
                        <div className="p-3 rounded-xl border max-h-48 overflow-y-auto flex flex-wrap gap-1.5" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
                            {allTools.length === 0 ? (
                                <span className="text-xs opacity-50 p-2">Loading tools list...</span>
                            ) : (
                                allTools.map(tool => {
                                    const isSelected = formData.techStack.includes(tool._id);
                                    return (
                                        <button
                                            key={`tech-${tool._id}`}
                                            type="button"
                                            onClick={() => toggleTechSelect(tool._id)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border cursor-pointer`}
                                            style={{
                                                background: isSelected ? 'var(--accent)' : 'transparent',
                                                color: isSelected ? 'var(--bg)' : 'var(--text)',
                                                borderColor: isSelected ? 'var(--accent)' : 'var(--border)'
                                            }}
                                        >
                                            <span className="w-3.5 h-3.5 flex items-center justify-center [&_svg]:w-full [&_svg]:h-full font-mono [&_svg]:fill-current" dangerouslySetInnerHTML={{ __html: tool.icon }} />
                                            {tool.label}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Tools & Integrations Multi-Select */}
                    <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-h)' }}>
                            Tools & Integrations (Icon displays)
                        </label>
                        <div className="p-3 rounded-xl border max-h-48 overflow-y-auto flex flex-wrap gap-1.5" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
                            {allTools.length === 0 ? (
                                <span className="text-xs opacity-50 p-2">Loading tools list...</span>
                            ) : (
                                allTools.map(tool => {
                                    const isSelected = formData.tools.includes(tool._id);
                                    return (
                                        <button
                                            key={`tool-${tool._id}`}
                                            type="button"
                                            onClick={() => toggleToolSelect(tool._id)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border cursor-pointer`}
                                            style={{
                                                background: isSelected ? 'var(--accent)' : 'transparent',
                                                color: isSelected ? 'var(--bg)' : 'var(--text)',
                                                borderColor: isSelected ? 'var(--accent)' : 'var(--border)'
                                            }}
                                        >
                                            <span className="w-3.5 h-3.5 flex items-center justify-center [&_svg]:w-full [&_svg]:h-full font-mono [&_svg]:fill-current" dangerouslySetInnerHTML={{ __html: tool.icon }} />
                                            {tool.label}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="lg:col-span-2 flex justify-end mt-4 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                    <button
                        type="submit"
                        disabled={isSaving || isCompressing}
                        className="px-8 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-85 flex items-center gap-2 cursor-pointer shadow-lg"
                        style={{ background: 'var(--accent)', color: 'var(--bg)', opacity: (isSaving || isCompressing) ? 0.7 : 1 }}
                    >
                        {(isSaving || isCompressing) ? (
                            <>
                                <Icon icon="line-md:loading-twotone-loop" className="w-4 h-4" />
                                {isCompressing ? 'Compressing images...' : 'Saving project...'}
                            </>
                        ) : (
                            <>
                                <Icon icon="ph:check-bold" className="w-4 h-4" />
                                Save Project
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
