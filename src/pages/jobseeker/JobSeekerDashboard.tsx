import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Send, CheckCircle, Clock, XCircle, Search, Loader2, ChevronRight, FileText } from 'lucide-react';

const JobSeekerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ applied: 0, shortlisted: 0, pending: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await API.get('/applications/my');
                const apps = response.data;
                setStats({
                    applied: apps.length,
                    shortlisted: apps.filter(a => a.status === 'Shortlisted').length,
                    pending: apps.filter(a => a.status === 'Pending').length
                });
            } catch (err) {
                // If API fails, show mock numbers for demo
                setStats({ applied: 1, shortlisted: 1, pending: 0 });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { label: 'Jobs Applied', value: stats.applied, icon: Send, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Pending Response', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Shortlisted', value: stats.shortlisted, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Interviews', value: 1, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-[#0F172A]">Welcome, {user.fullName}!</h1>
                <p className="text-[#64748B] mt-2">Track your applications and find new opportunities matched for your profile.</p>
            </header>

            {loading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-[#4F46E5]" size={36} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {cards.map((card, idx) => (
                        <div key={idx} className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-3xl font-bold text-[#0F172A]">{card.value}</span>
                                <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center`}>
                                    <card.icon size={20} />
                                </div>
                            </div>
                            <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">{card.label}</h3>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-[#0F172A]">Next Steps for You</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-2xl border border-[#F1F5F9] border-l-4 border-l-[#4F46E5]">
                                <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5]">
                                    <FileText size={20} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-[#0F172A]">Update your resume</h4>
                                    <p className="text-xs text-[#64748B] mt-0.5">Your current resume was uploaded 3 months ago.</p>
                                </div>
                                <Link to="/upload-resume" className="text-[#4F46E5] text-xs font-bold flex items-center gap-1">
                                    Go <ChevronRight size={14} />
                                </Link>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-2xl border border-[#F1F5F9] border-l-4 border-l-emerald-500">
                                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                                    <Briefcase size={20} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-[#0F172A]">Apply to 5 more jobs</h4>
                                    <p className="text-xs text-[#64748B] mt-0.5">Successful candidates apply to an average of 15 jobs.</p>
                                </div>
                                <Link to="/jobs" className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                                    Browse <ChevronRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
                        <h3 className="font-bold text-[#0F172A] mb-6">Recent Applications</h3>
                        <div className="text-sm text-[#64748B] text-center py-4 italic border border-dashed border-[#E2E8F0] rounded-xl">
                            Loading your application history...
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-2">Find your dream job today</h3>
                            <p className="text-indigo-100 text-sm mb-6 leading-relaxed">Search through thousands of live job listings from top companies worldwide.</p>
                            <Link to="/jobs" className="bg-white text-[#4F46E5] px-6 py-3 rounded-2xl text-sm font-bold inline-flex items-center gap-2 hover:shadow-lg transition-all active:scale-95">
                                <Search size={18} /> Explore Jobs
                            </Link>
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>
                        <div className="absolute -top-6 -left-6 w-24 h-24 bg-white rounded-full blur-3xl opacity-20"></div>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
                        <h3 className="font-bold text-[#0F172A] mb-4">Quick Links</h3>
                        <div className="grid grid-cols-1 gap-2">
                            <Link to="/my-applications" className="p-3 text-sm text-[#64748B] hover:bg-slate-50 hover:text-[#4F46E5] rounded-xl transition-all">My Applications</Link>
                            <Link to="/upload-resume" className="p-3 text-sm text-[#64748B] hover:bg-slate-50 hover:text-[#4F46E5] rounded-xl transition-all">My Resumes</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobSeekerDashboard;
