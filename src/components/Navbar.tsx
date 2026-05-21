import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Briefcase, PlusCircle, LayoutDashboard, FileText } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6 sticky top-0 z-50">
            <div className="flex items-center gap-8">
                <Link to={user ? (user.role === 'Employer' ? '/employer/dashboard' : '/jobs') : '/login'} className="text-xl font-bold text-[#4F46E5] flex items-center">
                    <div className="w-8 h-8 bg-[#4F46E5] rounded-lg mr-2.5 flex items-center justify-center text-white text-base">J</div>
                    JobPortal
                </Link>
                
                {user && (
                    <div className="hidden md:flex gap-6">
                        <Link to="/jobs" className="text-sm font-medium text-[#64748B] hover:text-[#4F46E5]">Find Jobs</Link>
                        {user.role === 'JobSeeker' && (
                            <>
                                <Link to="/my-applications" className="text-sm font-medium text-[#64748B] hover:text-[#4F46E5]">My Applications</Link>
                                <Link to="/upload-resume" className="text-sm font-medium text-[#64748B] hover:text-[#4F46E5]">My Resumes</Link>
                            </>
                        )}
                        {user.role === 'Employer' && (
                            <>
                                <Link to="/employer/dashboard" className="text-sm font-medium text-[#64748B] hover:text-[#4F46E5]">Dashboard</Link>
                                <Link to="/employer/my-jobs" className="text-sm font-medium text-[#64748B] hover:text-[#4F46E5]">My Jobs</Link>
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        {user.role === 'Employer' && (
                            <Link to="/employer/post-job" className="btn-outline hidden sm:flex items-center gap-2">
                                <PlusCircle size={16} />
                                Post a Job
                            </Link>
                        )}
                        <div className="flex items-center gap-3 pl-4 border-l border-[#E2E8F0]">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-[#0F172A]">{user.fullName}</p>
                                <p className="text-xs text-[#64748B]">{user.role}</p>
                            </div>
                            <div className="group relative">
                                <div className="w-9 h-9 rounded-full bg-[#E2E8F0] border-2 border-white shadow-[0_0_0_1px_#E2E8F0] cursor-pointer flex items-center justify-center text-[#64748B]">
                                    <User size={20} />
                                </div>
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-2 hidden group-hover:block">
                                    <button onClick={handleLogout} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex gap-3">
                        <Link to="/login" className="text-sm font-medium text-[#64748B] px-4 py-2 hover:text-[#4F46E5]">Login</Link>
                        <Link to="/register" className="search-btn">Register</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
