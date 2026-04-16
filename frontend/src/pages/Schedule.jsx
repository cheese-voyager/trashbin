import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Truck, Clock } from 'lucide-react';

const API_URL = `http://${window.location.hostname}:8080/api`;

function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get(`${API_URL}/schedules`);
      setSchedules(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching schedules", error);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Jadwal Pengangkutan Sampah</h1>
        <p className="page-subtitle">Pantau jadwal pengangkutan sampah di wilayah Anda agar tidak tertinggal jadwal pembuangan.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Memuat data jadwal...</div>
      ) : (
        <div className="grid grid-cols-2">
          {schedules.map((sched) => (
            <div key={sched.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--primary)' }}>{sched.location}</h3>
                <span className={`badge ${sched.status === 'Selesai' ? 'badge-success' : sched.status === 'Dalam Perjalanan' ? 'badge-primary' : 'badge-warning'}`}>
                  {sched.status}
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)' }}>
                <Calendar size={20} color="#94a3b8" />
                <span style={{ fontSize: '1.1rem' }}>{new Date(sched.collection_time).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)' }}>
                <Clock size={20} color="#94a3b8" />
                <span style={{ fontSize: '1.1rem' }}>{new Date(sched.collection_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)' }}>
                <Truck size={20} color="#94a3b8" />
                <span style={{ fontSize: '1.1rem' }}>Plat Truk: <strong>{sched.truck_plate}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Schedule;
