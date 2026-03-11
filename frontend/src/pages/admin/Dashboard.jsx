import { useState, useEffect } from 'react';
import { appointmentAPI } from '../../api';
import { Users, Calendar, Activity, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentAPI.getDashboard().then(r => {
      setStats(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="topbar">
        <h1>Admin Dashboard</h1>
        <span style={{ color: '#64748b', fontSize: 14 }}>System Overview</span>
      </div>

      <div className="hero-banner" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0a1628 100%)' }}>
        <h2>🏥 Hospital Management</h2>
        <p>Full system control and analytics at your fingertips</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}><Users size={22} color="#1d4ed8" /></div>
          <div><div className="stat-value">{stats?.totalPatients || 0}</div><div className="stat-label">Total Patients</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5' }}><Activity size={22} color="#059669" /></div>
          <div><div className="stat-value">{stats?.totalDoctors || 0}</div><div className="stat-label">Total Doctors</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}><Calendar size={22} color="#d97706" /></div>
          <div><div className="stat-value">{stats?.totalAppointments || 0}</div><div className="stat-label">Total Appointments</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fce7f3' }}><TrendingUp size={22} color="#be185d" /></div>
          <div><div className="stat-value">{stats?.todayAppointments || 0}</div><div className="stat-label">Today's Appointments</div></div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 20, fontSize: 18 }}>Doctor Performance</h3>
        {stats?.doctorStats?.length === 0 ? (
          <div className="empty-state">
            <Activity size={40} />
            <h3>No data yet</h3>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Doctor</th><th>Specialization</th><th>Total Appointments</th><th>Performance</th></tr>
              </thead>
              <tbody>
                {stats?.doctorStats?.map(d => {
                  const maxAppts = Math.max(...(stats.doctorStats.map(x => x.totalAppointments) || [1]));
                  const pct = maxAppts > 0 ? (d.totalAppointments / maxAppts) * 100 : 0;
                  return (
                    <tr key={d.doctorId}>
                      <td style={{ fontWeight: 600 }}>{d.doctorName}</td>
                      <td style={{ color: '#64748b' }}>{d.specialization}</td>
                      <td style={{ fontWeight: 700, color: '#0077b6' }}>{d.totalAppointments}</td>
                      <td>
                        <div style={{ background: '#f1f5f9', borderRadius: 8, height: 8, width: 120 }}>
                          <div style={{ background: '#00b4d8', height: '100%', borderRadius: 8, width: `${pct}%`, transition: 'width 0.5s' }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
