import { useState } from 'react';

interface TrashItem {
  id: string;
  type: 'nurse' | 'device' | 'room' | 'user';
  name: string;
  detail: string;
  deletedAt: string;
  deletedBy: string;
  expiresAt: string;
}

const trashData: TrashItem[] = [
  {
    id: 'T001',
    type: 'nurse',
    name: 'Nurse Siti Aminah',
    detail: 'NIP: 198705122013012007 • Lantai 2 • Shift Pagi',
    deletedAt: '2026-01-14T10:30:00',
    deletedBy: 'admin',
    expiresAt: '2026-02-14T10:30:00',
  },
  {
    id: 'T002',
    type: 'device',
    name: 'Bedside Unit 105-B',
    detail: 'Commax KN-702T • IP: 192.168.1.106 • Kamar 105',
    deletedAt: '2026-01-13T14:20:00',
    deletedBy: 'admin',
    expiresAt: '2026-02-13T14:20:00',
  },
  {
    id: 'T003',
    type: 'room',
    name: 'Kamar 105',
    detail: 'Gedung A • Lantai 1 • Reguler • 2 Bed',
    deletedAt: '2026-01-12T09:15:00',
    deletedBy: 'admin',
    expiresAt: '2026-02-12T09:15:00',
  },
  {
    id: 'T004',
    type: 'nurse',
    name: 'Nurse Hendra Wijaya',
    detail: 'NIP: 199001252016011008 • Lantai 3 • Shift Malam',
    deletedAt: '2026-01-10T16:45:00',
    deletedBy: 'admin',
    expiresAt: '2026-02-10T16:45:00',
  },
  {
    id: 'T005',
    type: 'device',
    name: 'Dome Light 305',
    detail: 'Commax KN-401L • IP: 192.168.1.305 • Kamar 305',
    deletedAt: '2026-01-09T11:00:00',
    deletedBy: 'operator1',
    expiresAt: '2026-02-09T11:00:00',
  },
  {
    id: 'T006',
    type: 'user',
    name: 'viewer2',
    detail: 'Dr. Ratna Sari • Email: ratna@hospital.com',
    deletedAt: '2026-01-08T08:30:00',
    deletedBy: 'admin',
    expiresAt: '2026-02-08T08:30:00',
  },
];

