import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Trash2, MapPin, Calendar, Users } from 'lucide-react';
import Home from './pages/Home';
import Report from './pages/Report';
import Schedule from './pages/Schedule';
import WorkerMonitor from './pages/WorkerMonitor';
import Admin from './pages/Admin';
import './index.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <Trash2 size={28} color="#0ea5e9" />
        Trashbin
      </Link>
      <div className="nav-links">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
        <Link to="/report" className={`nav-link ${location.pathname === '/report' ? 'active' : ''}`}>Jasa cepuin</Link>
        <Link to="/schedule" className={`nav-link ${location.pathname === '/schedule' ? 'active' : ''}`}>Jadwal</Link>
        <Link to="/workers" className={`nav-link ${location.pathname === '/workers' ? 'active' : ''}`}>Monitoring</Link>
        <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>Kelola Data</Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<Report />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/workers" element={<WorkerMonitor />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
