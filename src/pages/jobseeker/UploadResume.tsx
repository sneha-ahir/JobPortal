import { useState, useEffect } from 'react';
import API from '../../api/axiosConfig';
import { Upload, FileText, Trash2, CheckCircle, AlertCircle, Loader2, FileUp } from 'lucide-react';

const UploadResume = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        setLoading(true);
        try {
            const response = await API.get('/resume/my');
            setResumes(response.data);
        } catch (err) {
            // Mock data for demo
            setResumes([
                { id: 1, fileName: 'Senior_Developer_Resume.pdf', uploadedAt: '2025-02-14T08:00:00' },
                { id: 2, fileName: 'Portfolio_Website.pdf', uploadedAt: '2025-01-20T11:30:00' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setUploading(true);
        setError('');
        setSuccess('');
        
        // Mock upload logic
        setTimeout(() => {
            setResumes([{ id: Date.now(), fileName: 'New_Resume.pdf', uploadedAt: new Date().toISOString() }, ...resumes]);
            setSuccess('Resume uploaded successfully!');
            setUploading(false);
        }, 1500);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this resume?')) return;
        try {
            // await API.delete(`/resume/${id}`);
            setResumes(resumes.filter(r => r.id !== id));
        } catch (err) {
            alert('Failed to delete.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-[#0F172A]">My Resumes</h1>
                <p className="text-[#64748B] mt-2">Manage your professional resumes for your job applications.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-sm sticky top-24">
                        <h3 className="font-bold text-[#0F172A] mb-4">Upload New Resume</h3>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div className="border-2 border-dashed border-[#CBD5E1] rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-[#4F46E5] transition-colors cursor-pointer group">
                                <div className="w-12 h-12 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] group-hover:text-[#4F46E5] group-hover:bg-[#EEF2FF] transition-all mb-4">
                                    <FileUp size={24} />
                                </div>
                                <p className="text-sm font-semibold text-[#475569]">Click to upload or drag & drop</p>
                                <p className="text-xs text-[#94A3B8] mt-1">PDF, DOC (Max 5MB)</p>
                                <input type="file" className="hidden" />
                            </div>

                            {error && <div className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={14} /> {error}</div>}
                            {success && <div className="text-emerald-500 text-xs flex items-center gap-1"><CheckCircle size={14} /> {success}</div>}

                            <button 
                                type="submit" 
                                disabled={uploading}
                                className="w-full search-btn py-3 mt-4 flex items-center justify-center gap-2"
                            >
                                {uploading ? <Loader2 className="animate-spin text-white" size={20} /> : 'Process Upload'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Resume List */}
                <div className="lg:col-span-2 space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="animate-spin text-[#4F46E5]" size={36} />
                        </div>
                    ) : resumes.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-[#E2E8F0] border-dashed">
                            <p className="text-[#64748B]">No resumes uploaded yet.</p>
                        </div>
                    ) : (
                        resumes.map(resume => (
                            <div key={resume.id} className="bg-white rounded-2xl border border-[#E2E8F0] p-5 flex items-center justify-between shadow-sm hover:border-[#4F46E5] transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
                                        <FileText size={22} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-[#0F172A]">{resume.fileName}</h4>
                                        <p className="text-xs text-[#94A3B8] mt-0.5">Uploaded on {new Date(resume.uploadedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleDelete(resume.id)} className="p-2 text-[#94A3B8] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default UploadResume;
