import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import { Users, UserCheck, Stethoscope } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminUsers() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('doctors');

  useEffect(() => {
    Promise.all([adminAPI.getPatients(), adminAPI.getDoctors()]).then(([p, d]) => {
      setPatients(p.data);
      setDoctors(d.data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div className="topbar">
        <h1>Users Management</h1>
      </div>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}><Stethoscope size={22} color="#1d4ed8" /></div>
          <div><div className="stat-value">{doctors.length}</div><div className="stat-label">Doctors</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5' }}><UserCheck size={22} color="#059669" /></div>
          <div><div className="stat-value">{patients.length}</div><div className="stat-label">Patients</div></div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <button className={`filter-chip ${tab === 'doctors' ? 'active' : ''}`} onClick={() => setTab('doctors')}>
          <Stethoscope size={14} style={{ display: 'inline', marginRight: 6 }} />Doctors ({doctors.length})
        </button>
        <button className={`filter-chip ${tab === 'patients' ? 'active' : ''}`} onClick={() => setTab('patients')}>
          <Users size={14} style={{ display: 'inline', marginRight: 6 }} />Patients ({patients.length})
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : tab === 'doctors' ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Specialization</th><th>Department</th><th>Joined</th></tr>
              </thead>
              <tbody>
                {doctors.map(d => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 600 }}>{d.name}</td>
                    <td style={{ color: '#64748b' }}>{d.email}</td>
                    <td><span className="badge badge-confirmed">{d.specialization || '—'}</span></td>
                    <td>{d.department || '—'}</td>
                    <td style={{ color: '#94a3b8', fontSize: 13 }}>{d.createdAt ? format(new Date(d.createdAt), 'MMM dd, yyyy') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th></tr>
              </thead>
              <tbody>
                {patients.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td style={{ color: '#64748b' }}>{p.email}</td>
                    <td>{p.phone || '—'}</td>
                    <td style={{ color: '#94a3b8', fontSize: 13 }}>{p.createdAt ? format(new Date(p.createdAt), 'MMM dd, yyyy') : '—'}</td>
                  </tr>
                ))}
                {patients.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: '#94a3b8', padding: 40 }}>No patients registered yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
