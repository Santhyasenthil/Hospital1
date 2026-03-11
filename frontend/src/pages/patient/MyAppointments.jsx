import { useState, useEffect } from 'react';
import { appointmentAPI } from '../../api';
import toast from 'react-hot-toast';
import { Calendar, X } from 'lucide-react';
import { format } from 'date-fns';

const StatusBadge = ({ status }) => (
  <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>
);

export default function MyAppointments() {
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

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    try {
      await appointmentAPI.cancel(id);
      toast.success('Appointment cancelled');
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to cancel');
    }
  };

  const statuses = ['ALL', 'BOOKED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
  const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter);

  return (
    <div>
      <div className="topbar">
        <h1>My Appointments</h1>
      </div>

      <div className="filter-row">
        {statuses.map(s => (
          <button key={s} className={`filter-chip ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s}
          </button>
        ))}
      </div>

      <div className="card">
        {loading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} />
            <h3>No appointments found</h3>
            <p>No {filter !== 'ALL' ? filter.toLowerCase() : ''} appointments</p>
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 600 }}>{a.doctorName}</td>
                    <td style={{ color: '#64748b' }}>{a.doctorSpecialization}</td>
                    <td>{format(new Date(a.appointmentDate), 'MMM dd, yyyy')}</td>
                    <td>{a.startTime?.slice(0, 5)} – {a.endTime?.slice(0, 5)}</td>
                    <td><StatusBadge status={a.status} /></td>
                    <td>
                      {a.status === 'BOOKED' && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleCancel(a.id)}>
                          <X size={14} /> Cancel
                        </button>
                      )}
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
