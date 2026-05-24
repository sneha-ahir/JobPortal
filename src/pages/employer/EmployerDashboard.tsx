import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Users, FileText, CheckCircle, Clock, Loader2, PlusCircle, LayoutDashboard, IndianRupee } from 'lucide-react';

const EmployerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ jobsPosted: 0, totalApplications: 0, pendingReviews: 0, shortlisted: 0 });
    const [recentJobs, setRecentJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch all jobs
                const jobsRes = await API.get('/jobs');
                const allJobs = jobsRes.data;
                
                // Get current employer's jobs (filter by companyId or company name)
                const myJobs = allJobs.filter(j => j.companyId === 1 || j.companyName === user?.companyName);
                
                setStats({
                    jobsPosted: myJobs.length,
                    totalApplications: 0,
                    pendingReviews: 0,
                    shortlisted: 0
                });
                
                // Set recent jobs (last 3)
                setRecentJobs(myJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3));
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                // Fallback to mock data if API fails
                setStats({ jobsPosted: 3, totalApplications: 1, pendingReviews: 0, shortlisted: 1 });
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [user]);

    const statCards = [
        { title: 'Jobs Posted', value: stats.jobsPosted, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'Applications', value: stats.totalApplications, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { title: 'Pending Reviews', value: stats.pendingReviews, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { title: 'Shortlisted', value: stats.shortlisted, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <header className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-[#0F172A]">Employer Dashboard</h1>
                    <p className="text-[#64748B] mt-2">Welcome back meta-data, {user.fullName}! Here's what's happening with your job posts.</p>
                </div>
                <Link to="/employer/post-job" className="search-btn flex items-center gap-2 py-3 px-6">
                    <PlusCircle size={20} />
                    Post New Job
                </Link>
            </header>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-[#4F46E5]" size={40} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, idx) => (
                        <div key={idx} className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                                    <stat.icon size={24} />
                                </div>
                                <span className="text-3xl font-bold text-[#0F172A]">{stat.value}</span>
                            </div>
                            <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider">{stat.title}</h3>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-[#F1F5F9] flex justify-between items-center">
                        <h3 className="font-bold text-[#0F172A]">Recent Job Posts</h3>
                        <Link to="/employer/my-jobs" className="text-sm text-[#4F46E5] font-semibold hover:underline">View All</Link>
                    </div>
                    <div className="p-6">
                        {recentJobs.length === 0 ? (
                            <p className="text-sm text-[#64748B] italic">No job posts yet. <Link to="/employer/post-job" className="text-[#4F46E5] font-semibold hover:underline">Post your first job</Link></p>
                        ) : (
                            <div className="space-y-4">
                                {recentJobs.map(job => (
                                    <Link key={job.id} to={`/employer/applicants/${job.id}`} className="p-4 border border-[#E2E8F0] rounded-xl hover:border-[#4F46E5] hover:bg-slate-50 transition-all group">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-[#0F172A] group-hover:text-[#4F46E5]">{job.title}</h4>
                                            <span className="text-xs bg-[#EEF2FF] text-[#4F46E5] px-2 py-1 rounded-full font-semibold">{job.jobType}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-[#64748B] mb-2">
                                            <Briefcase size={14} />
                                            {job.location}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1 text-[#059669] font-semibold">
                                                <IndianRupee size={14} />
                                                ₹{job.salaryMin?.toLocaleString() || 0} - ₹{job.salaryMax?.toLocaleString() || 0}
                                            </div>
                                            <span className="text-xs text-[#94A3B8]">{new Date(job.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-[#F1F5F9]">
                        <h3 className="font-bold text-[#0F172A]">Quick Actions</h3>
                    </div>
                    <div className="p-6 flex flex-col gap-3">
                        <Link to="/employer/post-job" className="w-full flex items-center justify-between p-4 bg-white border border-[#E2E8F0] rounded-xl hover:border-[#4F46E5] hover:bg-slate-50 transition-all group">
                            <span className="text-sm font-medium text-[#475569] group-hover:text-[#4F46E5]">Post a Job</span>
                            <PlusCircle size={18} className="text-[#94A3B8] group-hover:text-[#4F46E5]" />
                        </Link>
                        <Link to="/employer/my-jobs" className="w-full flex items-center justify-between p-4 bg-white border border-[#E2E8F0] rounded-xl hover:border-[#4F46E5] hover:bg-slate-50 transition-all group">
                            <span className="text-sm font-medium text-[#475569] group-hover:text-[#4F46E5]">Manage Applications</span>
                            <Users size={18} className="text-[#94A3B8] group-hover:text-[#4F46E5]" />
                        </Link>
                        <Link to="/employer/dashboard" className="w-full flex items-center justify-between p-4 bg-white border border-[#E2E8F0] rounded-xl hover:border-[#4F46E5] hover:bg-slate-50 transition-all group">
                            <span className="text-sm font-medium text-[#475569] group-hover:text-[#4F46E5]">Download Reports</span>
                            <FileText size={18} className="text-[#94A3B8] group-hover:text-[#4F46E5]" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployerDashboard;
