import { useState, useEffect } from 'react';
import { appointmentAPI } from '../../api';
import toast from 'react-hot-toast';
import { Calendar, X } from 'lucide-react';
import { format } from 'date-fns';

const StatusBadge = ({ status }) => (
  <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>
);

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const load = () => {
    appointmentAPI.getAll().then(r => {
      setAppointments(r.data);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment? (Admin override)')) return;
    try {
      await appointmentAPI.cancel(id);
      toast.success('Appointment cancelled by Admin');
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
    }
  };

  const statuses = ['ALL', 'BOOKED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
  let filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter);
  if (search) filtered = filtered.filter(a =>
    a.patientName?.toLowerCase().includes(search.toLowerCase()) ||
    a.doctorName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="topbar">
        <h1>All Appointments</h1>
        <span style={{ background: '#fef3c7', color: '#92400e', padding: '6px 16px', borderRadius: 20, fontSize: 14, fontWeight: 600 }}>
          Admin View
        </span>
      </div>

      <div className="search-bar" style={{ marginBottom: 16 }}>
        <input placeholder="Search by patient or doctor name..." value={search} onChange={e => setSearch(e.target.value)} />
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
            <h3>No appointments found</h3>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 600 }}>{a.patientName}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{a.doctorName}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>{a.doctorSpecialization}</div>
                    </td>
                    <td>{format(new Date(a.appointmentDate), 'MMM dd, yyyy')}</td>
                    <td>{a.startTime?.slice(0, 5)} – {a.endTime?.slice(0, 5)}</td>
                    <td><StatusBadge status={a.status} /></td>
                    <td>
                      {!['CANCELLED', 'COMPLETED'].includes(a.status) && (
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
