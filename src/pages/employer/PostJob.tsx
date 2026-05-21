import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axiosConfig';
import { Briefcase, MapPin, IndianRupee, Calendar, FileText, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const PostJob = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        jobType: 'Full-Time',
        experienceLevel: 'Entry',
        salaryMin: '',
        salaryMax: '',
        skillsRequired: '',
        deadline: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await API.post('/jobs', {
                ...formData,
                salaryMin: parseInt(formData.salaryMin),
                salaryMax: parseInt(formData.salaryMax),
            });
            setSuccess('Job posted successfully!');
            setTimeout(() => navigate('/employer/my-jobs'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to post job. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="p-8 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                    <h1 className="text-2xl font-bold text-[#0F172A]">Post a New Job</h1>
                    <p className="text-[#64748B] mt-1">Fill in the details to reach thousands of high-quality candidates.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-[#475569] mb-2">Job Title</label>
                            <div className="relative">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                                <input
                                    name="title"
                                    type="text"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-[#CBD5E1] rounded-xl outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]"
                                    placeholder="e.g. Senior Frontend Developer"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#475569] mb-2">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                                <input
                                    name="location"
                                    type="text"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-[#CBD5E1] rounded-xl outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]"
                                    placeholder="e.g. Remote or Chennai, India"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#475569] mb-2">Job Type</label>
                            <select
                                name="jobType"
                                value={formData.jobType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white border border-[#CBD5E1] rounded-xl outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] appearance-none cursor-pointer"
                            >
                                <option value="Full-Time">Full-Time</option>
                                <option value="Part-Time">Part-Time</option>
                                <option value="Remote">Remote</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#475569] mb-2">Experience Level</label>
                            <select
                                name="experienceLevel"
                                value={formData.experienceLevel}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white border border-[#CBD5E1] rounded-xl outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] appearance-none cursor-pointer"
                            >
                                <option value="Entry">Entry Level</option>
                                <option value="Mid">Mid Level</option>
                                <option value="Senior">Senior Level</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#475569] mb-2">Application Deadline</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                                <input
                                    name="deadline"
                                    type="date"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-[#CBD5E1] rounded-xl outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#475569] mb-2">Salary Minimum (₹)</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                                <input
                                    name="salaryMin"
                                    type="number"
                                    value={formData.salaryMin}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-[#CBD5E1] rounded-xl outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]"
                                    placeholder="50000"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#475569] mb-2">Salary Maximum (₹)</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                                <input
                                    name="salaryMax"
                                    type="number"
                                    value={formData.salaryMax}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-[#CBD5E1] rounded-xl outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]"
                                    placeholder="80000"
                                    required
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-[#475569] mb-2">Job Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={6}
                                className="w-full p-4 bg-white border border-[#CBD5E1] rounded-xl outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]"
                                placeholder="Describe the role and responsibilities..."
                                required
                            ></textarea>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-[#475569] mb-2">Required Skills (Comma separated)</label>
                            <input
                                name="skillsRequired"
                                type="text"
                                value={formData.skillsRequired}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white border border-[#CBD5E1] rounded-xl outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]"
                                placeholder="e.g. React, JavaScript, CSS, Node.js"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-[#F1F5F9] flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/employer/dashboard')}
                            className="btn-outline px-8 py-3.5"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="search-btn px-10 py-3.5 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Post Job Now'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostJob;
