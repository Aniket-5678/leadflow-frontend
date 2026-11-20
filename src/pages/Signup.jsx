
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
    ArrowRight,
    CheckCircle2,
    LockKeyhole,
    Mail,
    User,
    Users,
    Zap,
} from "lucide-react";

function Signup() {
    const { signup } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
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
 const toastId = toast.loading("Creating your account...");
        try {
            await signup(formData);
              toast.success("Account created successfully!", {
            id: toastId,
        });
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(
                err.response?.data?.message || "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 lg:p-6">
            <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">

                {/* Left Branding Panel */}
                <div className="relative hidden flex-col justify-between overflow-hidden bg-[#101828] p-12 text-white lg:flex">
                    <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
                                <Users size={23} />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">
                                LeadFlow
                            </span>
                        </div>

                        <div className="mt-24 max-w-lg">
                            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm text-blue-200">
                                <Zap size={15} />
                                Smarter customer management
                            </p>

                            <h1 className="text-5xl font-bold leading-tight tracking-tight">
                                Turn every lead into an opportunity.
                            </h1>

                            <p className="mt-6 text-lg leading-8 text-slate-300">
                                Organize your prospects, manage conversations,
                                and grow your business from one simple workspace.
                            </p>
                        </div>

                        <div className="mt-12 space-y-5">
                            {[
                                "Keep all your leads organized",
                                "Track every lead's progress",
                                "Manage your sales pipeline easily",
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-3 text-slate-200">
                                    <CheckCircle2 className="text-blue-400" size={20} />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="relative z-10 text-sm text-slate-400">
                        © 2026 LeadFlow. Built for better business.
                    </p>
                </div>

                {/* Signup Form */}
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
                                Get started for free
                            </p>

                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                                Create your account
                            </h2>

                            <p className="mt-2 text-slate-500">
                                Start managing your leads more effectively.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-9 space-y-5">
                            {error && (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Full name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        required
                                        autoComplete="name"
                                        className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>
                            </div>

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
                                        className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Minimum 6 characters"
                                        required
                                        minLength={6}
                                        autoComplete="new-password"
                                        className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Creating account..." : "Create account"}
                                {!loading && <ArrowRight size={18} />}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm text-slate-500">
                            Already have an account?{" "}
                            <Link to="/signin" className="font-semibold text-blue-600 hover:text-blue-700">
                                Sign in
                            </Link>
                        </p>

                        <p className="mt-10 text-center text-xs leading-5 text-slate-400">
                            By creating an account, you agree to our Terms of Service
                            and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
