import { useState } from 'react';
import { useAlbums, useCreateAlbum } from '@/hooks/useAlbum';

const compressImage = (file: File, maxWidth = 1200, quality = 0.8): Promise<File> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(img.src);
            const canvas = document.createElement('canvas');
            let { width, height } = img;

            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                    }));
                } else {
                    resolve(file); // fallback
                }
            }, 'image/jpeg', quality);
        };
        img.onerror = () => resolve(file); // fallback to original on error
    });
};

export default function AdminGalelyPage() {
    const { data: albumsData } = useAlbums(20);
    const { mutateAsync: createAlbum, isPending } = useCreateAlbum();

    const albums = albumsData?.pages[0]?.data || [];

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isCompressing, setIsCompressing] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrorMsg('');
        setSuccessMsg('');
        if (e.target.files) {
            const incomingFiles = Array.from(e.target.files);
            const totalFiles = [...selectedFiles, ...incomingFiles];

            if (totalFiles.length > 5) {
                setErrorMsg('Maksimal 5 gambar yang diperbolehkan untuk satu album.');
                e.target.value = ''; // reset
                return;
            }

            setSelectedFiles(totalFiles);

            // Create preview URLs
            const newPreviews = totalFiles.map(file => URL.createObjectURL(file));
            setPreviews(newPreviews);

            // Reset input so the same file can be selected again
            e.target.value = '';
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        if (selectedFiles.length === 0) return;

        setIsCompressing(true);
        try {
            // Compress all files in parallel
            const compressedFiles = await Promise.all(
                selectedFiles.map(file => compressImage(file))
            );

            const formData = new FormData();
            compressedFiles.forEach(file => {
                formData.append('image', file);
            });

            await createAlbum(formData);

            setIsFormOpen(false);
            setSelectedFiles([]);
            setPreviews([]);
            // Tampilkan pesan sukses sebentar sebelum form ditutup/reset
            // Karena form ditutup (isFormOpen=false), kita taruh pesan sukses di form
            // Tapi formnya hilang. Mending tampilkan di luar.
            setSuccessMsg('Album berhasil di-upload dan dibuat!');
            setTimeout(() => setSuccessMsg(''), 5000);
        } catch (error: any) {
            setErrorMsg('Gagal membuat album: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsCompressing(false);
        }
    };

    return (
        <main className="p-6 lg:p-8 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-h)' }}>
                        Gallery Albums
                    </h1>
                    <p className="text-sm" style={{ color: 'var(--text)', opacity: 0.55 }}>
                        Upload up to 5 images per album.
                    </p>
                </div>
                {!isFormOpen && (
                    <button
                        onClick={() => {
                            setIsFormOpen(true);
                            setErrorMsg('');
                            setSuccessMsg('');
                        }}
                        className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150"
                        style={{
                            background: 'var(--accent)',
                            color: 'var(--bg)',
                            border: '1px solid var(--accent)'
                        }}
                    >
                        Create Album
                    </button>
                )}
            </div>

            {/* Global Success Message */}
            {successMsg && !isFormOpen && (
                <div className="mb-6 p-4 rounded-xl flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <span className="text-sm font-medium">{successMsg}</span>
                </div>
            )}

            {/* Form */}
            {isFormOpen && (
                <div className="mb-8 p-5 rounded-2xl" style={{ background: 'var(--accent-bg)', border: '1px solid var(--border)' }}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold" style={{ color: 'var(--text-h)' }}>
                            Upload Images
                        </h2>
                        <button onClick={() => {
                            setIsFormOpen(false);
                            setSelectedFiles([]);
                            setPreviews([]);
                            setErrorMsg('');
                        }} className="text-sm px-3 py-1 rounded-lg transition-colors hover:opacity-70" style={{ color: 'var(--text)' }}>
                            Cancel
                        </button>
                    </div>

                    {/* Inline Error/Success in form */}
                    {errorMsg && (
                        <div className="mb-4 p-4 rounded-xl flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            <span className="text-sm font-medium">{errorMsg}</span>
                        </div>
                    )}
                    {successMsg && (
                        <div className="mb-4 p-4 rounded-xl flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            <span className="text-sm font-medium">{successMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleCreate} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-h)' }}>Select Images (Max 5)</label>

                            <label
                                className="relative flex flex-col items-center justify-center w-full h-40 rounded-2xl border-2 border-dashed transition-all cursor-pointer group"
                                style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                    <div className="w-12 h-12 mb-3 rounded-full flex items-center justify-center bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                    </div>
                                    <p className="mb-1 text-sm font-semibold" style={{ color: 'var(--text-h)' }}>
                                        Click to browse files
                                    </p>
                                    <p className="text-xs" style={{ color: 'var(--text)', opacity: 0.6 }}>
                                        PNG, JPG, WEBP (Maximum 5 images)
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>

                            {/* Previews */}
                            {previews.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                    {previews.map((src, idx) => (
                                        <div key={idx} className="relative w-full aspect-square rounded-xl overflow-hidden border border-white/10 group/preview">
                                            <img src={src} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                            {/* Delete overlay */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newFiles = [...selectedFiles];
                                                    const newPreviews = [...previews];
                                                    newFiles.splice(idx, 1);
                                                    newPreviews.splice(idx, 1);
                                                    setSelectedFiles(newFiles);
                                                    setPreviews(newPreviews);
                                                }}
                                                className="absolute inset-0 bg-black/50 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center text-white"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end mt-2">
                            <button
                                type="submit"
                                disabled={isPending || isCompressing || selectedFiles.length === 0}
                                className="px-6 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80 flex items-center justify-center gap-2"
                                style={{ background: 'var(--accent)', color: 'var(--bg)', opacity: (isPending || isCompressing || selectedFiles.length === 0) ? 0.7 : 1 }}
                            >
                                {isCompressing ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Memproses...
                                    </>
                                ) : isPending ? 'Uploading...' : 'Upload & Create Album'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List Albums */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {albums.length === 0 ? (
                    <div className="col-span-full text-center py-10" style={{ color: 'var(--text)', opacity: 0.5 }}>No albums found.</div>
                ) : (
                    albums.map((album: any) => {
                        const img = album.imageUrl?.[0] || album.image?.[0];
                        return (
                            <div key={album._id} className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-200 group"
                                style={{ background: 'var(--accent-bg)', border: '1px solid var(--border)' }}>
                                <div className="w-full h-48 bg-black/10 relative">
                                    {img ? (
                                        <img src={img} alt={album.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs opacity-50">No Image</div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-sm mb-1 truncate" style={{ color: 'var(--text-h)' }}>
                                        {album.title || 'Untitled Album'}
                                    </h3>
                                    <p className="text-xs" style={{ color: 'var(--text)', opacity: 0.6 }}>
                                        {album._id}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </main>
    );
}