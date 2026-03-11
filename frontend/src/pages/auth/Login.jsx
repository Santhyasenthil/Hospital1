import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Activity, Lock, Mail, Shield, Clock, Users } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'DOCTOR') navigate('/doctor/dashboard');
      else navigate('/patient/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (email, password) => {
    setForm({ email, password });
  };

  return (
    <div className="auth-container">
      <div className="auth-visual">
        <div>
          <h1 style={{ marginBottom: 8 }}>Medi<span>Care</span>+</h1>
          <p>Advanced hospital appointment and scheduling system for modern healthcare.</p>
        </div>
        <div className="auth-features">
          <div className="auth-feature">
            <div className="auth-feature-icon"><Activity size={20} color="#00b4d8" /></div>
            <p>Real-time appointment management</p>
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon"><Shield size={20} color="#00b4d8" /></div>
            <p>Role-based secure access control</p>
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon"><Clock size={20} color="#00b4d8" /></div>
            <p>Smart scheduling with overlap prevention</p>
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon"><Users size={20} color="#00b4d8" /></div>
            <p>Multi-department support</p>
          </div>
        </div>
        <div style={{ marginTop: 48, padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Quick Login</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button onClick={() => quickLogin('admin@hospital.com', 'Admin@123')} style={{ background: 'rgba(0,180,216,0.15)', border: '1px solid rgba(0,180,216,0.3)', color: '#00b4d8', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, textAlign: 'left' }}>
              🛡️ Admin: admin@hospital.com / Admin@123
            </button>
            <button onClick={() => quickLogin('priya@hospital.com', 'Doctor@123')} style={{ background: 'rgba(0,180,216,0.15)', border: '1px solid rgba(0,180,216,0.3)', color: '#00b4d8', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, textAlign: 'left' }}>
              👨‍⚕️ Doctor: priya@hospital.com / Doctor@123
            </button>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-container">
          <h2>Welcome back</h2>
          <p className="subtitle">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input type="email" className="form-input" style={{ paddingLeft: 42 }} placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input type="password" className="form-input" style={{ paddingLeft: 42 }} placeholder="••••••••"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, color: '#94a3b8', fontSize: 14 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#0077b6', fontWeight: 600 }}>Register as Patient</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
