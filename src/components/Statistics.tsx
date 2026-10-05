import { callEvents, callSessions, devices, nurses, rooms, nurseActions } from '../data/mockData';

export default function Statistics() {
  const totalCalls = callEvents.length;
  const emergencyCalls = callEvents.filter(e => e.event_type === 'emergency_call').length;
  const normalCalls = callEvents.filter(e => e.event_type === 'normal_call').length;
  const bathroomCalls = callEvents.filter(e => e.event_type === 'bathroom_call').length;
  const cancelCalls = callEvents.filter(e => e.event_type === 'cancel_call').length;

  const resolvedSessions = callSessions.filter(s => s.duration_seconds);
  const avgDuration = resolvedSessions.length > 0
    ? Math.round(resolvedSessions.reduce((acc, s) => acc + (s.duration_seconds || 0), 0) / resolvedSessions.length)
    : 0;

  const avgResponseTime = callSessions.filter(s => s.response_time).length > 0
    ? Math.round(
        callSessions.filter(s => s.response_time).reduce((acc, s) =>
          acc + (new Date(s.response_time!).getTime() - new Date(s.start_time).getTime()) / 1000, 0
        ) / callSessions.filter(s => s.response_time).length
      )
    : 0;

  // Calls per room
  const callsPerRoom: Record<string, number> = {};
  callEvents.forEach(e => {
    callsPerRoom[e.room_id] = (callsPerRoom[e.room_id] || 0) + 1;
  });

  // Calls by hour (simulated)
  const callsByHour = [2, 1, 0, 1, 1, 0, 1, 1, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  // Nurse performance
  const nursePerformance = nurses.map(nurse => {
    const actions = nurseActions.filter(a => a.nurse_id === nurse.id);
    const sessions = callSessions.filter(s => s.nurse_id === nurse.id);
    return {
      ...nurse,
      totalActions: actions.length,
      totalSessions: sessions.length,
      avgResponse: sessions.filter(s => s.response_time).length > 0
        ? Math.round(sessions.filter(s => s.response_time).reduce((acc, s) =>
            acc + (new Date(s.response_time!).getTime() - new Date(s.start_time).getTime()) / 1000, 0
          ) / sessions.filter(s => s.response_time).length)
        : 0,
    };
  });

  const maxCallsByHour = Math.max(...callsByHour);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-phone text-blue-600"></i>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{totalCalls}</p>
              <p className="text-xs text-gray-500">Total Panggilan</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-exclamation-triangle text-red-600"></i>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{emergencyCalls}</p>
              <p className="text-xs text-gray-500">Panggilan Darurat</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-stopwatch text-green-600"></i>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{avgResponseTime}s</p>
              <p className="text-xs text-gray-500">Rata-rata Respon</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-hourglass-half text-purple-600"></i>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{Math.floor(avgDuration / 60)}m</p>
              <p className="text-xs text-gray-500">Rata-rata Durasi</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Call Distribution */}
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Distribusi Tipe Panggilan</h3>
          <div className="space-y-4">
            <CallBar label="Normal Call" count={normalCalls} total={totalCalls} color="bg-green-500" />
            <CallBar label="Emergency Call" count={emergencyCalls} total={totalCalls} color="bg-red-500" />
            <CallBar label="Bathroom Call" count={bathroomCalls} total={totalCalls} color="bg-blue-500" />
            <CallBar label="Cancel Call" count={cancelCalls} total={totalCalls} color="bg-gray-400" />
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Event</span>
              <span className="font-bold text-gray-800">{totalCalls}</span>
            </div>
          </div>
        </div>

        {/* Calls by Hour */}
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Panggilan per Jam (Hari Ini)</h3>
          <div className="flex items-end gap-1 h-40">
            {callsByHour.map((count, hour) => (
              <div key={hour} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="text-[9px] text-gray-500 mb-1">{count > 0 ? count : ''}</span>
                <div
                  className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                  style={{ height: `${maxCallsByHour > 0 ? (count / maxCallsByHour) * 100 : 0}%`, minHeight: count > 0 ? '4px' : '0px' }}
                ></div>
                <span className="text-[9px] text-gray-400 mt-1">{hour}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Calls per Room */}
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Panggilan per Kamar</h3>
          <div className="space-y-3">
            {Object.entries(callsPerRoom)
              .sort((a, b) => b[1] - a[1])
              .map(([roomId, count]) => {
                const room = rooms.find(r => r.id === roomId);
                const maxCount = Math.max(...Object.values(callsPerRoom));
                return (
                  <div key={roomId} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 w-12">Kamar {room?.room_number}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-gray-700 w-8 text-right">{count}</span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Nurse Performance */}
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Performa Perawat</h3>
          <div className="space-y-3">
            {nursePerformance.filter(n => n.totalSessions > 0).map(nurse => (
              <div key={nurse.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                <span className="text-lg">{nurse.avatar}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{nurse.name}</p>
                  <div className="flex gap-3 text-xs text-gray-500">
                    <span>{nurse.totalSessions} sesi</span>
                    <span>{nurse.totalActions} aksi</span>
                    <span>Respon: {nurse.avgResponse}s</span>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  nurse.avgResponse <= 15 ? 'bg-green-100 text-green-700' :
                  nurse.avgResponse <= 30 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {nurse.avgResponse <= 15 ? 'Baik' : nurse.avgResponse <= 30 ? 'Cukup' : 'Perlu Perhatian'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Device Statistics */}
      <div className="bg-white rounded-xl shadow-sm border p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Statistik Perangkat</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-800">{devices.length}</p>
            <p className="text-xs text-gray-500">Total Perangkat</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{devices.filter(d => d.status === 'online').length}</p>
            <p className="text-xs text-gray-500">Online</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-500">{devices.filter(d => d.status === 'offline').length}</p>
            <p className="text-xs text-gray-500">Offline</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{devices.filter(d => d.status === 'fault').length}</p>
            <p className="text-xs text-gray-500">Fault</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{rooms.length}</p>
            <p className="text-xs text-gray-500">Total Kamar</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CallBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-800">{count} ({percentage.toFixed(0)}%)</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3">
        <div className={`h-3 rounded-full ${color} transition-all`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}
