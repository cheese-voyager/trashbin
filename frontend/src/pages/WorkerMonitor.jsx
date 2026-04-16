import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserCircle, MapPin, Activity } from 'lucide-react';

const API_URL = `http://${window.location.hostname}:8080/api`;

function WorkerMonitor() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkers();
    // Simulate real-time update
    const interval = setInterval(fetchWorkers, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchWorkers = async () => {
    try {
      const response = await axios.get(`${API_URL}/workers`);
      setWorkers(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching workers", error);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Monitoring Petugas Kebersihan</h1>
        <p className="page-subtitle">Sistem pemantauan status dan lokasi petugas kebersihan secara real-time.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Memuat data petugas...</div>
      ) : (
        <div className="grid grid-cols-3">
          {workers.map((worker) => (
            <div key={worker.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: worker.status === 'Aktif' ? 'var(--secondary)' : worker.status === 'Istirahat' ? 'var(--warning)' : 'var(--danger)' }}></div>
              
              <div style={{ position: 'relative', marginTop: '10px' }}>
                <UserCircle size={80} color="#94a3b8" />
                <span className={`status-dot ${worker.status === 'Aktif' ? 'active' : ''}`} style={{ 
                  position: 'absolute', 
                  bottom: '5px', 
                  right: '10px', 
                  width: '16px', 
                  height: '16px', 
                  border: '3px solid var(--surface)',
                  background: worker.status === 'Aktif' ? 'var(--secondary)' : worker.status === 'Istirahat' ? 'var(--warning)' : 'var(--danger)'
                }}></span>
              </div>

              <div style={{ textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.4rem' }}>{worker.name}</h3>
                <span className={`badge ${worker.status === 'Aktif' ? 'badge-success' : worker.status === 'Istirahat' ? 'badge-warning' : 'badge-danger'}`} style={{ marginBottom: '15px', display: 'inline-block' }}>
                  {worker.status}
                </span>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <MapPin size={16} /> Area: {worker.area}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <Activity size={16} /> Last Seen: {worker.last_seen.substring(0, 19)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WorkerMonitor;
