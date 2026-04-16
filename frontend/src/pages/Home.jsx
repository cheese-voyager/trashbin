import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, CalendarClock, Activity } from 'lucide-react';

function Home() {
  return (
    <div className="container">
      <div className="page-header" style={{ margin: '80px 0' }}>
        <h1 className="page-title" style={{ fontSize: '3.5rem', marginBottom: '20px' }}>
          Sistem Manajemen Persampahan Cerdas
        </h1>
        <p className="page-subtitle" style={{ fontSize: '1.2rem', marginBottom: '40px' }}>
          Platform terpadu untuk pelaporan masalah sampah, pemantauan jadwal pengangkutan, dan manajemen petugas kebersihan untuk kota yang lebih bersih.
        </p>
        <Link to="/report" className="btn" style={{ padding: '15px 30px', fontSize: '1.2rem', borderRadius: '30px' }}>
          Cepuin yang buang sampah sembarangan sekarang <ArrowRight size={20} />
        </Link>
      </div>

      <div className="grid grid-cols-3">
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(14, 165, 233, 0.2)', padding: '20px', borderRadius: '50%' }}>
            <MapPin size={40} color="#0ea5e9" />
          </div>
          <h3 style={{ fontSize: '1.5rem', margin: '10px 0 0' }}>Lapor Sampah Liar</h3>
          <p style={{ color: 'var(--text-muted)' }}>Temukan tumpukan sampah ilegal? Laporkan segera beserta lokasi dan fotonya agar cepat ditangani.</p>
          <Link to="/report" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold', marginTop: 'auto' }}>Mulai Lapor &rarr;</Link>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '20px', borderRadius: '50%' }}>
            <CalendarClock size={40} color="#10b981" />
          </div>
          <h3 style={{ fontSize: '1.5rem', margin: '10px 0 0' }}>Jadwal Pengangkutan</h3>
          <p style={{ color: 'var(--text-muted)' }}>Pantau kapan truk sampah akan datang ke wilayah kecamatan Anda dengan sistem jadwal transparan.</p>
          <Link to="/schedule" style={{ color: 'var(--secondary)', textDecoration: 'none', fontWeight: 'bold', marginTop: 'auto' }}>Cek Jadwal &rarr;</Link>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '20px', borderRadius: '50%' }}>
            <Activity size={40} color="#f59e0b" />
          </div>
          <h3 style={{ fontSize: '1.5rem', margin: '10px 0 0' }}>Monitoring Petugas</h3>
          <p style={{ color: 'var(--text-muted)' }}>Pantau aktivitas dan status para petugas kebersihan yang sedang bertugas di lapangan.</p>
          <Link to="/workers" style={{ color: 'var(--warning)', textDecoration: 'none', fontWeight: 'bold', marginTop: 'auto' }}>Lihat Petugas &rarr;</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
