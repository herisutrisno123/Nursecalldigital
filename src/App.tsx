import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import CallEvents from './components/CallEvents';
import DeviceStatus from './components/DeviceStatus';
import NurseActivity from './components/NurseActivity';
import RoomMap from './components/RoomMap';
import Statistics from './components/Statistics';
import Integration from './components/Integration';
import Accounts from './components/Accounts';
import Settings from './components/Settings';
import DatabaseView from './components/DatabaseView';

type Page = 'dashboard' | 'call-events' | 'device-status' | 'nurse-activity' | 'room-map' | 'statistics' | 'integration' | 'database' | 'accounts' | 'settings';

const menuItems: { id: Page; label: string; icon: string; section?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fa-gauge-high', section: 'Monitoring' },
  { id: 'call-events', label: 'Event Panggilan', icon: 'fa-phone-volume' },
  { id: 'device-status', label: 'Status Perangkat', icon: 'fa-microchip' },
  { id: 'nurse-activity', label: 'Aktivitas Perawat', icon: 'fa-user-nurse' },
  { id: 'room-map', label: 'Peta Kamar', icon: 'fa-map-location-dot', section: 'Peta & Visualisasi' },
  { id: 'statistics', label: 'Statistik Operasional', icon: 'fa-chart-line' },
  { id: 'integration', label: 'Integrasi Gateway', icon: 'fa-network-wired' },
  { id: 'database', label: 'Struktur Database', icon: 'fa-database', section: 'Sistem' },
  { id: 'accounts', label: 'Kelola Akun', icon: 'fa-users-gear' },
  { id: 'settings', label: 'Pengaturan', icon: 'fa-gear' },
];

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={setCurrentPage} />;
      case 'call-events': return <CallEvents />;
      case 'device-status': return <DeviceStatus />;
      case 'nurse-activity': return <NurseActivity />;
      case 'room-map': return <RoomMap />;
      case 'statistics': return <Statistics />;
      case 'integration': return <Integration />;
      case 'database': return <DatabaseView />;
      case 'accounts': return <Accounts />;
      case 'settings': return <Settings />;
      default: return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  // Compute which items should show section headers
  const menuWithSections = menuItems.map((item, index) => {
    const prevItem = index > 0 ? menuItems[index - 1] : null;
    const showSection = item.section && (!prevItem || prevItem.section !== item.section);
    return { ...item, showSection };
  });

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 flex flex-col shadow-xl`}>
        {/* Logo */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="fas fa-hospital text-white text-sm"></i>
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-sm leading-tight">Nurse Digital</h1>
                <p className="text-[10px] text-slate-400">Commax Monitor System</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuWithSections.map((item) => (
            <div key={item.id}>
              {item.showSection && sidebarOpen && (
                <p className="px-4 pt-4 pb-1 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{item.section}</p>
              )}
              <button
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all ${
                  currentPage === item.id
                    ? 'bg-blue-600/20 text-blue-400 border-r-2 border-blue-400'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <i className={`fas ${item.icon} w-5 text-center flex-shrink-0`}></i>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>System Online</span>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <i className="fas fa-bars text-lg"></i>
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {menuItems.find(m => m.id === currentPage)?.label || 'Dashboard'}
              </h2>
              <p className="text-xs text-gray-500">
                {currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                {' • '}
                {currentTime.toLocaleTimeString('id-ID')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Active Alerts */}
            <div className="relative">
              <button className="text-gray-500 hover:text-gray-700 p-2">
                <i className="fas fa-bell"></i>
                <span className="absolute -top-0 -right-0 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">3</span>
              </button>
            </div>
            {/* User */}
            <div className="flex items-center gap-2 pl-4 border-l">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-blue-600 text-sm"></i>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">Admin</p>
                <p className="text-[10px] text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
