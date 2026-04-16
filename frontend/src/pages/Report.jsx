import { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, MapPin, Search } from 'lucide-react';

const API_URL = 'http://localhost:8080/api';

function Report() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    location: '',
    latitude: '',
    longitude: '',
    image: null
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get(`${API_URL}/reports`);
      setReports(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reports", error);
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          alert('Gagal mendapatkan lokasi. Silahkan masukkan manual.');
        }
      );
    } else {
      alert('Geolocation tidak didukung di browser Anda.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const data = new FormData();
    data.append('description', formData.description);
    data.append('location', formData.location);
    data.append('latitude', formData.latitude);
    data.append('longitude', formData.longitude);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      await axios.post(`${API_URL}/reports`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Laporan berhasil dikirim!');
      setFormData({ description: '', location: '', latitude: '', longitude: '', image: null });
      fetchReports();
    } catch (error) {
      console.error("Error submitting report", error);
      alert('Gagal mengirim laporan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Lapor Sampah Liar</h1>
        <p className="page-subtitle">Mari bersama-sama menjaga kebersihan lingkungan dengan melaporkan tumpukan sampah ilegal.</p>
      </div>

      <div className="grid grid-cols-2">
        <div className="glass-card">
          <h2 style={{ marginBottom: '20px' }}>Buat Laporan Baru</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Deskripsi Kejadian</label>
              <textarea 
                className="form-control" 
                rows="3" 
                required
                placeholder="Jelaskan kondisi tumpukan sampah (ex: Sampah organik membusuk di pinggir jalan...)"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>
            
            <div className="form-group">
              <label className="form-label">Lokasi Detail</label>
              <input 
                type="text" 
                className="form-control" 
                required
                placeholder="Jl. Merdeka Raya No 102..."
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Koordinat Lokasi</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  className="form-control" 
                  style={{ flex: 1 }}
                  placeholder="Latitude"
                  value={formData.latitude}
                  onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                />
                <input 
                  type="text" 
                  className="form-control" 
                  style={{ flex: 1 }}
                  placeholder="Longitude"
                  value={formData.longitude}
                  onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                />
                <button type="button" className="btn btn-secondary" onClick={getUserLocation} title="Dapatkan Lokasi Saat Ini">
                  <MapPin size={20} />
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Foto Bukti (Wajib)</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="file" 
                  accept="image/*"
                  required
                  id="file-upload"
                  style={{ display: 'none' }}
                  onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                />
                <label 
                  htmlFor="file-upload" 
                  className="form-control" 
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px', border: '2px dashed rgba(255,255,255,0.2)', cursor: 'pointer', flexDirection: 'column', gap: '10px' }}
                >
                  <Camera size={32} color={formData.image ? '#10b981' : '#94a3b8'} />
                  <span style={{ color: formData.image ? '#10b981' : '#94a3b8' }}>
                    {formData.image ? formData.image.name : 'Klik untuk upload foto sampah'}
                  </span>
                </label>
              </div>
            </div>

            <button type="submit" className="btn" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} disabled={submitting}>
              {submitting ? 'Mengirim...' : 'Kirim Laporan'}
            </button>
          </form>
        </div>

        <div>
          <h2 style={{ marginBottom: '20px' }}>Daftar Laporan Terkini</h2>
          {loading ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>Memuat data...</div>
          ) : reports.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>Belum ada laporan di database.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '600px', overflowY: 'auto', paddingRight: '10px' }}>
              {reports.map((report) => (
                <div key={report.id} className="glass-card" style={{ padding: '20px', display: 'flex', gap: '20px' }}>
                  {report.image_url ? (
                    <img src={report.image_url} alt="Sampah" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                  ) : (
                    <div style={{ width: '100px', height: '100px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Camera color="#64748b" />
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>{report.location}</h4>
                      <span className={`badge ${report.status === 'Selesai' ? 'badge-success' : 'badge-warning'}`}>
                        {report.status}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', margin: '0 0 8px 0', fontSize: '0.9rem' }}>{report.description}</p>
                    <small style={{ color: '#64748b' }}>Dilaporkan: {new Date(report.created_at).toLocaleString()}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Report;
