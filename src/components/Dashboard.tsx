import { getStatistics, callSessions, devices, callEvents, nurses } from '../data/mockData';

interface DashboardProps {
  onNavigate: (page: any) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const stats = getStatistics();
  const activeSessions = callSessions.filter(s => s.status === 'active');

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Panggilan Aktif"
          value={stats.activeCalls}
          icon="fa-phone-volume"
          color="red"
          subtitle="Memerlukan perhatian"
        />
        <StatCard
          title="Perangkat Online"
          value={`${stats.onlineDevices}/${stats.totalDevices}`}
          icon="fa-microchip"
          color="green"
          subtitle={`${stats.faultDevices} fault, ${stats.offlineDevices} offline`}
        />
        <StatCard
          title="Rata-rata Respon"
          value={`${stats.avgResponseTime}d`}
          icon="fa-clock"
          color="blue"
          subtitle="Detik dari panggilan"
        />
        <StatCard
          title="Perawat Aktif"
          value={stats.activeNurses}
          icon="fa-user-nurse"
          color="purple"
          subtitle={`dari ${stats.totalNurses} total perawat`}
        />
      </div>

      {/* Active Calls Alert */}
      {activeSessions.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <h3 className="font-semibold text-red-800">⚠️ Panggilan Aktif - Memerlukan Respon</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeSessions.map(session => {
              const room = session.room_id;
              const nurse = nurses.find(n => n.id === session.nurse_id);
              return (
                <div key={session.id} className="bg-white rounded-lg p-3 border border-red-100 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">Kamar {room}</p>
                    <p className="text-sm text-gray-600">{session.patient_name}</p>
                    <p className="text-xs text-red-600 font-medium">{session.call_type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Perawat: {nurse?.name || '-'}</p>
                    <p className="text-xs text-gray-500">
                      Mulai: {new Date(session.start_time).toLocaleTimeString('id-ID')}
                    </p>
                    <div className="mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full inline-block">
                      AKTIF
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Call Events */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Event Panggilan Terbaru</h3>
            <button onClick={() => onNavigate('call-events')} className="text-sm text-blue-600 hover:underline">
              Lihat Semua →
            </button>
          </div>
          <div className="space-y-3">
            {callEvents.slice(0, 5).map(event => {
              const device = devices.find(d => d.id === event.device_id);
              const nurse = nurses.find(n => n.id === event.acknowledged_by);
              return (
                <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    event.priority === 'critical' ? 'bg-red-100 text-red-600' :
                    event.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                    event.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    <i className={`fas ${
                      event.event_type === 'emergency_call' ? 'fa-exclamation-triangle' :
                      event.event_type === 'bathroom_call' ? 'fa-bath' :
                      event.event_type === 'cancel_call' ? 'fa-times-circle' :
                      'fa-phone'
                    }`}></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      Kamar {event.room_id} - {device?.device_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {event.event_type.replace('_', ' ')} • {nurse?.name || 'Belum direspon'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(event.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      event.priority === 'critical' ? 'bg-red-100 text-red-700' :
                      event.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      event.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {event.priority}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device Status Summary */}
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Status Perangkat</h3>
            <button onClick={() => onNavigate('device-status')} className="text-sm text-blue-600 hover:underline">
              Detail →
            </button>
          </div>
          <div className="space-y-4">
            <DeviceStatusItem label="Online" count={stats.onlineDevices} total={stats.totalDevices} color="green" />
            <DeviceStatusItem label="Offline" count={stats.offlineDevices} total={stats.totalDevices} color="gray" />
            <DeviceStatusItem label="Fault" count={stats.faultDevices} total={stats.totalDevices} color="red" />
          </div>

          <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Perawat On Duty</h4>
            <div className="space-y-2">
              {nurses.filter(n => n.status === 'on_duty').map(nurse => (
                <div key={nurse.id} className="flex items-center gap-2">
                  <span className="text-lg">{nurse.avatar}</span>
                  <div>
                    <p className="text-sm text-gray-700">{nurse.name}</p>
                    <p className="text-[10px] text-gray-500">Lantai {nurse.floor} • Shift {nurse.shift}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">{stats.totalCalls}</p>
          <p className="text-xs text-gray-500">Total Panggilan Hari Ini</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">{stats.emergencyCalls}</p>
          <p className="text-xs text-gray-500">Panggilan Darurat</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">{stats.resolvedToday}</p>
          <p className="text-xs text-gray-500">Sesi Diselesaikan</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">{stats.totalRooms}</p>
          <p className="text-xs text-gray-500">Total Kamar</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, subtitle }: { title: string; value: string | number; icon: string; color: string; subtitle: string }) {
  const colors: Record<string, string> = {
    red: 'bg-red-50 text-red-600 border-red-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  };
  const iconColors: Record<string, string> = {
    red: 'bg-red-100 text-red-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <p className="text-xs mt-1 opacity-70">{subtitle}</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconColors[color]}`}>
          <i className={`fas ${icon} text-lg`}></i>
        </div>
      </div>
    </div>
  );
}

function DeviceStatusItem({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const barColors: Record<string, string> = {
    green: 'bg-green-500',
    gray: 'bg-gray-400',
    red: 'bg-red-500',
  };
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-800">{count}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`h-2 rounded-full ${barColors[color]}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}
