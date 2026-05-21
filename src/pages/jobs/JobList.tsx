import { useState, useEffect } from 'react';
import API from '../../api/axiosConfig';
import JobCard from '../../components/JobCard';
import { Search, Filter, Loader2, AlertCircle, MapPin } from 'lucide-react';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [jobType, setJobType] = useState('');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const response = await API.get('/jobs');
            setJobs(response.data);
        } catch (err) {
            setError('Failed to load jobs. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const filteredJobs = jobs.filter(job => 
        (job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
         job.companyName.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (jobType === '' || job.jobType === jobType)
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-72 flex flex-col gap-6">
                    <div className="filter-card">
                        <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-6 flex items-center gap-2">
                            <Filter size={14} />
                            Filters
                        </h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-[#475569] mb-3">Job Type</label>
                                <div className="space-y-3">
                                    {['Full-Time', 'Part-Time', 'Remote', 'Internship'].map(type => (
                                        <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                            <input 
                                                type="radio" 
                                                name="jobType" 
                                                value={type}
                                                checked={jobType === type}
                                                onChange={(e) => setJobType(e.target.value)}
                                                className="hidden"
                                            />
                                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${jobType === type ? 'bg-[#4F46E5] border-[#4F46E5]' : 'border-[#CBD5E1] group-hover:border-[#4F46E5]'}`}>
                                                {jobType === type && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                            </div>
                                            <span className={`text-sm ${jobType === type ? 'text-[#0F172A] font-medium' : 'text-[#64748B]'}`}>{type}</span>
                                        </label>
                                    ))}
                                    {jobType && (
                                        <button 
                                            onClick={() => setJobType('')}
                                            className="text-xs text-[#4F46E5] font-semibold hover:underline mt-2"
                                        >
                                            Clear Selection
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="filter-card bg-[#EEF2FF] border-[#C7D2FE]">
                        <h3 className="text-xs font-bold text-[#4F46E5] uppercase tracking-wider mb-2">Pro Tip</h3>
                        <p className="text-xs text-[#6366F1] leading-relaxed">
                            Completing your profile increases your chances of getting noticed by 3x!
                        </p>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col gap-6">
                    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex gap-3 shadow-sm">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={20} />
                            <input 
                                type="text"
                                placeholder="Search job titles, companies..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 outline-none text-[#1E293B]"
                            />
                        </div>
                        <button className="search-btn px-8">Search</button>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-[#64748B]">
                            <Loader2 className="animate-spin mb-4" size={40} />
                            <p>Loading latest job openings...</p>
                        </div>
                    ) : error ? (
                        <div className="p-6 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-red-600">
                            <AlertCircle size={24} />
                            <p>{error}</p>
                        </div>
                    ) : filteredJobs.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-[#E2E8F0]">
                            <p className="text-[#64748B]">No jobs found matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            {filteredJobs.map(job => (
                                <JobCard key={job.id} job={job} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default JobList;
