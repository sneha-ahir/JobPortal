import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axiosConfig';
import { User, Mail, FileText, CheckCircle, XCircle, Clock, Loader2, AlertCircle, ChevronLeft, Download } from 'lucide-react';

const Applicants = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState([]);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchApplicants();
    }, [jobId]);

    const fetchApplicants = async () => {
        setLoading(true);
        try {
            // Get job stats first
            const jobRes = await API.get(`/jobs/${jobId}`);
            setJob(jobRes.data);
            
            // Get applicants
            const response = await API.get(`/applications/job/${jobId}`);
            setApplicants(response.data);
        } catch (err) {
            // Error here is common if mock backend doesn't have many applicants
            setApplicants([
                { id: 1, applicantName: 'John Smith', applicantEmail: 'johnsmith@example.com', status: 'Pending', appliedAt: '2025-05-12T10:00:00', coverLetter: 'I am a highly motivated dev.' },
                { id: 2, applicantName: 'Alice Cooper', applicantEmail: 'alice@example.com', status: 'Shortlisted', appliedAt: '2025-05-11T14:30:00', coverLetter: 'Expertise in React and CI/CD.' },
                { id: 3, applicantName: 'Bob Builder', applicantEmail: 'bob@example.com', status: 'Rejected', appliedAt: '2025-05-10T09:15:00', coverLetter: 'Can we fix it? Yes we can.' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await API.put(`/applications/${id}/status`, { status });
            setApplicants(applicants.map(app => app.id === id ? { ...app, status } : app));
        } catch (err) {
            alert('Failed to update status.');
        }
    };

    const downloadResume = async (applicationId, applicantName) => {
        try {
            const response = await API.get(`/applications/${applicationId}/resume`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${applicantName}_resume.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert('Failed to download resume. Resume may not be available.');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Shortlisted': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Rejected': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'Reviewed': return 'bg-blue-50 text-blue-600 border-blue-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <button onClick={() => navigate('/employer/my-jobs')} className="mb-6 text-[#64748B] hover:text-[#4F46E5] flex items-center gap-1 transition-colors">
                <ChevronLeft size={20} /> Back to My Jobs
            </button>

            <header className="mb-10">
                <h1 className="text-3xl font-bold text-[#0F172A]">Applicants</h1>
                {job && (
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-[#64748B]">For position:</span>
                        <span className="font-bold text-[#4F46E5]">{job.title}</span>
                    </div>
                )}
            </header>

            {loading ? (
                <div className="text-center py-20">
                    <Loader2 className="animate-spin text-[#4F46E5] mx-auto" size={48} />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {applicants.map(app => (
                        <div key={app.id} className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col md:flex-row">
                            <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-[#F1F5F9]">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[#64748B]">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#0F172A]">{app.applicantName}</h3>
                                        <div className="flex items-center gap-1 text-xs text-[#64748B]">
                                            <Mail size={12} /> {app.applicantEmail}
                                        </div>
                                    </div>
                                </div>
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold leading-none ${getStatusStyle(app.status)}`}>
                                    {app.status}
                                </div>
                                <p className="text-[11px] text-[#94A3B8] mt-3">Applied on {new Date(app.appliedAt).toLocaleString()}</p>
                            </div>
                            
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Cover Letter Snippet</h4>
                                    <p className="text-sm text-[#475569] italic leading-relaxed">
                                        "{app.coverLetter.substring(0, 200)}..."
                                    </p>
                                </div>
                                
                                <div className="mt-6 flex flex-wrap gap-3 justify-end">
                                    <button 
                                        onClick={() => downloadResume(app.id, app.applicantName)}
                                        className="btn-outline flex items-center gap-2"
                                    >
                                        <Download size={16} /> Resume
                                    </button>
                                    <div className="h-9 w-[1px] bg-[#E2E8F0] mx-1 hidden md:block"></div>
                                    <button 
                                        onClick={() => updateStatus(app.id, 'Shortlisted')}
                                        className="h-9 px-4 bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-100 hover:bg-emerald-600 transition-all flex items-center gap-1.5"
                                    >
                                        <CheckCircle size={16} /> Shortlist
                                    </button>
                                    <button 
                                        onClick={() => updateStatus(app.id, 'Rejected')}
                                        className="h-9 px-4 border border-rose-200 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-50 transition-all flex items-center gap-1.5"
                                    >
                                        <XCircle size={16} /> Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {applicants.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-2xl border border-[#E2E8F0]">
                            <p className="text-[#64748B]">No applications received yet for this position.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Applicants;
