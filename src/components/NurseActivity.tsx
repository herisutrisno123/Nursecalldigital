import { useState } from 'react';
import { nurses, nurseActions, callSessions, rooms } from '../data/mockData';

export default function NurseActivity() {
  const [selectedNurse, setSelectedNurse] = useState<string>('all');
  const [showAddNurseModal, setShowAddNurseModal] = useState(false);
  const [editingNurse, setEditingNurse] = useState<any>(null);
  const [deletingNurse, setDeletingNurse] = useState<any>(null);

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
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex gap-2 flex-wrap items-center">
          <button
            onClick={() => setSelectedNurse('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${selectedNurse === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Semua Perawat
          </button>
          <select
            value={selectedNurse}
            onChange={(e) => setSelectedNurse(e.target.value)}
            className="px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Pilih Perawat</option>
            {nurses.map(nurse => (
              <option key={nurse.id} value={nurse.id}>
                {nurse.avatar} {nurse.name} - Lantai {nurse.floor}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowAddNurseModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition shadow-sm"
        >
          <i className="fas fa-plus mr-2"></i>Tambah Perawat
        </button>
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
                  <div className="flex items-center gap-1">
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingNurse(nurse);
                      }}
                      className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition"
                      title="Edit Perawat"
                    >
                      <i className="fas fa-edit text-xs"></i>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingNurse(nurse);
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-100 rounded transition"
                      title="Hapus Perawat"
                    >
                      <i className="fas fa-trash text-xs"></i>
                    </button>
                  </div>
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

      {/* Add Nurse Modal */}
      {showAddNurseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-user-nurse text-green-600"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Tambah Perawat Baru</h3>
                </div>
                <button 
                  onClick={() => setShowAddNurseModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Nurse Dewi Kartika"
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">NIP</label>
                  <input 
                    type="text" 
                    placeholder="Nomor Induk Pegawai"
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Role</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    <option value="nurse">Nurse</option>
                    <option value="head_nurse">Head Nurse</option>
                    <option value="assistant_nurse">Assistant Nurse</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Shift</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    <option value="pagi">Pagi</option>
                    <option value="siang">Siang</option>
                    <option value="malam">Malam</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Lantai Penugasan</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    <option value={1}>Lantai 1</option>
                    <option value={2}>Lantai 2</option>
                    <option value={3}>Lantai 3</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    <option value="on_duty">On Duty</option>
                    <option value="off_duty">Off Duty</option>
                    <option value="break">Break</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nomor Telepon</label>
                  <input 
                    type="tel" 
                    placeholder="08xxxxxxxxxx"
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input 
                    type="email" 
                    placeholder="nama@hospital.com"
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
                <i className="fas fa-info-circle mr-1"></i>
                Setelah perawat ditambahkan, mereka akan langsung dapat ditugaskan untuk merespon panggilan pasien.
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex gap-3 justify-end flex-shrink-0">
              <button 
                onClick={() => setShowAddNurseModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100"
              >
                Batal
              </button>
              <button 
                onClick={() => setShowAddNurseModal(false)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2"
              >
                <i className="fas fa-save"></i>
                Simpan Perawat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Nurse Modal */}
      {editingNurse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-edit text-blue-600"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Edit Perawat</h3>
                </div>
                <button 
                  onClick={() => setEditingNurse(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                  <input 
                    type="text" 
                    defaultValue={editingNurse.name}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">NIP</label>
                  <input 
                    type="text" 
                    defaultValue={editingNurse.nip}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Role</label>
                  <select 
                    defaultValue={editingNurse.role}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="nurse">Nurse</option>
                    <option value="head_nurse">Head Nurse</option>
                    <option value="assistant_nurse">Assistant Nurse</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Shift</label>
                  <select 
                    defaultValue={editingNurse.shift}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pagi">Pagi</option>
                    <option value="siang">Siang</option>
                    <option value="malam">Malam</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Lantai Penugasan</label>
                  <select 
                    defaultValue={editingNurse.floor}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>Lantai 1</option>
                    <option value={2}>Lantai 2</option>
                    <option value={3}>Lantai 3</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select 
                    defaultValue={editingNurse.status}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="on_duty">On Duty</option>
                    <option value="off_duty">Off Duty</option>
                    <option value="break">Break</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nomor Telepon</label>
                  <input 
                    type="tel" 
                    defaultValue={editingNurse.phone}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input 
                    type="email" 
                    defaultValue={editingNurse.email}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex gap-3 justify-end flex-shrink-0">
              <button 
                onClick={() => setEditingNurse(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100"
              >
                Batal
              </button>
              <button 
                onClick={() => setEditingNurse(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
              >
                <i className="fas fa-save"></i>
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingNurse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Hapus Perawat</h3>
                  <p className="text-sm text-gray-500">Tindakan ini tidak dapat dibatalkan</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg mb-4">
                <p className="text-sm text-gray-700">
                  Apakah Anda yakin ingin menghapus <span className="font-semibold">{deletingNurse.name}</span>?
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Semua data aktivitas perawat ini akan tetap tersimpan untuk keperluan audit.
                </p>
              </div>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setDeletingNurse(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100"
                >
                  Batal
                </button>
                <button 
                  onClick={() => setDeletingNurse(null)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2"
                >
                  <i className="fas fa-trash"></i>
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
