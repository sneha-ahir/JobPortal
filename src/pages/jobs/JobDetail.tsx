import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Briefcase, Calendar, IndianRupee, Clock, CheckCircle, Loader2, AlertCircle, ChevronLeft } from 'lucide-react';

const JobDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchJobDetail();
    }, [id]);

    const fetchJobDetail = async () => {
        setLoading(true);
        try {
            const response = await API.get(`/jobs/${id}`);
            setJob(response.data);
        } catch (err) {
            setError('Could not download job details.');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role !== 'JobSeeker') {
            setError('Only Job Seekers can apply for jobs.');
            return;
        }

        setApplying(true);
        setError('');
        try {
            // In a real app we'd let user pick resume. Here we assume they have one with ID 1
            await API.post('/applications', {
                jobId: parseInt(id),
                resumeId: 1,
                coverLetter: "I am highly interested in this position and believe my skills align perfectly."
            });
            setSuccess('Application submitted successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit application.');
        } finally {
            setApplying(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 text-[#64748B]">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p>Loading job details...</p>
        </div>
    );

    if (error && !job) return (
        <div className="max-w-3xl mx-auto px-6 py-10">
            <div className="p-6 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-red-600">
                <AlertCircle size={24} />
                <p>{error}</p>
            </div>
            <button onClick={() => navigate('/jobs')} className="mt-4 text-[#4F46E5] flex items-center gap-2 font-semibold">
                <ChevronLeft size={18} /> Back to jobs
            </button>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            <button onClick={() => navigate('/jobs')} className="mb-6 text-[#64748B] hover:text-[#4F46E5] flex items-center gap-1 transition-colors">
                <ChevronLeft size={20} /> Back to Listings
            </button>

            <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="p-8 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                            <span className="bg-[#4F46E5] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 inline-block">
                                {job.jobType}
                            </span>
                            <h1 className="text-3xl font-bold text-[#0F172A]">{job.title}</h1>
                            <p className="text-lg text-[#64748B] mt-1 font-medium">{job.companyName} • {job.location}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-[#059669]">₹{job.salaryMin.toLocaleString()} - ₹{job.salaryMax.toLocaleString()}</p>
                            <p className="text-sm text-[#64748B]">Estimated Annual Salary</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#4F46E5] shadow-sm">
                                <Briefcase size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-[#94A3B8] uppercase font-bold tracking-tighter">Level</p>
                                <p className="text-sm font-semibold text-[#1E293B]">{job.experienceLevel}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#4F46E5] shadow-sm">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-[#94A3B8] uppercase font-bold tracking-tighter">Location</p>
                                <p className="text-sm font-semibold text-[#1E293B]">{job.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#4F46E5] shadow-sm">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-[#94A3B8] uppercase font-bold tracking-tighter">Deadline</p>
                                <p className="text-sm font-semibold text-[#1E293B]">{new Date(job.deadline).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#4F46E5] shadow-sm">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-[#94A3B8] uppercase font-bold tracking-tighter">Posted</p>
                                <p className="text-sm font-semibold text-[#1E293B]">{new Date(job.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    <div>
                        <h3 className="text-lg font-bold text-[#0F172A] mb-4">Job Description</h3>
                        <div className="text-[#475569] leading-relaxed whitespace-pre-wrap">
                            {job.description}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-[#0F172A] mb-4">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {job.skillsRequired.split(',').map(skill => (
                                <span key={skill} className="bg-[#F1F5F9] text-[#475569] px-4 py-1.5 rounded-xl text-sm font-medium border border-[#E2E8F0]">
                                    {skill.trim()}
                                </span>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-600 text-sm">
                            <CheckCircle size={18} />
                            {success}
                        </div>
                    )}

                    <div className="pt-6 border-t border-[#F1F5F9] flex justify-end">
                        <button
                            onClick={handleApply}
                            disabled={!!(applying || success)}
                            className={`px-10 py-3.5 rounded-2xl font-bold text-white shadow-lg transition-all ${applying || success ? 'bg-[#94A3B8] cursor-not-allowed' : 'bg-[#4F46E5] hover:shadow-indigo-200 hover:-translate-y-0.5'}`}
                        >
                            {applying ? <Loader2 className="animate-spin" size={24} /> : (success ? 'Applied ✓' : 'Apply for this Job')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetail;
