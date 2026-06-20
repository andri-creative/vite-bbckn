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
            <div key={starCount} className="flex items-center gap-2 w-full text-[10px]">
                <span className="w-1.5 font-bold text-[var(--text)] opacity-60">{starCount}</span>
                <Icon icon="ph:star-fill" className="text-amber-500 w-2.5 h-2.5" />
                <div className="flex-1 h-1 bg-[var(--border)] rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-amber-500 rounded-full"
                    />
                </div>
                <span className="w-5 text-right font-semibold text-[var(--text)] opacity-80">{value}</span>
            </div>
        )
    }

    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                        className="bg-[var(--accent-bg)]/90 backdrop-blur-xl border border-[var(--border)] p-4 rounded-2xl shadow-xl flex flex-col gap-3 min-w-[220px] max-w-[240px]"
                    >
                        {isSuccess ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center gap-2 text-emerald-500 py-3 w-full"
                            >
                                <Icon icon="ph:check-circle-fill" className="w-9 h-9" />
                                <span className="text-xs font-bold tracking-wider uppercase">Thank You!</span>
                            </motion.div>
                        ) : isSubmitting ? (
                            <div className="flex flex-col items-center gap-2 text-[var(--accent)] py-3 w-full">
                                <Icon icon="ph:spinner-bold" className="w-7 h-7 animate-spin" />
                                <span className="text-[10px] font-bold tracking-wider uppercase opacity-70">Saving vote...</span>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center gap-3 w-full"
                            >
                                <h4 className="text-[var(--text-h)] font-bold text-xs uppercase tracking-wider text-center">Rate This Site</h4>
                                <div className="flex items-center gap-0.5 justify-center" onMouseLeave={() => setHoveredStar(null)}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onMouseEnter={() => setHoveredStar(star)}
                                            onClick={() => handleRate(star)}
                                            className="text-amber-500 hover:scale-115 transition-transform duration-150 outline-none focus:scale-115 p-0.5 cursor-pointer"
                                        >
                                            <Icon
                                                icon={(hoveredStar !== null && star <= hoveredStar) ? "ph:star-fill" : "ph:star-bold"}
                                                className="w-7 h-7 sm:w-8 sm:h-8"
                                            />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[9px] text-[var(--text)] opacity-45 text-center uppercase tracking-wider font-semibold mt-[-6px]">
                                    Click a star to vote!
                                </p>
                            </motion.div>
                        )}

                        {/* Rating Statistics */}
                        <div className="flex flex-col gap-1.5 pt-3 border-t border-[var(--border)]/60 w-full">
                            <h5 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-h)] text-center mb-1">Live Results</h5>
                            {ratings ? (
                                <>
                                    {renderProgressBar(5, ratings.star5, ratings.totalVoters)}
                                    {renderProgressBar(4, ratings.star4, ratings.totalVoters)}
                                    {renderProgressBar(3, ratings.star3, ratings.totalVoters)}
                                    {renderProgressBar(2, ratings.star2, ratings.totalVoters)}
                                    {renderProgressBar(1, ratings.star1, ratings.totalVoters)}
                                </>
                            ) : (
                                <p className="text-[10px] text-center text-[var(--text)] opacity-40 py-1">Loading stats...</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[var(--accent)] text-white shadow-[0_4px_12px_rgba(var(--accent-rgb),0.25)] hover:shadow-[0_6px_20px_rgba(var(--accent-rgb),0.35)] flex items-center justify-center border border-white/10 transition-shadow cursor-pointer"
            >
                <Icon icon={isOpen ? "ph:x-bold" : "ph:star-bold"} className="w-5 h-5 sm:w-5.5 sm:h-5.5" />

                {/* Average Rating Badge */}
                {!isOpen && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -left-2 bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border border-[var(--bg)] shadow-md flex items-center gap-0.5"
                    >
                        {averageRating}
                    </motion.div>
                )}
            </motion.button>
        </div>
    )
}

