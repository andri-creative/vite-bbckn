import { Icon } from '@iconify/react'
import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'

const MY_EMAIL = 'andri.dev.code@gmail.com'

const SOCIALS = [
    { icon: 'ph:github-logo-fill', link: 'https://github.com', label: 'GitHub' },
    { icon: 'ph:linkedin-logo-fill', link: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: 'ph:instagram-logo-fill', link: 'https://instagram.com', label: 'Instagram' },
]

const CONTACT_INFO = [
    { icon: 'ph:envelope-duotone', label: 'Email', value: MY_EMAIL, href: `mailto:${MY_EMAIL}` },
    { icon: 'ph:map-pin-duotone', label: 'Location', value: 'Jakarta, Indonesia', href: null },
    { icon: 'ph:clock-duotone', label: 'Response Time', value: 'Within 24 hours', href: null },
]

/* ─── Input Field ─── */
function InputField({
    label,
    icon,
    ...props
}: { label: string; icon: string } & React.InputHTMLAttributes<HTMLInputElement>) {
    const [focused, setFocused] = useState(false)

    return (
        <div className="flex flex-col gap-1.5">
            <label
                style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: focused ? 'var(--accent)' : 'var(--text)',
                    opacity: focused ? 1 : 0.5,
                    transition: 'all 0.2s ease',
                    paddingLeft: 2,
                }}
            >
                {label}
            </label>
            <div className="relative">
                <div
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex z-10"
                    style={{
                        color: focused ? 'var(--accent)' : 'var(--text)',
                        opacity: focused ? 1 : 0.4,
                        transition: 'all 0.2s ease',
                    }}
                >
                    <Icon icon={icon} className="w-4 h-4" />
                </div>
                <input
                    {...props}
                    onFocus={e => { setFocused(true); props.onFocus?.(e) }}
                    onBlur={e => { setFocused(false); props.onBlur?.(e) }}
                    className="w-full pl-10 pr-4 py-3 rounded-[10px] text-sm outline-none transition-all duration-200"
                    style={{
                        boxSizing: 'border-box',
                        border: `1.5px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
                        background: focused ? 'var(--accent-bg)' : 'var(--bg)',
                        color: 'var(--text-h)',
                        boxShadow: focused ? '0 0 0 3px var(--accent-bg)' : 'none',
                    }}
                />
            </div>
        </div>
    )
}

/* ─── Textarea Field ─── */
function TextareaField({
    label,
    icon,
    ...props
}: { label: string; icon: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    const [focused, setFocused] = useState(false)

    return (
        <div className="flex flex-col gap-1.5">
            <label
                style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: focused ? 'var(--accent)' : 'var(--text)',
                    opacity: focused ? 1 : 0.5,
                    transition: 'all 0.2s ease',
                    paddingLeft: 2,
                }}
            >
                {label}
            </label>
            <div className="relative">
                <div
                    className="absolute left-3.5 top-3 pointer-events-none flex z-10"
                    style={{
                        color: focused ? 'var(--accent)' : 'var(--text)',
                        opacity: focused ? 1 : 0.4,
                        transition: 'all 0.2s ease',
                    }}
                >
                    <Icon icon={icon} className="w-4 h-4" />
                </div>
                <textarea
                    {...props}
                    onFocus={e => { setFocused(true); props.onFocus?.(e) }}
                    onBlur={e => { setFocused(false); props.onBlur?.(e) }}
                    className="w-full pl-10 pr-4 py-3 rounded-[10px] text-sm outline-none transition-all duration-200 resize-none leading-relaxed"
                    style={{
                        boxSizing: 'border-box',
                        border: `1.5px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
                        background: focused ? 'var(--accent-bg)' : 'var(--bg)',
                        color: 'var(--text-h)',
                        boxShadow: focused ? '0 0 0 3px var(--accent-bg)' : 'none',
                    }}
                />
            </div>
        </div>
    )
}

