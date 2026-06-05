import { Icon } from '@iconify/react'
import { RowsPhotoAlbum } from "react-photo-album"
import "react-photo-album/rows.css"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import { useState, useEffect, useMemo } from "react"
import { useAlbums } from "@/hooks/useAlbum"

export default function AlbumPage() {
    const [lightboxIndex, setLightboxIndex] = useState(-1);
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useAlbums(20);


    console.log(data)

    const photos = useMemo(() => {
        if (!data) return [];
        return data.pages.flatMap((page) =>
            page.data.map((album: any) => ({
                src: album.imageUrl?.[0] || album.image?.[0],
                width: album.width || 800,
                height: album.height || 600,
                alt: album.title || "Album photo",
            }))
        );
    }, [data]);

    // Handle Infinite Scroll
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop
                >= document.documentElement.offsetHeight - 500
            ) {
                if (hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    return (
        <div className="relative w-full min-h-screen flex flex-col items-center px-6 py-24 overflow-hidden">
            <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl w-full relative z-10 flex flex-col gap-16">
                {/* Header */}
                <div className="flex flex-col items-center text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--accent-bg)] text-[var(--accent)] text-xs font-semibold tracking-wider uppercase mb-4 select-none">
                        <Icon icon="ph:images-bold" className="w-3.5 h-3.5" />
                        Gallery
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-h)] tracking-tight mb-3">
                        Album
                    </h1>
                    <p className="text-[var(--text)] opacity-60 text-sm sm:text-base max-w-lg">
                        {/* TODO: subtitle */}
                    </p>
                </div>

                {/* Photo Album */}
                <div className="w-full min-h-[400px]">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Icon icon="line-md:loading-twotone-loop" className="w-8 h-8 text-[var(--accent)]" />
                        </div>
                    ) : (
                        <>
                            <RowsPhotoAlbum
                                photos={photos}
                                spacing={10}
                                targetRowHeight={250}
                                onClick={({ index }) => setLightboxIndex(index)}
                            />

                            <Lightbox
                                open={lightboxIndex >= 0}
                                index={lightboxIndex}
                                slides={photos}
                                close={() => setLightboxIndex(-1)}
                            />

                            {isFetchingNextPage && (
                                <div className="flex justify-center items-center py-10 mt-4">
                                    <Icon icon="line-md:loading-twotone-loop" className="w-6 h-6 text-[var(--accent)]" />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
