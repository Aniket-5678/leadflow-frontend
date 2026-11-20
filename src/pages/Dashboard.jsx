
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

import {
    LayoutDashboard,
    Users,
    Plus,
    Search,
    Filter,
    LogOut,
    Menu,
    X,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    TrendingUp,
    UserPlus,
    Phone,
    Mail,
    Building2,
    Globe,
    UserRound,
    CalendarDays,
    MoreHorizontal,
    RefreshCw,
    XCircle,
    CheckCircle2,
    Clock3,
    CircleAlert,
} from "lucide-react";

const STATUSES = ["New", "Contacted", "Qualified", "Lost"];

const SOURCES = ["Website", "Referral", "Social Media", "Other"];

const EMPTY_FORM = {
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "Website",
    status: "New",
};

const STATUS_STYLES = {
    New: "bg-blue-50 text-blue-700 ring-blue-600/20",
    Contacted: "bg-amber-50 text-amber-700 ring-amber-600/20",
    Qualified: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    Lost: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sourceFilter, setSourceFilter] = useState("All");
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingLead, setEditingLead] = useState(null);
    const [deletingLead, setDeletingLead] = useState(null);

    const [formData, setFormData] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    const ITEMS_PER_PAGE = 8;

    // Fetch all leads belonging to the logged-in user
    const fetchLeads = async (showRefresh = false) => {
        try {
            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const { data } = await API.get("/leads");

            const fetchedLeads =
                data.leads ||
                data.data ||
                [];

            setLeads(Array.isArray(fetchedLeads) ? fetchedLeads : []);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to fetch leads"
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    // Dashboard statistics
    const stats = useMemo(() => {
        return {
            total: leads.length,
            new: leads.filter((lead) => lead.status === "New").length,
            contacted: leads.filter((lead) => lead.status === "Contacted").length,
            qualified: leads.filter((lead) => lead.status === "Qualified").length,
            lost: leads.filter((lead) => lead.status === "Lost").length,
        };
    }, [leads]);

    // Search, filters and sorting
    const filteredLeads = useMemo(() => {
        let result = [...leads];

        if (search.trim()) {
            const keyword = search.toLowerCase().trim();

            result = result.filter((lead) =>
                [
                    lead.name,
                    lead.email,
                    lead.phone,
                    lead.company,
                ].some((value) =>
                    String(value || "").toLowerCase().includes(keyword)
                )
            );
        }

        if (statusFilter !== "All") {
            result = result.filter(
                (lead) => lead.status === statusFilter
            );
        }

        if (sourceFilter !== "All") {
            result = result.filter(
                (lead) => lead.source === sourceFilter
            );
        }

        if (sortBy === "newest") {
            result.sort(
                (a, b) =>
                    new Date(b.createdAt || 0) -
                    new Date(a.createdAt || 0)
            );
        } else if (sortBy === "oldest") {
            result.sort(
                (a, b) =>
                    new Date(a.createdAt || 0) -
                    new Date(b.createdAt || 0)
            );
        } else if (sortBy === "name") {
            result.sort((a, b) =>
                (a.name || "").localeCompare(b.name || "")
            );
        }

        return result;
    }, [leads, search, statusFilter, sourceFilter, sortBy]);

    // Pagination
    const totalPages = Math.max(
        1,
        Math.ceil(filteredLeads.length / ITEMS_PER_PAGE)
    );

    const paginatedLeads = filteredLeads.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter, sourceFilter, sortBy]);

    // Open create modal
    const openCreateModal = () => {
        setEditingLead(null);
        setFormData(EMPTY_FORM);
        setModalOpen(true);
    };

    // Open edit modal
    const openEditModal = (lead) => {
        setEditingLead(lead);

        setFormData({
            name: lead.name || "",
            email: lead.email || "",
            phone: lead.phone || "",
            company: lead.company || "",
            source: lead.source || "Website",
            status: lead.status || "New",
        });

        setModalOpen(true);
    };

    // Handle form input
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Create or update lead
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.phone.trim()
        ) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            setSaving(true);

            if (editingLead) {
                const { data } = await API.put(
                    `/leads/${editingLead._id}`,
                    formData
                );

                const updatedLead = data.lead || data.data;

                setLeads((prev) =>
                    prev.map((lead) =>
                        lead._id === editingLead._id
                            ? updatedLead || { ...lead, ...formData }
                            : lead
                    )
                );

                toast.success("Lead updated successfully");
            } else {
                const { data } = await API.post(
                    "/leads",
                    formData
                );

                const newLead = data.lead || data.data;

                if (newLead) {
                    setLeads((prev) => [newLead, ...prev]);
                } else {
                    await fetchLeads();
                }

                toast.success("New lead created successfully");
            }

            setModalOpen(false);
            setEditingLead(null);
            setFormData(EMPTY_FORM);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );
        } finally {
            setSaving(false);
        }
    };

    // Delete lead
    const handleDelete = async () => {
        if (!deletingLead) return;

        try {
            await API.delete(`/leads/${deletingLead._id}`);

            setLeads((prev) =>
                prev.filter(
                    (lead) => lead._id !== deletingLead._id
                )
            );

            toast.success("Lead deleted successfully");
            setDeletingLead(null);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to delete lead"
            );
        }
    };

    // Logout
    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate("/signin", { replace: true });
    };

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("All");
        setSourceFilter("All");
        setSortBy("newest");
    };

    return (
        <div className="min-h-screen bg-[#f6f8fc] text-slate-800">

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-[255px] flex-col border-r border-white/10 bg-[#111827] text-white transition-transform duration-300 lg:translate-x-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-900/30">
                            <Users size={21} />
                        </div>

                        <div>
                            <h1 className="text-[17px] font-bold tracking-tight">
                                LeadFlow
                            </h1>
                            <p className="text-[10px] tracking-[2px] text-slate-400">
                                MANAGEMENT CRM
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden"
                    >
                        <X size={19} />
                    </button>
                </div>

                <div className="px-4 pt-8">
                    <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[2px] text-slate-500">
                        Workspace
                    </p>

                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="flex w-full items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-left text-sm font-medium text-white shadow-lg shadow-blue-950/30"
                    >
                        <LayoutDashboard size={18} />
                        Dashboard
                    </button>

                    <button
                        onClick={() => {
                            clearFilters();
                            setSidebarOpen(false);
                        }}
                        className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
                    >
                        <Users size={18} />
                        All Leads
                        <span className="ml-auto rounded-md bg-white/10 px-2 py-0.5 text-[10px]">
                            {leads.length}
                        </span>
                    </button>
                </div>

                <div className="mt-8 px-4">
                    <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[2px] text-slate-500">
                        Quick Actions
                    </p>

                    <button
                        onClick={() => {
                            openCreateModal();
                            setSidebarOpen(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
                    >
                        <Plus size={18} />
                        Add New Lead
                    </button>
                </div>

                <div className="mt-auto p-4">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <div className="mb-3 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 text-sm font-bold">
                                {user?.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-xs font-semibold text-white">
                                    {user?.name || "User"}
                                </p>
                                <p className="truncate text-[10px] text-slate-400">
                                    {user?.email || ""}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-400"
                        >
                            <LogOut size={15} />
                            Sign out
                        </button>
                    </div>

                    <p className="mt-4 text-center text-[10px] text-slate-600">
                        LeadFlow CRM © 2026
                    </p>
                </div>
            </aside>

            {/* Main Content */}
            <div className="min-h-screen lg:pl-[255px]">

                {/* Top Navbar */}
                <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur-xl sm:px-6 lg:px-9">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 lg:hidden"
                        >
                            <Menu size={19} />
                        </button>

                        <div>
                            <p className="text-[11px] text-slate-400">
                                Workspace / Overview
                            </p>
                            <h2 className="text-sm font-bold text-slate-800 sm:text-base">
                                Dashboard
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            onClick={() => fetchLeads(true)}
                            disabled={refreshing}
                            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:bg-slate-50 hover:text-blue-600"
                            title="Refresh leads"
                        >
                            <RefreshCw
                                size={17}
                                className={refreshing ? "animate-spin" : ""}
                            />
                        </button>

                        <div className="hidden items-center gap-2 border-l border-slate-200 pl-4 sm:flex">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
                                {user?.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>

                            <div className="max-w-[140px]">
                                <p className="truncate text-xs font-semibold text-slate-800">
                                    {user?.name}
                                </p>
                                <p className="text-[10px] text-slate-400">
                                    Account
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 sm:py-8 lg:px-9">

                    {/* Welcome Section */}
                    <section className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                        <div>
                            <p className="mb-1 text-xs font-medium text-blue-600">
                                YOUR BUSINESS AT A GLANCE
                            </p>

                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
                                Welcome back, {user?.name?.split(" ")[0] || "there"}!
                            </h1>

                            <p className="mt-1.5 text-xs text-slate-500 sm:text-sm">
                                Here's what's happening with your leads today.
                            </p>
                        </div>

                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/25 sm:text-sm"
                        >
                            <Plus size={17} />
                            New Lead
                        </button>
                    </section>

                    {/* Statistics Cards */}
                    <section className="mb-8 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 xl:grid-cols-5">

                        <StatCard
                            title="Total Leads"
                            value={stats.total}
                            icon={Users}
                            iconStyle="bg-blue-50 text-blue-600"
                            description="All your leads"
                        />

                        <StatCard
                            title="New Leads"
                            value={stats.new}
                            icon={UserPlus}
                            iconStyle="bg-indigo-50 text-indigo-600"
                            description="Recently added"
                        />

                        <StatCard
                            title="Contacted"
                            value={stats.contacted}
                            icon={Phone}
                            iconStyle="bg-amber-50 text-amber-600"
                            description="In conversation"
                        />

                        <StatCard
                            title="Qualified"
                            value={stats.qualified}
                            icon={CheckCircle2}
                            iconStyle="bg-emerald-50 text-emerald-600"
                            description="Potential customers"
                        />

                        <StatCard
                            title="Lost"
                            value={stats.lost}
                            icon={XCircle}
                            iconStyle="bg-rose-50 text-rose-600"
                            description="Closed leads"
                        />
                    </section>

                    {/* Lead Management */}
                    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_25px_rgba(15,23,42,0.035)]">

                        {/* Table Header */}
                        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:px-6">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">
                                    Lead Management
                                </h3>
                                <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">
                                    Manage, track and organize your leads
                                </p>
                            </div>

                            <button
                                onClick={openCreateModal}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-600"
                            >
                                <Plus size={15} />
                                Add Lead
                            </button>
                        </div>

                        {/* Search and Filters */}
                        <div className="grid grid-cols-1 gap-3 border-b border-slate-100 bg-slate-50/60 p-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">

                            <div className="relative sm:col-span-2 lg:col-span-1">
                                <Search
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    placeholder="Search leads..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div className="relative">
                                <Filter
                                    size={14}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="All">All Statuses</option>
                                    {STATUSES.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <select
                                    value={sourceFilter}
                                    onChange={(e) => setSourceFilter(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="All">All Sources</option>
                                    {SOURCES.map((source) => (
                                        <option key={source} value={source}>
                                            {source}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="relative">
                                <ArrowUpDown
                                    size={14}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="name">Name A-Z</option>
                                </select>
                            </div>
                        </div>

                        {/* Result Count */}
                        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 sm:px-6">
                            <p className="text-[11px] text-slate-500">
                                Showing{" "}
                                <span className="font-semibold text-slate-800">
                                    {filteredLeads.length === 0
                                        ? 0
                                        : (currentPage - 1) * ITEMS_PER_PAGE + 1}
                                    -
                                    {Math.min(
                                        currentPage * ITEMS_PER_PAGE,
                                        filteredLeads.length
                                    )}
                                </span>{" "}
                                of{" "}
                                <span className="font-semibold text-slate-800">
                                    {filteredLeads.length}
                                </span>{" "}
                                leads
                            </p>

                            {(search || statusFilter !== "All" || sourceFilter !== "All") && (
                                <button
                                    onClick={clearFilters}
                                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>

                        {/* Leads Table */}
                        <div className="w-full overflow-x-auto">
                            <table className="w-full min-w-[850px] text-left">
                                <thead>
                                    <tr className="border-y border-slate-100 bg-slate-50/70">
                                        <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                            Lead
                                        </th>

                                        <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                            Contact
                                        </th>

                                        <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                            Company
                                        </th>

                                        <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                            Source
                                        </th>

                                        <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                            Status
                                        </th>

                                        <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                            Created
                                        </th>

                                        <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="7" className="py-20 text-center">
                                                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-[3px] border-blue-600 border-t-transparent" />
                                                <p className="mt-3 text-xs text-slate-400">
                                                    Loading your leads...
                                                </p>
                                            </td>
                                        </tr>
                                    ) : paginatedLeads.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-4 py-20 text-center">
                                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                                    <Users size={25} />
                                                </div>

                                                <h4 className="mt-4 text-sm font-bold text-slate-800">
                                                    No leads found
                                                </h4>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    {leads.length === 0
                                                        ? "Start by adding your first lead."
                                                        : "Try changing your search or filters."}
                                                </p>

                                                {leads.length === 0 ? (
                                                    <button
                                                        onClick={openCreateModal}
                                                        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                                                    >
                                                        Add your first lead
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={clearFilters}
                                                        className="mt-4 text-xs font-semibold text-blue-600"
                                                    >
                                                        Clear filters
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedLeads.map((lead) => (
                                            <tr
                                                key={lead._id}
                                                className="group transition hover:bg-blue-50/30"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 text-xs font-bold text-blue-700">
                                                            {lead.name?.charAt(0)?.toUpperCase() || "L"}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="max-w-[160px] truncate text-xs font-semibold text-slate-800">
                                                                {lead.name}
                                                            </p>
                                                            <p className="mt-1 text-[10px] text-slate-400">
                                                                Lead ID: {lead._id?.slice(-6)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <p className="flex items-center gap-1.5 text-[11px] text-slate-600">
                                                        <Mail size={12} className="text-slate-400" />
                                                        {lead.email}
                                                    </p>
                                                    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-400">
                                                        <Phone size={12} />
                                                        {lead.phone}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <p className="flex items-center gap-1.5 text-xs text-slate-600">
                                                        <Building2 size={13} className="text-slate-400" />
                                                        {lead.company || "—"}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-600">
                                                        <Globe size={13} className="text-slate-400" />
                                                        {lead.source}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${
                                                            STATUS_STYLES[lead.status] ||
                                                            "bg-slate-100 text-slate-600 ring-slate-200"
                                                        }`}
                                                    >
                                                        {lead.status}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="flex items-center gap-1.5 whitespace-nowrap text-[11px] text-slate-500">
                                                        <CalendarDays size={12} />
                                                        {formatDate(lead.createdAt)}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="flex justify-end gap-1">
                                                        <button
                                                            onClick={() => openEditModal(lead)}
                                                            title="Edit lead"
                                                            className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                                                        >
                                                            <Pencil size={15} />
                                                        </button>

                                                        <button
                                                            onClick={() => setDeletingLead(lead)}
                                                            title="Delete lead"
                                                            className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {!loading && filteredLeads.length > 0 && (
                            <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:px-6">
                                <p className="text-[11px] text-slate-400">
                                    Page {currentPage} of {totalPages}
                                </p>

                                <div className="flex items-center gap-1.5">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage((p) => p - 1)}
                                        className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <ChevronLeft size={15} />
                                    </button>

                                    {Array.from(
                                        { length: totalPages },
                                        (_, i) => i + 1
                                    )
                                        .filter((page) =>
                                            page === 1 ||
                                            page === totalPages ||
                                            Math.abs(page - currentPage) <= 1
                                        )
                                        .map((page, index, array) => (
                                            <span key={page} className="contents">
                                                {index > 0 && array[index - 1] !== page - 1 && (
                                                    <span className="px-1 text-xs text-slate-400">
                                                        ...
                                                    </span>
                                                )}

                                                <button
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`h-8 min-w-8 rounded-lg px-2 text-xs font-semibold transition ${
                                                        currentPage === page
                                                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                                            : "border border-slate-200 text-slate-500 hover:bg-slate-50"
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            </span>
                                        ))}

                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage((p) => p + 1)}
                                        className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <ChevronRight size={15} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>

                    <footer className="py-6 text-center text-[10px] text-slate-400">
                        LeadFlow CRM · Manage your leads with confidence
                    </footer>
                </main>
            </div>

            {/* Create / Edit Lead Modal */}
            {modalOpen && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-3 backdrop-blur-sm sm:p-5"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget && !saving) {
                            setModalOpen(false);
                        }
                    }}
                >
                    <div className="my-auto w-full max-w-[540px] overflow-hidden rounded-2xl border border-white/60 bg-white shadow-2xl shadow-slate-950/20">
                        <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50/60 px-5 py-4 sm:px-6">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">
                                    {editingLead ? "Edit Lead" : "Create New Lead"}
                                </h3>
                                <p className="mt-1 text-[11px] text-slate-500">
                                    {editingLead
                                        ? "Update the lead information below."
                                        : "Enter the details to add a new lead."}
                                </p>
                            </div>

                            <button
                                onClick={() => setModalOpen(false)}
                                disabled={saving}
                                className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-slate-700"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 sm:p-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <FormField label="Full Name" required>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Rahul Sharma"
                                        required
                                        className="form-input"
                                    />
                                </FormField>

                                <FormField label="Email Address" required>
                                    <input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="rahul@example.com"
                                        required
                                        className="form-input"
                                    />
                                </FormField>

                                <FormField label="Phone Number" required>
                                    <input
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="9876543210"
                                        required
                                        className="form-input"
                                    />
                                </FormField>

                                <FormField label="Company">
                                    <input
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        placeholder="Company name"
                                        className="form-input"
                                    />
                                </FormField>

                                <FormField label="Lead Source" required>
                                    <select
                                        name="source"
                                        value={formData.source}
                                        onChange={handleChange}
                                        className="form-input"
                                    >
                                        {SOURCES.map((source) => (
                                            <option key={source} value={source}>
                                                {source}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>

                                <FormField label="Lead Status" required>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="form-input"
                                    >
                                        {STATUSES.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>
                            </div>

                            <div className="mt-6 flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    disabled={saving}
                                    onClick={() => setModalOpen(false)}
                                    className="rounded-lg border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/20 transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving ? (
                                        <>
                                            <RefreshCw size={14} className="animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={15} />
                                            {editingLead ? "Save Changes" : "Create Lead"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingLead && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-[400px] rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                            <Trash2 size={21} />
                        </div>

                        <h3 className="mt-4 text-center text-base font-bold text-slate-900">
                            Delete this lead?
                        </h3>

                        <p className="mt-2 text-center text-xs leading-5 text-slate-500">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-slate-800">
                                {deletingLead.name}
                            </span>
                            ? This action cannot be undone.
                        </p>

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => setDeletingLead(null)}
                                className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                className="flex-1 rounded-lg bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-rose-700"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Reusable Statistics Card
const StatCard = ({
    title,
    value,
    icon: Icon,
    iconStyle,
    description,
}) => {
    return (
        <div className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_3px_18px_rgba(15,23,42,0.025)] transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60 sm:p-5">
            <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium text-slate-500">
                    {title}
                </p>

                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconStyle}`}>
                    <Icon size={17} />
                </div>
            </div>

            <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                {value}
            </h3>

            <p className="mt-1 text-[10px] text-slate-400">
                {description}
            </p>
        </div>
    );
};

// Reusable Form Field
const FormField = ({ label, required, children }) => {
    return (
        <div>
            <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
                {label}
                {required && <span className="ml-1 text-rose-500">*</span>}
            </label>
            {children}
        </div>
    );
};

export default Dashboard;
