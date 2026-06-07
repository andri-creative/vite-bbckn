import { useState } from "react";
import { motion } from "motion/react";
import { Icon } from "@iconify/react";
import { useNavigate } from "@tanstack/react-router";
import { useLogin } from "../../hooks/useAuth";

export default function AdminSignInPage() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    
    const { mutateAsync: login, isPending: isSubmitting } = useLogin();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        
        try {
            const data = await login({
                emailOrUsername: identifier,
                password: password
            });

            if (data.success) {
                const userData = data.data;
                // Save the session token
                localStorage.setItem('x-cokis', userData['x-cokis']);
                // Optionally save user info
                localStorage.setItem('user', JSON.stringify(userData));
                
                // Redirect to admin dashboard
                navigate({ to: '/admin/bio' });
            }
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || "An error occurred during login");
        }
    };

    return (
        <main className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 mb-6 shadow-lg shadow-blue-500/30"
                        >
                            <Icon icon="solar:shield-keyhole-bold-duotone" className="w-8 h-8 text-white" />
                        </motion.div>
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Admin Portal</h1>
                        <p className="text-neutral-400 text-sm">Please sign in to access the dashboard</p>
                    </div>

                    {errorMessage && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400"
                        >
                            <Icon icon="solar:danger-triangle-bold-duotone" className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm font-medium">{errorMessage}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-neutral-300 ml-1">Email or Username</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Icon icon="solar:user-bold-duotone" className="w-5 h-5 text-neutral-500 group-focus-within:text-blue-400 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder="admin@example.com"
                                    className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/5 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-neutral-300 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Icon icon="solar:lock-password-bold-duotone" className="w-5 h-5 text-neutral-500 group-focus-within:text-blue-400 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/5 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <Icon icon="line-md:loading-twotone-loop" className="w-5 h-5" />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <Icon icon="solar:login-3-bold" className="w-5 h-5" />
                                </>
                            )}
                        </motion.button>
                    </form>
                </div>

                <p className="text-center text-neutral-500 text-sm mt-8">
                    Secure Admin Authentication Portal
                </p>
            </motion.div>
        </main>
    );
}