/* ─── Main Page ─── */
export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        const body = `Nama: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
        const mailtoUrl = `mailto:${MY_EMAIL}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`
        window.location.href = mailtoUrl
        setTimeout(() => {
            setIsSubmitting(false)
            setIsSuccess(true)
            setForm({ name: '', email: '', subject: '', message: '' })
            setTimeout(() => setIsSuccess(false), 5000)
        }, 800)
    }

    return (
        <div
            className="min-h-screen relative overflow-hidden"
            style={{ background: 'var(--bg)', padding: '80px 24px 120px' }}
        >
            {/* Background glow blobs */}
            <div className="absolute top-[10%] right-[8%] w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{ background: 'var(--accent)', opacity: 0.045, filter: 'blur(120px)' }} />
            <div className="absolute bottom-[15%] left-[3%] w-[350px] h-[350px] rounded-full pointer-events-none"
                style={{ background: 'var(--accent)', opacity: 0.03, filter: 'blur(90px)' }} />

            <div className="max-w-[1100px] mx-auto relative z-10">

                {/* ── Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-16 text-center"
                >
                    <span
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-[0.12em] uppercase mb-5"
                        style={{
                            border: '1px solid var(--accent-border)',
                            background: 'var(--accent-bg)',
                            color: 'var(--accent)',
                        }}
                    >
                        <Icon icon="ph:paper-plane-tilt-duotone" className="w-3.5 h-3.5" />
                        Get In Touch
                    </span>

                    <h1
                        className="font-extrabold leading-[1.1] tracking-tight mb-4"
                        style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', color: 'var(--text-h)' }}
                    >
                        Let's Work{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, var(--accent), var(--text-h))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            Together
                        </span>
                    </h1>

                    <p
                        className="text-[15px] max-w-[460px] mx-auto leading-[1.7]"
                        style={{ color: 'var(--text)', opacity: 0.6 }}
                    >
                        Have a project in mind or just want to connect? Drop me a message — I'll get back to you within 24 hours.
                    </p>
                </motion.div>

                {/* ── Main Grid ── */}
                <div className="grid gap-7 items-start contact-grid"
                    style={{ gridTemplateColumns: 'minmax(280px, 360px) 1fr' }}
                >

                    {/* ── Left: Info Panel ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col gap-4"
                    >
                        {/* Info card */}
                        <div
                            className="flex flex-col gap-5 p-7 rounded-[18px]"
                            style={{ border: '1px solid var(--border)', background: 'var(--accent-bg)' }}
                        >
                            <div>
                                <h2 className="text-base font-bold mb-1.5" style={{ color: 'var(--text-h)' }}>
                                    Contact Information
                                </h2>
                                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text)', opacity: 0.55 }}>
                                    Feel free to reach out through any of these channels.
                                </p>
                            </div>

                            <div className="flex flex-col gap-0.5">
                                {CONTACT_INFO.map(item => (
                                    <ContactItem key={item.label} item={item} />
                                ))}
                            </div>

                            {/* Divider */}
                            <div className="h-px" style={{ background: 'var(--border)' }} />

                            {/* Socials */}
                            <div className="flex flex-col gap-2.5">
                                <span
                                    className="text-[11px] font-bold tracking-[0.1em] uppercase"
                                    style={{ color: 'var(--text)', opacity: 0.4 }}
                                >
                                    Follow Me
                                </span>
                                <div className="flex gap-2">
                                    {SOCIALS.map(s => (
                                        <a
                                            key={s.label}
                                            href={s.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            title={s.label}
                                            className="social-icon-btn flex-1 py-2.5 rounded-[10px] flex flex-col items-center justify-center gap-1.5 no-underline transition-all duration-200"
                                            style={{
                                                border: '1px solid var(--border)',
                                                background: 'var(--bg)',
                                                color: 'var(--text)',
                                            }}
                                        >
                                            <Icon icon={s.icon} className="w-5 h-5" />
                                            <span className="text-[10px] font-semibold tracking-wide">{s.label}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Availability badge */}
                        <div className="flex items-center gap-3 px-4 py-3.5 rounded-[14px]"
                            style={{
                                border: '1px solid rgba(34,197,94,0.3)',
                                background: 'rgba(34,197,94,0.05)',
                            }}
                        >
                            <div className="relative shrink-0">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#22c55e' }} />
                                <div
                                    className="absolute inset-[-3px] rounded-full"
                                    style={{ background: '#22c55e', opacity: 0.25, animation: 'ping 2s cubic-bezier(0,0,0.2,1) infinite' }}
                                />
                            </div>
                            <div>
                                <div className="text-[13px] font-semibold leading-snug" style={{ color: 'var(--text-h)' }}>
                                    Available for projects
                                </div>
                                <div className="text-[11.5px] mt-0.5" style={{ color: 'var(--text)', opacity: 0.5 }}>
                                    Open to freelance & collaborations
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Right: Contact Form ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div
                            className="relative rounded-[18px] overflow-hidden"
                            style={{
                                padding: '32px',
                                border: '1px solid var(--border)',
                                background: 'var(--bg)',
                            }}
                        >
                            {/* Top accent line */}
                            <div className="absolute top-0 left-0 right-0 h-0.5 opacity-50"
                                style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }} />

                            {/* Success overlay */}
                            <AnimatePresence>
                                {isSuccess && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-[18px] z-10 p-10 text-center"
                                        style={{ background: 'var(--bg)', backdropFilter: 'blur(20px)' }}
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 20 }}
                                            className="w-[68px] h-[68px] rounded-full flex items-center justify-center"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))',
                                                border: '1px solid rgba(34,197,94,0.2)',
                                            }}
                                        >
                                            <Icon icon="ph:check-bold" className="w-8 h-8" style={{ color: '#22c55e' }} />
                                        </motion.div>
                                        <div>
                                            <h3 className="text-xl font-extrabold mb-2" style={{ color: 'var(--text-h)' }}>
                                                Email Client Opened!
                                            </h3>
                                            <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--text)', opacity: 0.6 }}>
                                                Your message is ready to send from your email client.<br />
                                                I'll get back to you within 24 hours. ✨
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
                                <div className="mb-1">
                                    <h2 className="text-[19px] font-bold mb-1" style={{ color: 'var(--text-h)' }}>
                                        Send a Message
                                    </h2>
                                    <p className="text-[13px]" style={{ color: 'var(--text)', opacity: 0.45 }}>
                                        All fields are required.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3.5 form-name-email-grid">
                                    <InputField label="Your Name" icon="ph:user-duotone"
                                        type="text" name="name" value={form.name}
                                        onChange={handleChange} required placeholder="John Doe" />
                                    <InputField label="Email Address" icon="ph:envelope-duotone"
                                        type="email" name="email" value={form.email}
                                        onChange={handleChange} required placeholder="john@example.com" />
                                </div>

                                <InputField label="Subject" icon="ph:tag-duotone"
                                    type="text" name="subject" value={form.subject}
                                    onChange={handleChange} required placeholder="Project Inquiry" />

                                <TextareaField label="Your Message" icon="ph:chat-circle-duotone"
                                    name="message" value={form.message}
                                    onChange={handleChange} required rows={5}
                                    placeholder="Tell me about your project, timeline, and budget..." />

                                {/* Submit button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="send-btn w-full flex items-center justify-center gap-2 py-[15px] px-7 rounded-xl border-none text-white text-[15px] font-bold tracking-[0.04em] transition-all duration-200 mt-0.5 cursor-pointer"
                                    style={{
                                        background: 'var(--accent)',
                                        opacity: isSubmitting ? 0.7 : 1,
                                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
                                    }}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Icon icon="ph:spinner-bold" className="w-[17px] h-[17px]"
                                                style={{ animation: 'spin 1s linear infinite' }} />
                                            Opening Email Client...
                                        </>
                                    ) : (
                                        <>
                                            <Icon icon="ph:paper-plane-right-duotone" className="w-[17px] h-[17px]" />
                                            Send Message
                                        </>
                                    )}
                                </button>

                                <p className="text-[11.5px] text-center" style={{ color: 'var(--text)', opacity: 0.35 }}>
                                    By submitting, your email client will open with the message pre-filled.
                                </p>
                            </form>
                        </div>
                    </motion.div>

                </div>
            </div>

            <style>{`
                @keyframes ping {
                    75%, 100% { transform: scale(2.2); opacity: 0; }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .send-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 36px rgba(0,0,0,0.25) !important;
                    filter: brightness(1.1);
                }
                .send-btn:active:not(:disabled) {
                    transform: translateY(0px);
                }
                .social-icon-btn:hover {
                    border-color: var(--accent-border) !important;
                    color: var(--accent) !important;
                    background: var(--accent-bg) !important;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 14px rgba(0,0,0,0.12);
                }
                .contact-item-link:hover {
                    background: var(--accent-bg) !important;
                }
                .contact-item-link:hover .contact-item-icon {
                    background: var(--accent) !important;
                    color: #fff !important;
                    border-color: var(--accent) !important;
                }
                input::placeholder, textarea::placeholder {
                    color: var(--text);
                    opacity: 0.28;
                }
                @media (max-width: 720px) {
                    .contact-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .form-name-email-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    )
}

/* ─── Contact Item ─── */
function ContactItem({ item }: { item: typeof CONTACT_INFO[0] }) {
    const inner = (
        <div
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-all duration-200 ${item.href ? 'contact-item-link cursor-pointer' : 'cursor-default'}`}
        >
            <div
                className="contact-item-icon w-[38px] h-[38px] rounded-[9px] flex items-center justify-center shrink-0 transition-all duration-200"
                style={{
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    color: 'var(--accent)',
                }}
            >
                <Icon icon={item.icon} className="w-[17px] h-[17px]" />
            </div>
            <div>
                <div className="text-[10.5px] font-bold tracking-[0.08em] uppercase" style={{ color: 'var(--text)', opacity: 0.4 }}>
                    {item.label}
                </div>
                <div className="text-[13.5px] font-semibold mt-0.5" style={{ color: 'var(--text-h)' }}>
                    {item.value}
                </div>
            </div>
        </div>
    )

    return item.href ? (
        <a href={item.href} className="no-underline">{inner}</a>
    ) : inner
}
