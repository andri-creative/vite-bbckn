import { Icon } from '@iconify/react'
import { motion } from 'motion/react'
import { CERTIFICATES } from '../data/certificates'
import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'

interface CertificateDetailPageProps {
    id: string
}

export default function CertificateDetailPage({ id }: CertificateDetailPageProps) {
    const cert = CERTIFICATES.find((c) => c.id === id)

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    if (!cert) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] px-6">
                <Icon icon="ph:file-dashed-bold" className="w-20 h-20 text-[var(--text)] opacity-20 mb-6" />
                <h1 className="text-3xl font-bold text-[var(--text-h)] mb-4">Certificate Not Found</h1>
                <p className="text-[var(--text)] opacity-60 text-center mb-8">
                    The certificate you're looking for doesn't exist or has been removed.
                </p>
                <Link
                    to="/certificates"
                    className="px-6 py-3 rounded-xl bg-[var(--accent)] text-white font-bold tracking-widest uppercase text-sm hover:shadow-lg transition-all"
                >
                    Back to Certificates
                </Link>
            </div>
        )
    }

    return (
        <main className="relative w-full min-h-screen bg-[var(--bg)] pt-24 pb-32 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-b from-amber-500/20 to-transparent blur-[120px] opacity-30 pointer-events-none rounded-full" />

            <div className="max-w-5xl w-full mx-auto px-6 relative z-10">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-12"
                >
                    <Link
                        to="/certificates"
                        className="inline-flex items-center gap-2 text-[var(--text)] opacity-60 hover:opacity-100 transition-opacity font-medium"
                    >
                        <Icon icon="ph:arrow-left-bold" /> Back to Certificates
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-6 mb-16"
                >
                    <div className="flex flex-wrap items-center gap-4">
                        <span className="px-3 py-1.5 rounded-lg bg-[var(--accent-bg)] border border-[var(--border)] text-[var(--text-h)] text-xs font-bold uppercase tracking-widest shadow-sm">
                            {cert.category}
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 backdrop-blur-md border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-lg">
                            <Icon icon="ph:seal-check-bold" className="w-5 h-5" />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--text-h)] tracking-tight leading-tight">
                        {cert.title}
                    </h1>

                    <p className="text-[var(--text)] opacity-70 text-lg md:text-xl max-w-3xl leading-relaxed">
                        {cert.description}
                    </p>
                </motion.div>

                {/* Cover Image */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col gap-6 mb-20"
                >
                    <div className="relative w-full aspect-[4/3] sm:aspect-video rounded-3xl overflow-hidden border border-[var(--border)] shadow-2xl shadow-amber-500/10">
                        <img
                            src={cert.image}
                            alt={`${cert.title} Certificate`}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        
                        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-10">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-xl border border-white/20 text-white font-black tracking-widest uppercase text-xs shadow-xl">
                                <Icon icon="ph:medal-fill" className="text-amber-400 w-4 h-4" />
                                {cert.issuer}
                            </div>
                            <div className="px-4 py-2 rounded-xl bg-black/40 backdrop-blur-xl border border-white/20 text-white font-bold tracking-widest text-xs shadow-xl">
                                {cert.issueDate}
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Main Content Area */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 flex flex-col gap-10"
                    >
                        <div>
                            <h2 className="text-2xl font-bold text-[var(--text-h)] mb-6 flex items-center gap-3">
                                <Icon icon="ph:info-bold" className="text-amber-500" />
                                Credential Details
                            </h2>
                            <div className="prose prose-invert max-w-none text-[var(--text)] opacity-80 leading-relaxed">
                                <p className="text-base sm:text-lg mb-4">{cert.description}</p>
                                <p className="text-base sm:text-lg">
                                    This certification represents a significant milestone in validating professional skills and competencies in {cert.label}. The rigorous evaluation process ensures that the recipient has met the highest industry standards.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Sidebar Metadata */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col gap-10"
                    >
                        <div className="p-8 rounded-3xl bg-[var(--accent-bg)] border border-[var(--border)] shadow-lg flex flex-col gap-8">
                            <h3 className="text-xl font-bold text-[var(--text-h)] border-b border-[var(--border)] pb-4">
                                Information
                            </h3>

                            <ul className="flex flex-col gap-6">
                                <li className="flex flex-col gap-1">
                                    <span className="text-[var(--text)] opacity-50 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                        <Icon icon="ph:buildings-bold" /> Issued By
                                    </span>
                                    <span className="text-[var(--text-h)] font-medium">{cert.issuer}</span>
                                </li>
                                <li className="flex flex-col gap-1">
                                    <span className="text-[var(--text)] opacity-50 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                        <Icon icon="ph:calendar-bold" /> Issue Date
                                    </span>
                                    <span className="text-[var(--text-h)] font-medium">{cert.issueDate}</span>
                                </li>
                                <li className="flex flex-col gap-1">
                                    <span className="text-[var(--text)] opacity-50 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                        <Icon icon="ph:globe-hemisphere-west-bold" /> Level
                                    </span>
                                    <span className="text-[var(--text-h)] font-medium">{cert.level}</span>
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col gap-4">
                            <h3 className="text-sm font-bold text-[var(--text)] opacity-60 uppercase tracking-widest mb-2">Related Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {cert.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-xs font-bold text-[var(--text-h)] shadow-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Verify Button (Dummy) */}
                        <div className="flex flex-col gap-3 mt-4">
                            <button
                                className="w-full py-4 rounded-xl flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 text-amber-500 text-sm font-extrabold uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all shadow-lg hover:-translate-y-1"
                            >
                                <Icon icon="ph:check-circle-bold" className="w-5 h-5" /> Verify Credential
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    )
}
