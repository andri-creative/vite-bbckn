import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Icon } from '@iconify/react'

interface RatingData {
    star1: number;
    star2: number;
    star3: number;
    star4: number;
    star5: number;
    totalVoters: number;
}

interface FloatingRatingProps {
    submitVote: (rating: number) => Promise<any>;
    averageRating: string;
    ratings?: RatingData | null;
}

export default function FloatingRating({ submitVote, averageRating, ratings }: FloatingRatingProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [hoveredStar, setHoveredStar] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleRate = async (rating: number) => {
        setIsSubmitting(true)

        try {
            await submitVote(rating)
            setIsSuccess(true)
        } catch (error) {
            console.error("Failed to submit rating", error)
        } finally {
            setIsSubmitting(false)

            setTimeout(() => {
                setIsSuccess(false) // Just reset success state, don't close window automatically so they can see results
            }, 2000)
        }
    }

    const renderProgressBar = (starCount: number, value: number, total: number) => {
        const percentage = total > 0 ? (value / total) * 100 : 0;
        return (
            <div key={starCount} className="flex items-center gap-2 w-full text-xs">
                <span className="w-2 font-bold text-[var(--text)] opacity-60">{starCount}</span>
                <Icon icon="ph:star-fill" className="text-amber-500 w-3 h-3" />
                <div className="flex-1 h-2 bg-[var(--border)] rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-amber-500 rounded-full"
                    />
                </div>
                <span className="w-6 text-right font-semibold text-[var(--text)] opacity-80">{value}</span>
            </div>
        )
    }

    return (
        <div className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-50 flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
                        className="bg-[var(--accent-bg)]/80 backdrop-blur-xl border border-[var(--border)] p-6 rounded-3xl shadow-2xl flex flex-col gap-4 min-w-[280px]"
                    >
                        {isSuccess ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center gap-3 text-emerald-500 py-4 w-full"
                            >
                                <Icon icon="ph:check-circle-fill" className="w-12 h-12" />
                                <span className="text-sm font-bold tracking-widest uppercase">Thank You!</span>
                            </motion.div>
                        ) : isSubmitting ? (
                            <div className="flex flex-col items-center gap-3 text-[var(--accent)] py-4 w-full">
                                <Icon icon="ph:spinner-bold" className="w-10 h-10 animate-spin" />
                                <span className="text-xs font-bold tracking-widest uppercase opacity-70">Saving to backend...</span>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center gap-4 w-full"
                            >
                                <h4 className="text-[var(--text-h)] font-bold text-sm uppercase tracking-widest text-center">Rate This Website</h4>
                                <div className="flex items-center gap-1 justify-center" onMouseLeave={() => setHoveredStar(null)}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onMouseEnter={() => setHoveredStar(star)}
                                            onClick={() => handleRate(star)}
                                            className="text-amber-500 hover:scale-125 transition-transform duration-200 outline-none focus:scale-125"
                                        >
                                            <Icon
                                                icon={(hoveredStar !== null && star <= hoveredStar) ? "ph:star-fill" : "ph:star-bold"}
                                                className="w-10 h-10"
                                            />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[10px] text-[var(--text)] opacity-40 text-center uppercase tracking-widest font-semibold mt-[-8px]">
                                    Click a star to vote!
                                </p>
                            </motion.div>
                        )}

                        {/* Rating Statistics */}
                        <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-[var(--border)] w-full">
                            <h5 className="text-xs font-bold uppercase tracking-widest text-[var(--text-h)] text-center mb-1">Live Results</h5>
                            {ratings ? (
                                <>
                                    {renderProgressBar(5, ratings.star5, ratings.totalVoters)}
                                    {renderProgressBar(4, ratings.star4, ratings.totalVoters)}
                                    {renderProgressBar(3, ratings.star3, ratings.totalVoters)}
                                    {renderProgressBar(2, ratings.star2, ratings.totalVoters)}
                                    {renderProgressBar(1, ratings.star1, ratings.totalVoters)}
                                </>
                            ) : (
                                <p className="text-xs text-center text-[var(--text)] opacity-40">Loading stats...</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[var(--accent)] text-white shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.5)] flex items-center justify-center border border-white/20 transition-shadow"
            >
                <Icon icon={isOpen ? "ph:x-bold" : "ph:star-bold"} className="w-6 h-6 sm:w-7 sm:h-7" />

                {/* Average Rating Badge */}
                {!isOpen && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -left-3 sm:-top-2 sm:-left-4 bg-amber-500 text-white text-[10px] sm:text-xs font-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border-2 border-[var(--bg)] shadow-md flex items-center gap-0.5"
                    >
                        {averageRating}
                    </motion.div>
                )}
            </motion.button>
        </div>
    )
}
