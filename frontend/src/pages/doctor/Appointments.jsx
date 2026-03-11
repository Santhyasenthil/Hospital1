import { useState, useEffect } from 'react';
import { appointmentAPI } from '../../api';
import toast from 'react-hot-toast';
import { Calendar, CheckCircle, Award } from 'lucide-react';
import { format } from 'date-fns';

const StatusBadge = ({ status }) => (
  <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>
);

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const load = () => {
    appointmentAPI.getMine().then(r => {
      setAppointments(r.data);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleConfirm = async (id) => {
    try {
      await appointmentAPI.confirm(id);
      toast.success('Appointment confirmed!');
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to confirm');
    }
  };

  const handleComplete = async (id) => {
    try {
      await appointmentAPI.complete(id);
      toast.success('Appointment marked as completed');
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to complete');
    }
  };

  const statuses = ['ALL', 'BOOKED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
  const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter);

  return (
    <div>
      <div className="topbar">
        <h1>Appointments</h1>
        <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '6px 16px', borderRadius: 20, fontSize: 14, fontWeight: 600 }}>
          {appointments.length} Total
        </span>
      </div>

      <div className="filter-row">
        {statuses.map(s => (
          <button key={s} className={`filter-chip ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>{s}</button>
        ))}
      </div>

      <div className="card">
        {loading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} />
            <h3>No appointments</h3>
            <p>No {filter !== 'ALL' ? filter.toLowerCase() : ''} appointments found</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Patient</th><th>Date</th><th>Time</th><th>Notes</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{a.patientName}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>{a.patientEmail}</div>
                    </td>
                    <td>{format(new Date(a.appointmentDate), 'MMM dd, yyyy')}</td>
                    <td>{a.startTime?.slice(0, 5)} – {a.endTime?.slice(0, 5)}</td>
                    <td style={{ color: '#64748b', fontSize: 13 }}>{a.notes || '—'}</td>
                    <td><StatusBadge status={a.status} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {a.status === 'BOOKED' && (
                          <button className="btn btn-success btn-sm" onClick={() => handleConfirm(a.id)}>
                            <CheckCircle size={14} /> Confirm
                          </button>
                        )}
                        {a.status === 'CONFIRMED' && (
                          <button className="btn btn-primary btn-sm" onClick={() => handleComplete(a.id)}>
                            <Award size={14} /> Complete
                          </button>
                        )}
                      </div>
                    </td>
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
