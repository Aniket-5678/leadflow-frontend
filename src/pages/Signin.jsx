
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
    ArrowRight,
    CheckCircle2,
    LockKeyhole,
    Mail,
    Users,
} from "lucide-react";

function Signin() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
    const toastId = toast.loading("Signing you in...");
    
        try {
            await login(formData);
                 toast.success("Login successful! Welcome back.", {
            id: toastId,
        });
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(
                err.response?.data?.message || "Invalid credentials. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 lg:p-6">
            <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">

                {/* Left Branding */}
                <div className="relative hidden flex-col justify-between overflow-hidden bg-[#101828] p-12 text-white lg:flex">
                    <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
                                <Users size={23} />
                            </div>
                            <span className="text-2xl font-bold">LeadFlow</span>
                        </div>

                        <div className="mt-28 max-w-lg">
                            <h1 className="text-5xl font-bold leading-tight tracking-tight">
                                Welcome back to your workspace.
                            </h1>

                            <p className="mt-6 text-lg leading-8 text-slate-300">
                                Your leads, your pipeline, and your business
                                progress — everything in one place.
                            </p>
                        </div>

                        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="text-blue-400" size={22} />
                                <p className="font-medium">Your workspace is ready</p>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                Sign in to continue managing your customer relationships
                                and sales opportunities.
                            </p>
                        </div>
                    </div>

                    <p className="relative z-10 text-sm text-slate-400">
                        © 2026 LeadFlow. Built for better business.
                    </p>
                </div>

                {/* Signin Form */}
                <div className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-16">
                    <div className="w-full max-w-md">
                        <div className="mb-10 lg:hidden">
                            <div className="flex items-center gap-3 text-slate-900">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                                    <Users size={21} />
                                </div>
                                <span className="text-xl font-bold">LeadFlow</span>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                                Welcome back
                            </p>
                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                                Sign in to your account
                            </h2>
                            <p className="mt-2 text-slate-500">
                                Enter your details to access your workspace.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
                            {error && (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Email address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        required
                                        autoComplete="email"
                                        className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="text-sm font-semibold text-slate-700">
                                        Password
                                    </label>
                                </div>
                                <div className="relative">
                                    <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        required
                                        autoComplete="current-password"
                                        className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Signing in..." : "Sign in"}
                                {!loading && <ArrowRight size={18} />}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm text-slate-500">
                            Don't have an account?{" "}
                            <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-700">
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signin;
