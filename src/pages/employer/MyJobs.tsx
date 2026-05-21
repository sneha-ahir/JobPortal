import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axiosConfig';
import { Briefcase, MapPin, Users, Edit3, Trash2, Loader2, AlertCircle, Search } from 'lucide-react';

const MyJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const fetchMyJobs = async () => {
        setLoading(true);
        try {
            const response = await API.get('/jobs');
            // Mock filtering: In a real app the backend `api/company/my` or similar would be used
            setJobs(response.data.filter(j => j.companyId === 1));
        } catch (err) {
            setError('Failed to load your jobs.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job post?')) return;
        try {
            await API.delete(`/jobs/${id}`);
            setJobs(jobs.filter(job => job.id !== id));
        } catch (err) {
            alert('Failed to delete job.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F172A]">My Posted Jobs</h1>
                    <p className="text-[#64748B] mt-1">Manage your active job listings and view applicants.</p>
                </div>
                <Link to="/employer/post-job" className="search-btn">
                    Post New Job
                </Link>
            </header>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-[#4F46E5]" size={40} />
                </div>
            ) : error ? (
                <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-red-600">
                    <p>{error}</p>
                </div>
            ) : jobs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-[#E2E8F0]">
                    <p className="text-[#64748B]">You haven't posted any jobs yet.</p>
                    <Link to="/employer/post-job" className="text-[#4F46E5] font-semibold mt-4 block underline">Post your first job</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {jobs.map(job => (
                        <div key={job.id} className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#4F46E5] transition-all">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-xl font-bold text-[#0F172A]">{job.title}</h2>
                                    <span className="bg-[#EEF2FF] text-[#4F46E5] px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-tight">
                                        {job.jobType}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-[#64748B]">
                                    <div className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</div>
                                    <div className="flex items-center gap-1.5"><Briefcase size={16} /> {job.experienceLevel} Level</div>
                                    <div className="flex items-center gap-1.5"><Users size={16} /> <span className="font-semibold text-[#0F172A]">8</span> Applicants</div>
                                </div>
                            </div>

                            <div className="flex gap-3 items-center border-t md:border-t-0 pt-4 md:pt-0">
                                <Link 
                                    to={`/employer/applicants/${job.id}`} 
                                    className="bg-[#4F46E5] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 shadow-md shadow-indigo-100"
                                >
                                    <Users size={16} />
                                    View Applicants
                                </Link>
                                <button className="p-2.5 text-[#64748B] hover:text-[#4F46E5] hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-[#E2E8F0]">
                                    <Edit3 size={20} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(job.id)}
                                    className="p-2.5 text-[#64748B] hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyJobs;
