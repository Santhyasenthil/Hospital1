import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Calendar, Search, UserCheck,
  Clock, Users, LogOut, Activity, Shield
} from 'lucide-react';

const navConfig = {
  PATIENT: [
    { to: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/patient/doctors', label: 'Find Doctors', icon: Search },
    { to: '/patient/appointments', label: 'My Appointments', icon: Calendar },
  ],
  DOCTOR: [
    { to: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/doctor/slots', label: 'Manage Slots', icon: Clock },
    { to: '/doctor/appointments', label: 'Appointments', icon: Calendar },
  ],
  ADMIN: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/appointments', label: 'All Appointments', icon: Calendar },
    { to: '/admin/users', label: 'Users', icon: Users },
  ],
};

const roleColors = {
  PATIENT: { bg: '#dbeafe', color: '#1d4ed8', label: 'Patient' },
  DOCTOR: { bg: '#d1fae5', color: '#065f46', label: 'Doctor' },
  ADMIN: { bg: '#fef3c7', color: '#92400e', label: 'Admin' },
};

export default function Layout({ role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = navConfig[role] || [];
  const roleStyle = roleColors[role];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>Medi<span>Care</span>+</h2>
          <div className="sidebar-badge">{roleStyle.label} Portal</div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'rgba(0,180,216,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#00b4d8', fontWeight: 700, fontSize: 16
            }}>
              {initials}
            </div>
            <div>
              <div style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>{user?.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{user?.email}</div>
            </div>
          </div>
          <button className="btn btn-outline" style={{ width: '100%', color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.15)' }} onClick={handleLogout}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
