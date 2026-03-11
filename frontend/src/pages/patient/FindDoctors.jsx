import { useState, useEffect } from 'react';
import { doctorsAPI, appointmentAPI } from '../../api';
import toast from 'react-hot-toast';
import { Search, X, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function FindDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    Promise.all([
      doctorsAPI.getAll(),
      doctorsAPI.getSpecializations()
    ]).then(([dr, sp]) => {
      setDoctors(dr.data);
      setSpecializations(sp.data);
      setLoading(false);
    });
  }, []);

  const filtered = doctors.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization?.toLowerCase().includes(search.toLowerCase());
    const matchSpec = !selectedSpec || d.specialization === selectedSpec;
    return matchSearch && matchSpec;
  });

  const openBooking = async (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedSlot(null);
    setNotes('');
    const res = await doctorsAPI.getAvailableSlots(doctor.id);
    setSlots(res.data);
  };

  const handleBook = async () => {
    if (!selectedSlot) return toast.error('Please select a time slot');
    setBooking(true);
    try {
      await appointmentAPI.book({
        doctorId: selectedDoctor.id,
        appointmentDate: selectedSlot.date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        notes,
      });
      toast.success('Appointment booked successfully!');
      setSelectedDoctor(null);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  const initials = (name) => name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div>
      <div className="topbar">
        <h1>Find Doctors</h1>
      </div>

      <div className="search-bar">
        <Search size={18} color="#94a3b8" />
        <input placeholder="Search by name or specialization..." value={search} onChange={e => setSearch(e.target.value)} />
        {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: '#94a3b8' }}><X size={16} /></button>}
      </div>

      <div className="filter-row">
        <button className={`filter-chip ${!selectedSpec ? 'active' : ''}`} onClick={() => setSelectedSpec('')}>All</button>
        {specializations.map(s => (
          <button key={s} className={`filter-chip ${selectedSpec === s ? 'active' : ''}`} onClick={() => setSelectedSpec(s)}>{s}</button>
        ))}
      </div>

      {loading ? (
        <div className="spinner-container"><div className="spinner"></div></div>
      ) : (
        <div className="doctors-grid">
          {filtered.map(doctor => (
            <div key={doctor.id} className="doctor-card" onClick={() => openBooking(doctor)}>
              <div className="doctor-avatar">{initials(doctor.name)}</div>
              <div className="doctor-name">{doctor.name}</div>
              <div className="doctor-spec">{doctor.specialization}</div>
              <div className="doctor-dept">{doctor.department}</div>
              <button className="btn btn-teal btn-sm" style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}>
                <Calendar size={14} /> Book Appointment
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="empty-state" style={{ gridColumn: '1/-1' }}>
              <Search size={48} />
              <h3>No doctors found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      )}

      {selectedDoctor && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelectedDoctor(null)}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Book with {selectedDoctor.name}</h3>
              <button onClick={() => setSelectedDoctor(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
            </div>

            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>
              {selectedDoctor.specialization} • {selectedDoctor.department}
            </p>

            {slots.length === 0 ? (
              <div className="empty-state" style={{ padding: '32px 0' }}>
                <Clock size={36} />
                <h3>No available slots</h3>
                <p>This doctor hasn't added any upcoming slots yet.</p>
              </div>
            ) : (
              <>
                <p style={{ fontWeight: 600, marginBottom: 8, fontSize: 14, color: '#334155' }}>Select a Time Slot</p>
                <div className="slots-grid">
                  {slots.map(slot => (
                    <button key={slot.id}
                      className={`slot-btn ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
                      onClick={() => setSelectedSlot(slot)}>
                      <div style={{ fontWeight: 600 }}>{slot.startTime?.slice(0, 5)}</div>
                      <div style={{ fontSize: 11, opacity: 0.7 }}>{format(new Date(slot.date), 'MMM dd')}</div>
                    </button>
                  ))}
                </div>

                <div className="form-group" style={{ marginTop: 20 }}>
                  <label className="form-label">Notes (optional)</label>
                  <textarea className="form-input" rows={3} placeholder="Describe your symptoms or reason for visit..."
                    value={notes} onChange={e => setNotes(e.target.value)} style={{ resize: 'vertical' }} />
                </div>

                <button className="btn btn-teal btn-lg" style={{ width: '100%', justifyContent: 'center' }}
                  onClick={handleBook} disabled={booking || !selectedSlot}>
                  {booking ? 'Booking...' : 'Confirm Appointment'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
