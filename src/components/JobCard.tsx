import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Calendar, IndianRupee } from 'lucide-react';

const JobCard = ({ job }) => {
    return (
        <div className="job-card">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-lg font-bold text-[#0F172A] hover:text-[#4F46E5]">
                        <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                    </h2>
                    <div className="text-sm text-[#64748B] mt-1">
                        {job.companyName} • {job.location}
                    </div>
                </div>
                <span className="bg-[#EEF2FF] text-[#4F46E5] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                    {job.jobType}
                </span>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[#64748B] text-[13px]">
                <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-[#94A3B8]" />
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1.5">
                    <Briefcase size={14} className="text-[#94A3B8]" />
                    {job.experienceLevel} Level
                </div>
                <div className="flex items-center gap-1.5">
                    <IndianRupee size={14} className="text-[#059669]" />
                    <span className="font-bold text-[#059669]">
                        ₹{job.salaryMin.toLocaleString()} - ₹{job.salaryMax.toLocaleString()}
                    </span>
                </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-[#F1F5F9]">
                <Link to={`/jobs/${job.id}`} className="search-btn text-center flex-1 py-2">
                    Apply Now
                </Link>
                <button className="btn-outline flex-1 py-1">
                    Save Job
                </button>
            </div>
        </div>
    );
};

export default JobCard;
