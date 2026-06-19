

interface DeleteConfirmModalProps {
    isOpen: boolean;
    toolLabel: string;
    isDeleting: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function DeleteConfirmModal({
    isOpen,
    toolLabel,
    isDeleting,
    onCancel,
    onConfirm
}: DeleteConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-200">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-2xl p-6 shadow-xl relative border border-black/10 dark:border-white/10"
                 style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
                
                <div className="flex items-center gap-3 mb-4 text-red-500">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    </div>
                    <h3 className="text-lg font-bold">Hapus Tool?</h3>
                </div>

                <p className="text-sm mb-6" style={{ color: 'var(--text)', opacity: 0.8 }}>
                    Apakah Anda yakin ingin menghapus <strong>{toolLabel}</strong> secara permanen? Tindakan ini tidak dapat dibatalkan.
                </p>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-black/5 dark:hover:bg-white/5"
                        style={{ color: 'var(--text-h)' }}
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="px-4 py-2 rounded-xl text-sm font-semibold transition-all bg-red-500 text-white hover:bg-red-600"
                        style={{ opacity: isDeleting ? 0.7 : 1 }}
                    >
                        {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                    </button>
                </div>
            </div>
        </div>
    );
}
