import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, Phone, Briefcase, Loader2, AlertCircle } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'JobSeeker',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await API.post('/auth/register', formData);
            login(response.data, response.data.token);
            if (response.data.role === 'Employer') {
                navigate('/employer/dashboard');
            } else {
                navigate('/jobs');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-[#0F172A]">Create Account</h1>
                    <p className="text-[#64748B] mt-2">Join JobPortal to find jobs or hire talent</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-[#475569] mb-1.5">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                            <input
                                name="fullName"
                                type="text"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#475569] mb-1.5">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]"
                                placeholder="john@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#475569] mb-1.5">Phone</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                            <input
                                name="phone"
                                type="text"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]"
                                placeholder="9876543210"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#475569] mb-1.5">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#475569] mb-1.5">Role</label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] appearance-none"
                            >
                                <option value="JobSeeker">Job Seeker</option>
                                <option value="Employer">Employer</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="sm:col-span-2 w-full search-btn py-3 mt-4 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : 'Create Account'}
                    </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-[#F1F5F9]">
                    <p className="text-[#64748B] text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#4F46E5] font-semibold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
