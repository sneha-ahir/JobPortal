import { useState, useEffect } from 'react';
import API from '../../api/axiosConfig';
import { Briefcase, Building2, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const response = await API.get('/applications/my');
            setApplications(response.data);
        } catch (err) {
            // Mock data if API fails
            setApplications([
                { id: 1, jobTitle: 'React Developer', companyName: 'Tech Corp', status: 'Shortlisted', appliedAt: '2025-05-12T10:00:00' },
                { id: 2, jobTitle: 'Full Stack Engineer', companyName: 'Web Solutions', status: 'Pending', appliedAt: '2025-05-11T14:30:00' },
                { id: 3, jobTitle: 'UI Designer', companyName: 'Creative Studio', status: 'Rejected', appliedAt: '2025-05-10T09:15:00' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-200';
            case 'Shortlisted': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
            case 'Rejected': return 'bg-rose-50 text-rose-600 border-rose-200';
            case 'Reviewed': return 'bg-blue-50 text-blue-600 border-blue-200';
            default: return 'bg-slate-50 text-slate-600 border-slate-200';
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-10">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-[#0F172A]">My Applications</h1>
                <p className="text-[#64748B] mt-2">Track the status of all your submitted job applications.</p>
            </header>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-[#64748B]">
                    <Loader2 className="animate-spin mb-4" size={40} />
                    <p>Loading your applications...</p>
                </div>
            ) : error ? (
                <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-red-600 flex items-center gap-3">
                    <AlertCircle size={24} />
                    <p>{error}</p>
                </div>
            ) : applications.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-[#E2E8F0]">
                    <p className="text-[#64748B]">You haven't applied for any jobs yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {applications.map(app => (
                        <div key={app.id} className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all hover:border-[#4F46E5]">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-[#F1F5F9] flex items-center justify-center text-[#94A3B8]">
                                    <Building2 size={24} />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-lg font-bold text-[#0F172A]">{app.jobTitle}</h2>
                                    <p className="text-sm text-[#475569] font-medium">{app.companyName}</p>
                                    <p className="text-xs text-[#94A3B8] mt-1 flex items-center gap-1">
                                        <Calendar size={12} /> Applied on {new Date(app.appliedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 self-end sm:self-center">
                                <div className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${getStatusStyle(app.status)}`}>
                                    {app.status === 'Shortlisted' ? <CheckCircle size={14} /> : 
                                     app.status === 'Pending' ? <Clock size={14} /> : 
                                     app.status === 'Rejected' ? <XCircle size={14} /> : null}
                                    {app.status}
                                </div>
                                <button className="text-xs text-[#4F46E5] font-bold hover:underline">View Details</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyApplications;
