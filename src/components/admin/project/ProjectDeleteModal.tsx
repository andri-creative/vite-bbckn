import { Icon } from '@iconify/react';

interface ProjectDeleteModalProps {
    isOpen: boolean;
    isDeleting: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function ProjectDeleteModal({ isOpen, isDeleting, onCancel, onConfirm }: ProjectDeleteModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm transition-all duration-200">
            <div 
                className="w-full max-w-sm rounded-2xl p-6 shadow-xl relative border"
                style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
            >
                <h3 className="text-lg font-bold mb-2 text-red-500">Hapus Proyek?</h3>
                <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text)', opacity: 0.8 }}>
                    Apakah Anda yakin ingin menghapus proyek ini secara permanen dari portofolio?
                </p>
                <div className="flex justify-end gap-3">
                    <button 
                        onClick={onCancel} 
                        disabled={isDeleting} 
                        className="px-4 py-2 rounded-xl text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer" 
                        style={{ color: 'var(--text-h)' }}
                    >
                        Batal
                    </button>
                    <button 
                        onClick={onConfirm} 
                        disabled={isDeleting} 
                        className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 flex items-center gap-2 cursor-pointer animate-pulse-subtle"
                    >
                        {isDeleting ? (
                            <>
                                <Icon icon="line-md:loading-twotone-loop" className="w-4 h-4 text-white" />
                                Menghapus...
                            </>
                        ) : (
                            'Ya, Hapus'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
