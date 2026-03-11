import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Layout from './components/Layout';

import PatientDashboard from './pages/patient/Dashboard';
import FindDoctors from './pages/patient/FindDoctors';
import MyAppointments from './pages/patient/MyAppointments';

import DoctorDashboard from './pages/doctor/Dashboard';
import ManageSlots from './pages/doctor/ManageSlots';
import DoctorAppointments from './pages/doctor/Appointments';

import AdminDashboard from './pages/admin/Dashboard';
import AdminAppointments from './pages/admin/Appointments';
import AdminUsers from './pages/admin/Users';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" />;
  if (user.role === 'DOCTOR') return <Navigate to="/doctor/dashboard" />;
  return <Navigate to="/patient/dashboard" />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<HomeRedirect />} />

          {/* Patient Routes */}
          <Route path="/patient" element={
            <PrivateRoute roles={['PATIENT']}>
              <Layout role="PATIENT" />
            </PrivateRoute>
          }>
            <Route path="dashboard" element={<PatientDashboard />} />
            <Route path="doctors" element={<FindDoctors />} />
            <Route path="appointments" element={<MyAppointments />} />
          </Route>

          {/* Doctor Routes */}
          <Route path="/doctor" element={
            <PrivateRoute roles={['DOCTOR']}>
              <Layout role="DOCTOR" />
            </PrivateRoute>
          }>
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="slots" element={<ManageSlots />} />
            <Route path="appointments" element={<DoctorAppointments />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <PrivateRoute roles={['ADMIN']}>
              <Layout role="ADMIN" />
            </PrivateRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
