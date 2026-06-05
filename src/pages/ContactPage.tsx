import { Icon } from '@iconify/react'
import { motion } from 'motion/react'
import { useState } from 'react'

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        // Simulate network request
        setTimeout(() => {
            setIsSubmitting(false)
            setIsSuccess(true)
            setTimeout(() => setIsSuccess(false), 3000)
        }, 1500)
    }

    return (
        <div className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-24 overflow-hidden bg-[var(--bg)]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent)]/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-6xl w-full relative z-10 flex flex-col gap-16">
                {/* Header */}
                <div className="flex flex-col items-center text-center">
                    <motion.span 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--accent-bg)]/50 backdrop-blur-md text-[var(--accent)] text-xs font-bold tracking-widest uppercase mb-6 shadow-xl"
                    >
                        <Icon icon="ph:paper-plane-tilt-bold" className="w-4 h-4" />
                        Get In Touch
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[var(--text-h)] to-[var(--text-h)]/50 tracking-tighter mb-6"
                    >
                        Contact Me
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[var(--text)] opacity-70 text-lg max-w-xl leading-relaxed font-medium"
                    >
                        Have a project in mind, or just want to say hi? Feel free to reach out. I'm always open to discussing new projects, creative ideas or opportunities.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 w-full mt-4">
                    {/* Contact Info */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col gap-10"
                    >
                        <div className="flex flex-col gap-6">
                            <h2 className="text-2xl font-bold text-[var(--text-h)] flex items-center gap-3">
                                <Icon icon="ph:chats-bold" className="text-[var(--accent)]" />
                                Let's Talk
                            </h2>
                            <p className="text-[var(--text)] opacity-70 leading-relaxed">
                                Whether you have a question, a project proposal, or just want to connect, my inbox is always open. I'll try my best to get back to you as soon as possible!
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <a href="mailto:hello@andricreative.com" className="group flex items-center gap-5 p-5 sm:p-6 rounded-2xl bg-[var(--accent-bg)]/30 backdrop-blur-md border border-[var(--border)] hover:border-[var(--accent)]/50 hover:bg-[var(--accent-bg)] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center group-hover:scale-110 group-hover:bg-[var(--accent)] group-hover:text-white transition-all duration-300">
                                    <Icon icon="ph:envelope-simple-bold" className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[var(--text)] opacity-50">Email</span>
                                    <span className="text-[var(--text-h)] font-semibold text-base sm:text-lg">hello@andricreative.com</span>
                                </div>
                            </a>

                            <div className="group flex items-center gap-5 p-5 sm:p-6 rounded-2xl bg-[var(--accent-bg)]/30 backdrop-blur-md border border-[var(--border)] hover:border-[var(--accent)]/50 hover:bg-[var(--accent-bg)] transition-all duration-300 shadow-lg hover:-translate-y-1">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center group-hover:scale-110 group-hover:bg-[var(--accent)] group-hover:text-white transition-all duration-300">
                                    <Icon icon="ph:map-pin-bold" className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[var(--text)] opacity-50">Location</span>
                                    <span className="text-[var(--text-h)] font-semibold text-base sm:text-lg">Jakarta, Indonesia</span>
                                </div>
                            </div>
                        </div>

                        {/* Socials */}
                        <div className="flex flex-col gap-5 mt-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-[var(--text)] opacity-50">Social Profiles</span>
                            <div className="flex flex-wrap gap-4">
                                {[
                                    { icon: "ph:github-logo-bold", link: "https://github.com" },
                                    { icon: "ph:linkedin-logo-bold", link: "https://linkedin.com" },
                                    { icon: "ph:twitter-logo-bold", link: "https://twitter.com" },
                                    { icon: "ph:instagram-logo-bold", link: "https://instagram.com" }
                                ].map((social, idx) => (
                                    <a key={idx} href={social.link} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl bg-[var(--accent-bg)] border border-[var(--border)] flex items-center justify-center text-[var(--text)] hover:text-white hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                                        <Icon icon={social.icon} className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="w-full"
                    >
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 sm:p-10 rounded-3xl bg-[var(--accent-bg)]/40 backdrop-blur-xl border border-[var(--border)] shadow-2xl relative overflow-hidden">
                            {isSuccess && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-[var(--bg)]/95 backdrop-blur-xl p-8 text-center"
                                >
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-2">
                                        <Icon icon="ph:check-bold" className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[var(--text-h)]">Message Sent!</h3>
                                    <p className="text-[var(--text)] opacity-70">Thank you for reaching out. I'll get back to you as soon as possible.</p>
                                </motion.div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-[var(--text)] opacity-60 ml-1">Your Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text)] opacity-40 group-focus-within:text-[var(--accent)] group-focus-within:opacity-100 transition-colors">
                                            <Icon icon="ph:user-bold" className="w-5 h-5" />
                                        </div>
                                        <input 
                                            type="text" 
                                            required
                                            placeholder="John Doe"
                                            className="w-full pl-11 pr-4 py-3.5 bg-[var(--bg)]/50 border border-[var(--border)] rounded-xl outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/50 text-[var(--text)] transition-all placeholder:text-[var(--text)] placeholder:opacity-30"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-[var(--text)] opacity-60 ml-1">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text)] opacity-40 group-focus-within:text-[var(--accent)] group-focus-within:opacity-100 transition-colors">
                                            <Icon icon="ph:envelope-simple-bold" className="w-5 h-5" />
                                        </div>
                                        <input 
                                            type="email" 
                                            required
                                            placeholder="john@example.com"
                                            className="w-full pl-11 pr-4 py-3.5 bg-[var(--bg)]/50 border border-[var(--border)] rounded-xl outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/50 text-[var(--text)] transition-all placeholder:text-[var(--text)] placeholder:opacity-30"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-[var(--text)] opacity-60 ml-1">Subject</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text)] opacity-40 group-focus-within:text-[var(--accent)] group-focus-within:opacity-100 transition-colors">
                                        <Icon icon="ph:tag-bold" className="w-5 h-5" />
                                    </div>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="Project Inquiry"
                                        className="w-full pl-11 pr-4 py-3.5 bg-[var(--bg)]/50 border border-[var(--border)] rounded-xl outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/50 text-[var(--text)] transition-all placeholder:text-[var(--text)] placeholder:opacity-30"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-[var(--text)] opacity-60 ml-1">Your Message</label>
                                <div className="relative group">
                                    <div className="absolute top-4 left-0 pl-4 flex pointer-events-none text-[var(--text)] opacity-40 group-focus-within:text-[var(--accent)] group-focus-within:opacity-100 transition-colors">
                                        <Icon icon="ph:chat-circle-text-bold" className="w-5 h-5" />
                                    </div>
                                    <textarea 
                                        required
                                        rows={5}
                                        placeholder="Tell me about your project..."
                                        className="w-full pl-11 pr-4 py-3.5 bg-[var(--bg)]/50 border border-[var(--border)] rounded-xl outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/50 text-[var(--text)] transition-all resize-none placeholder:text-[var(--text)] placeholder:opacity-30"
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full py-4 mt-2 bg-[var(--accent)] text-white rounded-xl font-bold uppercase tracking-widest text-sm hover:shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Icon icon="ph:spinner-bold" className="w-5 h-5 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Icon icon="ph:paper-plane-right-bold" className="w-5 h-5" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
