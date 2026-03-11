import { useState, useEffect } from 'react';
import { doctorAPI } from '../../api';
import toast from 'react-hot-toast';
import { Plus, Trash2, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function ManageSlots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ date: '', startTime: '', endTime: '' });
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    doctorAPI.getMySlots().then(r => {
      setSlots(r.data);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.date || !form.startTime || !form.endTime) return toast.error('Fill all fields');
    if (form.startTime >= form.endTime) return toast.error('End time must be after start time');
    setAdding(true);
    try {
      await doctorAPI.addSlot(form);
      toast.success('Slot added successfully');
      setForm({ date: '', startTime: '', endTime: '' });
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add slot');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this slot?')) return;
    try {
      await doctorAPI.deleteSlot(id);
      toast.success('Slot deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div className="topbar">
        <h1>Manage Slots</h1>
        <button className="btn btn-teal" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> Add Slot
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 20, fontSize: 18 }}>Add New Availability Slot</h3>
          <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 16, alignItems: 'end' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Date</label>
              <input type="date" className="form-input" min={today}
                value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Start Time</label>
              <input type="time" className="form-input"
                value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} required />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">End Time</label>
              <input type="time" className="form-input"
                value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={adding}>
              {adding ? 'Adding...' : 'Add'}
            </button>
          </form>
        </div>
      )}

      <div className="card">
        <h3 style={{ marginBottom: 20, fontSize: 18 }}>Your Availability Slots</h3>
        {loading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : slots.length === 0 ? (
          <div className="empty-state">
            <Clock size={48} />
            <h3>No slots added</h3>
            <p>Add availability slots so patients can book appointments</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Date</th><th>Start Time</th><th>End Time</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {slots.map(slot => (
                  <tr key={slot.id}>
                    <td style={{ fontWeight: 600 }}>{format(new Date(slot.date), 'EEE, MMM dd yyyy')}</td>
                    <td>{slot.startTime?.slice(0, 5)}</td>
                    <td>{slot.endTime?.slice(0, 5)}</td>
                    <td>
                      <span className={`badge ${slot.booked ? 'badge-confirmed' : 'badge-booked'}`}>
                        {slot.booked ? 'Booked' : 'Available'}
                      </span>
                    </td>
                    <td>
                      {!slot.booked && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(slot.id)}>
                          <Trash2 size={14} />
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
