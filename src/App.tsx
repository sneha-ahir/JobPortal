import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Job Pages
import JobList from './pages/jobs/JobList';
import JobDetail from './pages/jobs/JobDetail';

// Employer Pages
import EmployerDashboard from './pages/employer/EmployerDashboard';
import MyJobs from './pages/employer/MyJobs';
import PostJob from './pages/employer/PostJob';
import Applicants from './pages/employer/Applicants';

// Job Seeker Pages
import JobSeekerDashboard from './pages/jobseeker/JobSeekerDashboard';
import MyApplications from './pages/jobseeker/MyApplications';
import UploadResume from './pages/jobseeker/UploadResume';

/**
 * Main App Component
 */
function AppRoutes() {
    return (
        <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
            <Navbar />
            <main className="flex-grow">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/jobs" element={<JobList />} />
                    <Route path="/jobs/:id" element={<JobDetail />} />

                    {/* Employer Protected Routes */}
                    <Route 
                        path="/employer/dashboard" 
                        element={
                            <ProtectedRoute role="Employer">
                                <EmployerDashboard />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/employer/my-jobs" 
                        element={
                            <ProtectedRoute role="Employer">
                                <MyJobs />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/employer/post-job" 
                        element={
                            <ProtectedRoute role="Employer">
                                <PostJob />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/employer/applicants/:jobId" 
                        element={
                            <ProtectedRoute role="Employer">
                                <Applicants />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute role="JobSeeker">
                                <JobSeekerDashboard />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/my-applications" 
                        element={
                            <ProtectedRoute role="JobSeeker">
                                <MyApplications />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/upload-resume" 
                        element={
                            <ProtectedRoute role="JobSeeker">
                                <UploadResume />
                            </ProtectedRoute>
                        } 
                    />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/jobs" />} />
                </Routes>
            </main>
            
            <footer className="h-14 bg-[#1E293B] text-[#94A3B8] flex items-center justify-between px-6 text-xs mt-10">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]"></div>
                    Connected to API Server: http://localhost:5000/api
                </div>
                <div className="hidden sm:block">
                    &copy; 2026 JobPortal Job Portal. Built for excellence.
                </div>
                <div className="text-right">
                    All Systems Operational
                </div>
            </footer>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}
