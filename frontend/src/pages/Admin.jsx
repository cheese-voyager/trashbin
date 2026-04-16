import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, CheckCircle, Clock, Plus, UserPlus } from 'lucide-react';

const API_URL = `http://${window.location.hostname}:8080/api`;

function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [reports, setReports] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form states for adding new data
  const [newSchedule, setNewSchedule] = useState({ location: '', truck_plate: '', status: 'Pending' });
  const [newWorker, setNewWorker] = useState({ name: '', area: '', status: 'Aktif' });

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'yupichocoglee') {
      setIsAuthenticated(true);
      fetchAllData();
    } else {
      alert('Password salah!');
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [rep, sch, wor] = await Promise.all([
        axios.get(`${API_URL}/reports`),
        axios.get(`${API_URL}/schedules`),
        axios.get(`${API_URL}/workers`)
      ]);
      setReports(rep.data || []);
      setSchedules(sch.data || []);
      setWorkers(wor.data || []);
    } catch (error) {
      console.error("Error fetching admin data", error);
    } finally {
      setLoading(false);
    }
  };

  // Actions
  const deleteItem = async (type, id) => {
    if (!window.confirm('Yakin ingin menghapus data ini?')) return;
    try {
      await axios.delete(`${API_URL}/${type}/${id}`);
      fetchAllData();
    } catch (error) {
      alert('Gagal menghapus data.');
    }
  };

  const updateReportStatus = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/reports/${id}`, { status: newStatus });
      fetchAllData();
    } catch (error) {
      alert('Gagal update status.');
    }
  };

  const addSchedule = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/schedules`, {
        ...newSchedule,
        collection_time: new Date().toISOString()
      });
      setNewSchedule({ location: '', truck_plate: '', status: 'Pending' });
      fetchAllData();
    } catch (error) {
      alert('Gagal menambah jadwal.');
    }
  };

  const addWorker = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/workers`, {
        ...newWorker,
        last_seen: new Date().toLocaleString()
      });
      setNewWorker({ name: '', area: '', status: 'Aktif' });
      fetchAllData();
    } catch (error) {
      alert('Gagal menambah petugas.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="glass-card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '20px' }}>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input 
                type="password" 
                className="form-control" 
                placeholder="Masukkan Password Admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            <button type="submit" className="btn" style={{ width: '100%', justifyContent: 'center' }}>Masuk</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Kelola Data Website (Admin)</h1>
        <p className="page-subtitle">Pusat kendali untuk mengelola seluruh data operasional SimaSampah.</p>
      </div>

      {loading && <p>Memuat data terbaru...</p>}

      {/* SECTION: REPORTS */}
      <section style={{ marginBottom: '50px' }}>
        <h2 style={{ marginBottom: '20px', borderLeft: '4px solid var(--primary)', paddingLeft: '15px' }}>Daftar Laporan Masyarakat</h2>
        <div className="glass-card" style={{ overflowX: 'auto', padding: '0' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Lokasi</th>
                <th>Deskripsi</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id}>
                  <td>{r.location}</td>
                  <td>{r.description}</td>
                  <td>
                    <select 
                      value={r.status} 
                      onChange={(e) => updateReportStatus(r.id, e.target.value)}
                      className="form-control"
                      style={{ padding: '4px 8px', fontSize: '0.85rem' }}
                    >
                      <option value="Dilaporkan">Dilaporkan</option>
                      <option value="Diproses">Diproses</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => deleteItem('reports', r.id)} className="btn btn-secondary" style={{ padding: '8px', color: '#ef4444' }}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-cols-2" style={{ gap: '30px' }}>
        {/* SECTION: SCHEDULES */}
        <section>
          <h2 style={{ marginBottom: '20px', borderLeft: '4px solid var(--secondary)', paddingLeft: '15px' }}>Kelola Jadwal</h2>
          <div className="glass-card" style={{ marginBottom: '20px' }}>
            <form onSubmit={addSchedule} style={{ display: 'grid', gap: '10px' }}>
              <input type="text" className="form-control" placeholder="Lokasi Kecamatan" value={newSchedule.location} onChange={e => setNewSchedule({...newSchedule, location: e.target.value})} required/>
              <input type="text" className="form-control" placeholder="Plat Nomor Truk" value={newSchedule.truck_plate} onChange={e => setNewSchedule({...newSchedule, truck_plate: e.target.value})} required/>
              <button type="submit" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}><Plus size={18}/> Tambah Jadwal</button>
            </form>
          </div>
          <div className="glass-card" style={{ padding: '0' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Lokasi</th>
                  <th>Plat</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map(s => (
                  <tr key={s.id}>
                    <td>{s.location}</td>
                    <td>{s.truck_plate}</td>
                    <td>
                      <button onClick={() => deleteItem('schedules', s.id)} className="btn btn-secondary" style={{ padding: '8px', color: '#ef4444' }}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION: WORKERS */}
        <section>
          <h2 style={{ marginBottom: '20px', borderLeft: '4px solid var(--warning)', paddingLeft: '15px' }}>Kelola Petugas</h2>
          <div className="glass-card" style={{ marginBottom: '20px' }}>
            <form onSubmit={addWorker} style={{ display: 'grid', gap: '10px' }}>
              <input type="text" className="form-control" placeholder="Nama Petugas" value={newWorker.name} onChange={e => setNewWorker({...newWorker, name: e.target.value})} required/>
              <input type="text" className="form-control" placeholder="Wilayah Tugas" value={newWorker.area} onChange={e => setNewWorker({...newWorker, area: e.target.value})} required/>
              <button type="submit" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}><UserPlus size={18}/> Tambah Petugas</button>
            </form>
          </div>
          <div className="glass-card" style={{ padding: '0' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Wilayah</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {workers.map(w => (
                  <tr key={w.id}>
                    <td>{w.name}</td>
                    <td>{w.area}</td>
                    <td>
                      <button onClick={() => deleteItem('workers', w.id)} className="btn btn-secondary" style={{ padding: '8px', color: '#ef4444' }}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Admin;
