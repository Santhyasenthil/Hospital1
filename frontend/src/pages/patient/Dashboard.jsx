import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appointmentAPI, doctorsAPI } from '../../api';
import { Calendar, Search, Clock, CheckCircle, XCircle, Activity } from 'lucide-react';
import { format } from 'date-fns';

const StatusBadge = ({ status }) => (
  <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>
);

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentAPI.getMine().then(r => {
      setAppointments(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const stats = {
    total: appointments.length,
    upcoming: appointments.filter(a => ['BOOKED', 'CONFIRMED'].includes(a.status)).length,
    completed: appointments.filter(a => a.status === 'COMPLETED').length,
    cancelled: appointments.filter(a => a.status === 'CANCELLED').length,
  };

  return (
    <div>
      <div className="hero-banner">
        <h2>Good day, {user?.name?.split(' ')[0]} 👋</h2>
        <p>Manage your health appointments with ease</p>
        <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
          <Link to="/patient/doctors" className="btn btn-teal">
            <Search size={16} /> Find a Doctor
          </Link>
          <Link to="/patient/appointments" className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
            <Calendar size={16} /> My Appointments
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}><Activity size={22} color="#1d4ed8" /></div>
          <div><div className="stat-value">{stats.total}</div><div className="stat-label">Total Appointments</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}><Clock size={22} color="#d97706" /></div>
          <div><div className="stat-value">{stats.upcoming}</div><div className="stat-label">Upcoming</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5' }}><CheckCircle size={22} color="#059669" /></div>
          <div><div className="stat-value">{stats.completed}</div><div className="stat-label">Completed</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fee2e2' }}><XCircle size={22} color="#dc2626" /></div>
          <div><div className="stat-value">{stats.cancelled}</div><div className="stat-label">Cancelled</div></div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 20, fontSize: 18 }}>Recent Appointments</h3>
        {loading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : appointments.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} />
            <h3>No appointments yet</h3>
            <p>Book your first appointment with one of our specialists</p>
            <Link to="/patient/doctors" className="btn btn-teal" style={{ marginTop: 16 }}>Find Doctors</Link>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Specialization</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 5).map(a => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 600 }}>{a.doctorName}</td>
                    <td style={{ color: '#64748b' }}>{a.doctorSpecialization}</td>
                    <td>{format(new Date(a.appointmentDate), 'MMM dd, yyyy')}</td>
                    <td>{a.startTime?.slice(0, 5)} – {a.endTime?.slice(0, 5)}</td>
                    <td><StatusBadge status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
