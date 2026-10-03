import { useState } from 'react';
import { nurses, nurseActions, callSessions, rooms } from '../data/mockData';

export default function NurseActivity() {
  const [selectedNurse, setSelectedNurse] = useState<string>('all');

  const filteredActions = selectedNurse === 'all'
    ? nurseActions
    : nurseActions.filter(a => a.nurse_id === selectedNurse);

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'acknowledge': return { icon: 'fa-check', color: 'bg-blue-100 text-blue-600' };
      case 'respond': return { icon: 'fa-running', color: 'bg-green-100 text-green-600' };
      case 'assist': return { icon: 'fa-hands-helping', color: 'bg-purple-100 text-purple-600' };
      case 'medicate': return { icon: 'fa-pills', color: 'bg-orange-100 text-orange-600' };
      case 'escalate': return { icon: 'fa-arrow-up', color: 'bg-red-100 text-red-600' };
      case 'close': return { icon: 'fa-door-closed', color: 'bg-gray-100 text-gray-600' };
      default: return { icon: 'fa-circle', color: 'bg-gray-100 text-gray-600' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Nurse Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedNurse('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${selectedNurse === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Semua Perawat
          </button>
          {nurses.map(nurse => (
            <button
              key={nurse.id}
              onClick={() => setSelectedNurse(nurse.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${selectedNurse === nurse.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {nurse.avatar} {nurse.name.split(' ').slice(0, 2).join(' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nurse List */}
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Daftar Perawat</h3>
          <div className="space-y-3">
            {nurses.map(nurse => (
              <div
                key={nurse.id}
                onClick={() => setSelectedNurse(nurse.id)}
                className={`p-3 rounded-lg cursor-pointer transition ${selectedNurse === nurse.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{nurse.avatar}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{nurse.name}</p>
                    <p className="text-xs text-gray-500">
                      Lantai {nurse.floor} • Shift {nurse.shift}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    nurse.status === 'on_duty' ? 'bg-green-100 text-green-700' :
                    nurse.status === 'break' ? 'bg-yellow-100 text-yellow-700' :
                    nurse.status === 'active' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {nurse.status === 'on_duty' ? '🟢 On Duty' :
                     nurse.status === 'break' ? '🟡 Break' :
                     nurse.status === 'active' ? '🔵 Active' :
                     '⚪ Off Duty'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Timeline Aktivitas</h3>
          <div className="space-y-4">
            {filteredActions.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">Tidak ada aktivitas untuk ditampilkan</p>
            ) : (
              filteredActions.map((action, index) => {
                const nurse = nurses.find(n => n.id === action.nurse_id);
                const session = callSessions.find(s => s.id === action.call_session_id);
                const room = rooms.find(r => r.id === session?.room_id);
                const actionStyle = getActionIcon(action.action_type);

                return (
                  <div key={action.id} className="flex gap-3">
                    {/* Timeline Line */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${actionStyle.color}`}>
                        <i className={`fas ${actionStyle.icon} text-xs`}></i>
                      </div>
                      {index < filteredActions.length - 1 && (
                        <div className="w-0.5 flex-1 bg-gray-200 my-1"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-800">
                          {nurse?.name} - {action.action_type.charAt(0).toUpperCase() + action.action_type.slice(1)}
                        </p>
                        <span className="text-xs text-gray-500">
                          {new Date(action.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {session && room && `Kamar ${room.room_number} - ${session.patient_name}`}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{action.notes}</p>
                      {action.duration_minutes > 0 && (
                        <span className="text-[10px] text-gray-400 mt-1 inline-block">
                          Durasi: {action.duration_minutes} menit
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-xl font-bold text-blue-600">{nurseActions.filter(a => a.action_type === 'acknowledge').length}</p>
          <p className="text-xs text-gray-500">Diakui</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-xl font-bold text-green-600">{nurseActions.filter(a => a.action_type === 'respond').length}</p>
          <p className="text-xs text-gray-500">Direspon</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-xl font-bold text-purple-600">{nurseActions.filter(a => a.action_type === 'assist').length}</p>
          <p className="text-xs text-gray-500">Bantuan</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-xl font-bold text-red-600">{nurseActions.filter(a => a.action_type === 'escalate').length}</p>
          <p className="text-xs text-gray-500">Eskalasi</p>
        </div>
      </div>
    </div>
  );
}
