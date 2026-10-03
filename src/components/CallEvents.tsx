import { useState } from 'react';
import { callEvents, callSessions, devices, rooms, nurses } from '../data/mockData';

export default function CallEvents() {
  const [filter, setFilter] = useState<string>('all');
  const [view, setView] = useState<'events' | 'sessions'>('events');

  const filteredEvents = filter === 'all' ? callEvents : callEvents.filter(e => e.event_type === filter);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setView('events')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${view === 'events' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}
          >
            <i className="fas fa-list mr-2"></i>Event Panggilan
          </button>
          <button
            onClick={() => setView('sessions')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${view === 'sessions' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}
          >
            <i className="fas fa-layer-group mr-2"></i>Sesi Panggilan
          </button>
        </div>

        {view === 'events' && (
          <div className="flex gap-2 flex-wrap">
            {['all', 'normal_call', 'emergency_call', 'bathroom_call', 'cancel_call'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${filter === f ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {f === 'all' ? 'Semua' : f.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Events View */}
      {view === 'events' && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Waktu</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Kamar</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Perangkat</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Tipe</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Prioritas</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Direspon Oleh</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredEvents.map(event => {
                  const device = devices.find(d => d.id === event.device_id);
                  const room = rooms.find(r => r.id === event.room_id);
                  const nurse = nurses.find(n => n.id === event.acknowledged_by);
                  return (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-700">
                        {new Date(event.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-800">{room?.room_number || event.room_id}</span>
                        <span className="text-gray-500 text-xs ml-1">({room?.room_type})</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{device?.device_name || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                          event.event_type === 'emergency_call' ? 'bg-red-100 text-red-700' :
                          event.event_type === 'bathroom_call' ? 'bg-blue-100 text-blue-700' :
                          event.event_type === 'cancel_call' ? 'bg-gray-100 text-gray-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          <i className={`fas text-[10px] ${
                            event.event_type === 'emergency_call' ? 'fa-exclamation-triangle' :
                            event.event_type === 'bathroom_call' ? 'fa-bath' :
                            event.event_type === 'cancel_call' ? 'fa-times' :
                            'fa-phone'
                          }`}></i>
                          {event.event_type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          event.priority === 'critical' ? 'bg-red-100 text-red-700' :
                          event.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          event.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {event.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {event.resolved_at ? (
                          <span className="text-green-600 text-xs"><i className="fas fa-check-circle mr-1"></i>Selesai</span>
                        ) : event.acknowledged_at ? (
                          <span className="text-yellow-600 text-xs"><i className="fas fa-spinner fa-spin mr-1"></i>Diproses</span>
                        ) : (
                          <span className="text-red-600 text-xs"><i className="fas fa-exclamation-circle mr-1"></i>Belum</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{nurse?.name || '-'}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs max-w-[150px] truncate">{event.notes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sessions View */}
      {view === 'sessions' && (
        <div className="space-y-4">
          {callSessions.map(session => {
            const room = rooms.find(r => r.id === session.room_id);
            const nurse = nurses.find(n => n.id === session.nurse_id);
            const responseTime = session.response_time
              ? Math.round((new Date(session.response_time).getTime() - new Date(session.start_time).getTime()) / 1000)
              : null;

            return (
              <div key={session.id} className={`bg-white rounded-xl shadow-sm border p-4 ${session.status === 'active' ? 'border-red-200 bg-red-50/30' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      session.status === 'active' ? 'bg-red-100 text-red-600' :
                      session.status === 'resolved' ? 'bg-green-100 text-green-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <i className={`fas ${session.call_type.includes('Emergency') ? 'fa-exclamation-triangle' : 'fa-phone'}`}></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Kamar {room?.room_number} - {session.patient_name}
                      </h4>
                      <p className="text-sm text-gray-500">{session.call_type}</p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-600">
                        <span><i className="fas fa-clock mr-1"></i>Mulai: {new Date(session.start_time).toLocaleTimeString('id-ID')}</span>
                        {responseTime !== null && (
                          <span><i className="fas fa-stopwatch mr-1"></i>Respon: {responseTime}d</span>
                        )}
                        {session.duration_seconds && (
                          <span><i className="fas fa-hourglass-half mr-1"></i>Durasi: {Math.floor(session.duration_seconds / 60)}m {session.duration_seconds % 60}d</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      session.status === 'active' ? 'bg-red-100 text-red-700' :
                      session.status === 'resolved' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {session.status === 'active' ? '🔴 AKTIF' : session.status === 'resolved' ? '✅ Selesai' : session.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      <i className="fas fa-user-nurse mr-1"></i>{nurse?.name || 'Belum ditugaskan'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-xl font-bold text-gray-800">{callEvents.length}</p>
          <p className="text-xs text-gray-500">Total Event</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-xl font-bold text-red-600">{callEvents.filter(e => e.event_type === 'emergency_call').length}</p>
          <p className="text-xs text-gray-500">Darurat</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-xl font-bold text-green-600">{callEvents.filter(e => e.resolved_at).length}</p>
          <p className="text-xs text-gray-500">Terselesaikan</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-xl font-bold text-blue-600">{callSessions.filter(s => s.response_time).length > 0 ? Math.round(callSessions.filter(s => s.response_time).reduce((acc, s) => acc + (new Date(s.response_time!).getTime() - new Date(s.start_time).getTime()) / 1000, 0) / callSessions.filter(s => s.response_time).length) : 0}s</p>
          <p className="text-xs text-gray-500">Rata-rata Respon</p>
        </div>
      </div>
    </div>
  );
}