export default function Trash() {
  const [filter, setFilter] = useState<string>('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TrashItem | null>(null);

  const filteredItems = filter === 'all' ? trashData : trashData.filter(item => item.type === filter);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'nurse': return { icon: 'fa-user-nurse', color: 'bg-pink-100 text-pink-600', label: 'Perawat' };
      case 'device': return { icon: 'fa-microchip', color: 'bg-green-100 text-green-600', label: 'Perangkat' };
      case 'room': return { icon: 'fa-bed', color: 'bg-blue-100 text-blue-600', label: 'Kamar' };
      case 'user': return { icon: 'fa-user', color: 'bg-purple-100 text-purple-600', label: 'Pengguna' };
      default: return { icon: 'fa-file', color: 'bg-gray-100 text-gray-600', label: 'Lainnya' };
    }
  };

  const getDaysRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const toggleSelect = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <i className="fas fa-trash-can text-amber-600"></i>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-800">Tempat Sampah</h3>
            <p className="text-sm text-amber-700 mt-1">
              Data yang dihapus akan disimpan sementara selama <strong>30 hari</strong> sebelum dihapus permanen. 
              Anda dapat memulihkan atau menghapus permanen data di sini.
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-amber-800">{trashData.length}</p>
            <p className="text-xs text-amber-600">Item</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-sm text-gray-600 mr-2">Filter:</span>
          {[
            { id: 'all', label: 'Semua' },
            { id: 'nurse', label: 'Perawat' },
            { id: 'device', label: 'Perangkat' },
            { id: 'room', label: 'Kamar' },
            { id: 'user', label: 'Pengguna' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => { setFilter(f.id); setSelectedItems([]); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${filter === f.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        {selectedItems.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowRestoreModal(true)}
              className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 flex items-center gap-1"
            >
              <i className="fas fa-undo"></i>
              Pulihkan ({selectedItems.length})
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 flex items-center gap-1"
            >
              <i className="fas fa-trash"></i>
              Hapus Permanen ({selectedItems.length})
            </button>
          </div>
        )}
      </div>

      {/* Trash List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-trash-can text-gray-400 text-2xl"></i>
            </div>
            <p className="text-gray-500 font-medium">Tempat sampah kosong</p>
            <p className="text-sm text-gray-400 mt-1">Data yang dihapus akan muncul di sini</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Tipe</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Nama</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Detail</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Dihapus</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Sisa Waktu</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredItems.map(item => {
                const typeInfo = getTypeIcon(item.type);
                const daysRemaining = getDaysRemaining(item.expiresAt);
                return (
                  <tr key={item.id} className={`hover:bg-gray-50 ${selectedItems.includes(item.id) ? 'bg-blue-50' : ''}`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${typeInfo.color}`}>
                        <i className={`fas ${typeInfo.icon} text-xs`}></i>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-[10px] text-gray-500">{typeInfo.label}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 max-w-[200px] truncate">{item.detail}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-600">
                        {new Date(item.deletedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-[10px] text-gray-400">oleh {item.deletedBy}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${
                        daysRemaining <= 7 ? 'text-red-600' :
                        daysRemaining <= 14 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {daysRemaining} hari
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className={`h-1.5 rounded-full ${
                            daysRemaining <= 7 ? 'bg-red-500' :
                            daysRemaining <= 14 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${(daysRemaining / 30) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => { setSelectedItem(item); setShowRestoreModal(true); }}
                          className="p-1.5 text-green-600 hover:bg-green-100 rounded transition"
                          title="Pulihkan"
                        >
                          <i className="fas fa-undo text-xs"></i>
                        </button>
                        <button
                          onClick={() => { setSelectedItem(item); setShowDeleteModal(true); }}
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded transition"
                          title="Hapus Permanen"
                        >
                          <i className="fas fa-trash text-xs"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-xl font-bold text-pink-600">{trashData.filter(i => i.type === 'nurse').length}</p>
          <p className="text-xs text-gray-500">Perawat</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-xl font-bold text-green-600">{trashData.filter(i => i.type === 'device').length}</p>
          <p className="text-xs text-gray-500">Perangkat</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-xl font-bold text-blue-600">{trashData.filter(i => i.type === 'room').length}</p>
          <p className="text-xs text-gray-500">Kamar</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-xl font-bold text-purple-600">{trashData.filter(i => i.type === 'user').length}</p>
          <p className="text-xs text-gray-500">Pengguna</p>
        </div>
      </div>

      {/* Restore Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-undo text-green-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Pulihkan Data</h3>
                  <p className="text-sm text-gray-500">Kembalikan data ke posisi semula</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg mb-4">
                {selectedItem ? (
                  <p className="text-sm text-gray-700">
                    Pulihkan <span className="font-semibold">{selectedItem.name}</span>?
                  </p>
                ) : (
                  <p className="text-sm text-gray-700">
                    Pulihkan <span className="font-semibold">{selectedItems.length} item</span> yang dipilih?
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Data akan dikembalikan ke menu asalnya dan dapat langsung digunakan kembali.
                </p>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => { setShowRestoreModal(false); setSelectedItem(null); setSelectedItems([]); }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  onClick={() => { setShowRestoreModal(false); setSelectedItem(null); setSelectedItems([]); }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2"
                >
                  <i className="fas fa-undo"></i>
                  Pulihkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Permanently Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Hapus Permanen</h3>
                  <p className="text-sm text-gray-500">Tindakan ini tidak dapat dibatalkan</p>
                </div>
              </div>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                {selectedItem ? (
                  <p className="text-sm text-gray-700">
                    Hapus permanen <span className="font-semibold">{selectedItem.name}</span>?
                  </p>
                ) : (
                  <p className="text-sm text-gray-700">
                    Hapus permanen <span className="font-semibold">{selectedItems.length} item</span> yang dipilih?
                  </p>
                )}
                <p className="text-xs text-red-600 mt-2 font-medium">
                  ⚠️ Data yang dihapus permanen tidak dapat dikembalikan!
                </p>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => { setShowDeleteModal(false); setSelectedItem(null); setSelectedItems([]); }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  onClick={() => { setShowDeleteModal(false); setSelectedItem(null); setSelectedItems([]); }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2"
                >
                  <i className="fas fa-trash"></i>
                  Hapus Permanen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
