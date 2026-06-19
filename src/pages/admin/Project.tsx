import { useState, useEffect } from 'react';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '@/hooks/useProject';
import { Icon } from '@iconify/react';
import ToolsServices from '@/services/toolss.services';
import type { ApiTool } from '@/hooks/useAdminTools';

import type { Project } from '@/components/admin/project/types';
import ProjectCard from '@/components/admin/project/ProjectCard';
import ProjectForm from '@/components/admin/project/ProjectForm';
import ProjectDeleteModal from '@/components/admin/project/ProjectDeleteModal';

// Re-export the interface for compatibility
export type { Project };

export default function Projects() {
    const { data: projectsData, isLoading: isListLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useProjects(12);
    const { mutateAsync: createProject } = useCreateProject();
    const { mutateAsync: updateProject } = useUpdateProject();
    const { mutateAsync: deleteProject, isPending: isDeleting } = useDeleteProject();

    const projects = (projectsData?.pages.flatMap(page => page.data) || []) as Project[];

    // Page level control states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editProject, setEditProject] = useState<Project | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [allTools, setAllTools] = useState<ApiTool[]>([]);
    const [successMsg, setSuccessMsg] = useState('');

    // Fetch tools list for forms once
    useEffect(() => {
        ToolsServices.getAllTools()
            .then(res => setAllTools(res.data ?? res))
            .catch(err => console.error("Gagal mengambil daftar tools:", err));
    }, []);

    const handleOpenCreate = () => {
        setEditProject(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (project: Project) => {
        setEditProject(project);
        setIsFormOpen(true);
    };

    const handleFormCancel = () => {
        setIsFormOpen(false);
        setEditProject(null);
    };

    const handleFormSubmit = async (formDataPayload: FormData) => {
        if (editProject) {
            await updateProject({ id: editProject._id, data: formDataPayload });
            setSuccessMsg('Proyek berhasil di-update!');
        } else {
            await createProject(formDataPayload);
            setSuccessMsg('Proyek berhasil ditambahkan!');
        }
        setIsFormOpen(false);
        setEditProject(null);
        setTimeout(() => setSuccessMsg(''), 5000);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteId) return;
        try {
            await deleteProject(deleteId);
            setSuccessMsg('Proyek berhasil dihapus!');
            setDeleteId(null);
            setTimeout(() => setSuccessMsg(''), 5000);
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            alert('Gagal menghapus proyek: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <main className="p-6 lg:p-8 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-h)' }}>
                        Portfolio Projects
                    </h1>
                    <p className="text-sm" style={{ color: 'var(--text)', opacity: 0.55 }}>
                        Manage your featured portfolio works with support for multiple images, styling, and tools.
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
                        Create Project
                    </button>
                )}
            </div>

            {/* Global Messages */}
            {successMsg && !isFormOpen && (
                <div className="mb-6 p-4 rounded-xl flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400">
                    <Icon icon="ph:check-circle-bold" className="w-5 h-5" />
                    <span className="text-sm font-medium">{successMsg}</span>
                </div>
            )}

            {/* Form */}
            {isFormOpen && (
                <ProjectForm
                    key={editProject?._id || 'new'}
                    editProject={editProject}
                    allTools={allTools}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                />
            )}

            {/* List Section */}
            {!isFormOpen && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {isListLoading ? (
                        <div className="col-span-full text-center py-20 opacity-55 flex flex-col items-center gap-2">
                            <Icon icon="line-md:loading-twotone-loop" className="w-8 h-8 text-[var(--accent)]" />
                            <span>Loading projects...</span>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="col-span-full text-center py-20 opacity-50 flex flex-col items-center gap-3" style={{ border: '1px dashed var(--border)', borderRadius: '1rem' }}>
                            <Icon icon="ph:folder-dashed-bold" className="w-12 h-12 text-gray-500" />
                            <span>No projects found. Create one to get started!</span>
                        </div>
                    ) : (
                        projects.map((project) => (
                            <ProjectCard
                                key={project._id}
                                project={project}
                                onEdit={handleOpenEdit}
                                onDelete={setDeleteId}
                            />
                        ))
                    )}
                </div>
            )}

            {/* Load More Button */}
            {!isFormOpen && hasNextPage && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                        style={{ color: 'var(--text-h)', borderColor: 'var(--border)' }}
                    >
                        {isFetchingNextPage ? (
                            <>
                                <Icon icon="line-md:loading-twotone-loop" className="w-4 h-4" />
                                Loading...
                            </>
                        ) : (
                            'Load More Projects'
                        )}
                    </button>
                </div>
            )}

            {/* Delete Modal */}
            <ProjectDeleteModal
                isOpen={!!deleteId}
                isDeleting={isDeleting}
                onCancel={() => setDeleteId(null)}
                onConfirm={handleDeleteConfirm}
            />
        </main>
    );
}