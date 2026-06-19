import { Icon } from '@iconify/react';
import type { Project } from './types';

interface ProjectCardProps {
    project: Project;
    onEdit: (project: Project) => void;
    onDelete: (id: string) => void;
}

export default function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
    const mainImg = Array.isArray(project.imageUrls) && project.imageUrls.length > 0
        ? project.imageUrls[0]
        : (Array.isArray(project.image) && project.image.length > 0
            ? project.image[0]
            : (typeof project.image === 'string' && project.image
                ? project.image
                : ''));
    const themeColor = project.color || project.accent || '#9ca3af';

    return (
        <div 
            className="rounded-2xl overflow-hidden border flex flex-col transition-all duration-200 hover:-translate-y-1 shadow-sm"
            style={{ background: 'var(--accent-bg)', borderColor: 'var(--border)' }}
        >
            {/* Cover image container */}
            <div className="w-full h-40 bg-black/10 relative">
                {mainImg ? (
                    <img src={mainImg} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs opacity-50">No Image</div>
                )}
                <div 
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[var(--bg)]/90 backdrop-blur-sm border flex items-center justify-center shadow-md"
                    style={{ color: themeColor, borderColor: 'var(--border)' }}
                >
                    <Icon icon={project.icon || 'ph:folder-bold'} className="w-4 h-4" />
                </div>
                
                {/* Status badge */}
                <div className={`absolute bottom-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold ${project.status ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'}`}>
                    {project.status ? 'Active' : 'Inactive'}
                </div>
            </div>

            {/* Card content */}
            <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{project.category || 'PROJECT'}</span>
                    <h3 className="font-bold text-base mt-1 line-clamp-1" style={{ color: 'var(--text-h)' }}>
                        {project.title}
                    </h3>
                    <p className="text-xs line-clamp-2 mt-2 leading-relaxed" style={{ color: 'var(--text)', opacity: 0.7 }}>
                        {project.summary}
                    </p>
                </div>

                <div className="flex items-center justify-between border-t mt-4 pt-3" style={{ borderColor: 'var(--border)' }}>
                    <span className="text-[10px] text-gray-500 font-mono">Sort: {project.sort}</span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => onEdit(project)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                            style={{ color: 'var(--text)' }}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(project._id)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
