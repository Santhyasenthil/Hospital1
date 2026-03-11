import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appointmentAPI, doctorAPI } from '../../api';
import { Calendar, Clock, CheckCircle, Activity } from 'lucide-react';
import { format } from 'date-fns';

const StatusBadge = ({ status }) => (
  <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>
);

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      appointmentAPI.getMine(),
      doctorAPI.getMySlots()
    ]).then(([a, s]) => {
      setAppointments(a.data);
      setSlots(s.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const stats = {
    total: appointments.length,
    booked: appointments.filter(a => a.status === 'BOOKED').length,
    confirmed: appointments.filter(a => a.status === 'CONFIRMED').length,
    availableSlots: slots.filter(s => !s.booked).length,
  };

  return (
    <div>
      <div className="hero-banner">
        <h2>Dr. {user?.name?.split(' ').slice(1).join(' ') || user?.name} 👨‍⚕️</h2>
        <p>Manage your appointments and availability</p>
        <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
          <Link to="/doctor/slots" className="btn btn-teal"><Clock size={16} /> Manage Slots</Link>
          <Link to="/doctor/appointments" className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
            <Calendar size={16} /> Appointments
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}><Activity size={22} color="#1d4ed8" /></div>
          <div><div className="stat-value">{stats.total}</div><div className="stat-label">Total Appointments</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}><Calendar size={22} color="#d97706" /></div>
          <div><div className="stat-value">{stats.booked}</div><div className="stat-label">Awaiting Confirmation</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5' }}><CheckCircle size={22} color="#059669" /></div>
          <div><div className="stat-value">{stats.confirmed}</div><div className="stat-label">Confirmed</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f0fdf4' }}><Clock size={22} color="#16a34a" /></div>
          <div><div className="stat-value">{stats.availableSlots}</div><div className="stat-label">Open Slots</div></div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 20, fontSize: 18 }}>Pending Confirmations</h3>
        {loading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : appointments.filter(a => a.status === 'BOOKED').length === 0 ? (
          <div className="empty-state">
            <CheckCircle size={40} />
            <h3>All caught up!</h3>
            <p>No pending appointments to confirm</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Patient</th><th>Date</th><th>Time</th><th>Status</th></tr>
              </thead>
              <tbody>
                {appointments.filter(a => a.status === 'BOOKED').map(a => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 600 }}>{a.patientName}</td>
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
