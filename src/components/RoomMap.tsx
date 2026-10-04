import { useState } from 'react';

export default function RoomMap() {
  const [activeTab, setActiveTab] = useState<'template' | 'bangsal' | 'peta'>('template');
  const [showAddBangsalModal, setShowAddBangsalModal] = useState(false);
  const [newBangsal, setNewBangsal] = useState({
    nama: '',
    lantai: '',
    keterangan: '',
    template: ''
  });
  const [daftarBangsal, setDaftarBangsal] = useState<Array<{
    id: number;
    nama: string;
    lantai: string;
    keterangan: string;
    template: string;
  }>>([]);

  return (
    <div className="space-y-6">
      {/* Tab Menu */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('template')}
          className={`px-4 py-2 font-medium text-sm transition ${
            activeTab === 'template'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <i className="fas fa-th-large mr-2"></i>
          Template Ruang
        </button>
        <button
          onClick={() => setActiveTab('bangsal')}
          className={`px-4 py-2 font-medium text-sm transition ${
            activeTab === 'bangsal'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <i className="fas fa-building mr-2"></i>
          Bangsal
        </button>
        <button
          onClick={() => setActiveTab('peta')}
          className={`px-4 py-2 font-medium text-sm transition ${
            activeTab === 'peta'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <i className="fas fa-map mr-2"></i>
          Peta Ruang
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'template' && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            Template Ruang
          </h3>
          <p className="text-gray-600 mb-6">Pilih template ruang yang sesuai dengan kebutuhan Anda:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Template 1: 4 Kamar */}
            <div className="border-2 border-gray-300 rounded-lg p-4 hover:border-indigo-500 cursor-pointer transition">
              <h4 className="font-semibold text-gray-800 mb-3">Template 1 - 4 Kamar</h4>
              <div className="flex gap-2 h-48">
                {/* Kamar Kiri */}
                <div className="flex-1 grid grid-rows-2 gap-2">
                  <div className="bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center text-xs">
                    Kamar 1
                  </div>
                  <div className="bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center text-xs">
                    Kamar 2
                  </div>
                </div>
                {/* Koridor */}
                <div className="w-16 bg-gray-200 border-2 border-gray-400 rounded flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-600 transform -rotate-90">KORIDOR</span>
                </div>
                {/* Kamar Kanan */}
                <div className="flex-1 grid grid-rows-2 gap-2">
                  <div className="bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center text-xs">
                    Kamar 3
                  </div>
                  <div className="bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center text-xs">
                    Kamar 4
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">2 kamar di kiri, 2 kamar di kanan</p>
            </div>

            {/* Template 2: 6 Kamar */}
            <div className="border-2 border-gray-300 rounded-lg p-4 hover:border-indigo-500 cursor-pointer transition">
              <h4 className="font-semibold text-gray-800 mb-3">Template 2 - 6 Kamar</h4>
              <div className="flex gap-2 h-48">
                {/* Kamar Kiri */}
                <div className="flex-1 grid grid-rows-3 gap-2">
                  <div className="bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center text-xs">
                    Kamar 1
                  </div>
                  <div className="bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center text-xs">
                    Kamar 2
                  </div>
                  <div className="bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center text-xs">
                    Kamar 3
                  </div>
                </div>
                {/* Koridor */}
                <div className="w-16 bg-gray-200 border-2 border-gray-400 rounded flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-600 transform -rotate-90">KORIDOR</span>
                </div>
                {/* Kamar Kanan */}
                <div className="flex-1 grid grid-rows-3 gap-2">
                  <div className="bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center text-xs">
                    Kamar 4
                  </div>
                  <div className="bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center text-xs">
                    Kamar 5
                  </div>
                  <div className="bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center text-xs">
                    Kamar 6
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">3 kamar di kiri, 3 kamar di kanan</p>
            </div>

            {/* Template 3: 8 Kamar */}
            <div className="border-2 border-gray-300 rounded-lg p-4 hover:border-indigo-500 cursor-pointer transition">
              <h4 className="font-semibold text-gray-800 mb-3">Template 3 - 8 Kamar</h4>
              <div className="flex gap-2 h-48">
                {/* Kamar Kiri */}
                <div className="flex-1 grid grid-rows-4 gap-1">
                  <div className="bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center text-xs">
                    Kamar 1
                  </div>
                  <div className="bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center text-xs">
                    Kamar 2
                  </div>
                  <div className="bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center text-xs">
                    Kamar 3
                  </div>
                  <div className="bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center text-xs">
                    Kamar 4
                  </div>
                </div>
                {/* Koridor */}
                <div className="w-16 bg-gray-200 border-2 border-gray-400 rounded flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-600 transform -rotate-90">KORIDOR</span>
                </div>
                {/* Kamar Kanan */}
                <div className="flex-1 grid grid-rows-4 gap-1">
                  <div className="bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center text-xs">
                    Kamar 5
                  </div>
                  <div className="bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center text-xs">
                    Kamar 6
                  </div>
                  <div className="bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center text-xs">
                    Kamar 7
                  </div>
                  <div className="bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center text-xs">
                    Kamar 8
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">4 kamar di kiri, 4 kamar di kanan</p>
            </div>

            {/* Template 4: 10 Kamar */}
            <div className="border-2 border-gray-300 rounded-lg p-4 hover:border-indigo-500 cursor-pointer transition">
              <h4 className="font-semibold text-gray-800 mb-3">Template 4 - 10 Kamar</h4>
              <div className="flex gap-2 h-48">
                {/* Kamar Kiri */}
                <div className="flex-1 grid grid-rows-5 gap-1">
                  <div className="bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center text-xs">
                    Kamar 1
                  </div>
                  <div className="bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center text-xs">
                    Kamar 2
                  </div>
                  <div className="bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center text-xs">
                    Kamar 3
                  </div>
                  <div className="bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center text-xs">
                    Kamar 4
                  </div>
                  <div className="bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center text-xs">
                    Kamar 5
                  </div>
                </div>
                {/* Koridor */}
                <div className="w-16 bg-gray-200 border-2 border-gray-400 rounded flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-600 transform -rotate-90">KORIDOR</span>
                </div>
                {/* Kamar Kanan */}
                <div className="flex-1 grid grid-rows-5 gap-1">
                  <div className="bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center text-xs">
                    Kamar 6
                  </div>
                  <div className="bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center text-xs">
                    Kamar 7
                  </div>
                  <div className="bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center text-xs">
                    Kamar 8
                  </div>
                  <div className="bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center text-xs">
                    Kamar 9
                  </div>
                  <div className="bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center text-xs">
                    Kamar 10
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">5 kamar di kiri, 5 kamar di kanan</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bangsal' && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">
              Daftar Bangsal
            </h3>
            <button
              onClick={() => setShowAddBangsalModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
            >
              <i className="fas fa-plus mr-2"></i>
              Tambah Bangsal
            </button>
          </div>
          
          {daftarBangsal.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <i className="fas fa-building text-4xl mb-3 text-gray-300"></i>
              <p>Belum ada bangsal yang dibuat</p>
              <p className="text-sm mt-1">Klik tombol "Tambah Bangsal" untuk membuat bangsal baru</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {daftarBangsal.map((bangsal) => (
                <div key={bangsal.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-indigo-500 transition">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-gray-800 text-lg">{bangsal.nama}</h4>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus bangsal ${bangsal.nama}?`)) {
                          setDaftarBangsal(daftarBangsal.filter(b => b.id !== bangsal.id));
                        }
                      }}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Lantai:</span>
                      <span className="ml-2 font-medium text-gray-700">{bangsal.lantai}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Template:</span>
                      <span className="ml-2 font-medium text-gray-700">{bangsal.template}</span>
                    </div>
                    {bangsal.keterangan && (
                      <div>
                        <span className="text-gray-500">Keterangan:</span>
                        <p className="mt-1 text-gray-600 text-xs">{bangsal.keterangan}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal Tambah Bangsal */}
      {showAddBangsalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Tambah Bangsal Baru</h3>
                <button
                  onClick={() => setShowAddBangsalModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nama Bangsal</label>
                <input
                  type="text"
                  value={newBangsal.nama}
                  onChange={(e) => setNewBangsal({ ...newBangsal, nama: e.target.value })}
                  placeholder="Contoh: Bangsal A"
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Nama Lantai</label>
                <input
                  type="text"
                  value={newBangsal.lantai}
                  onChange={(e) => setNewBangsal({ ...newBangsal, lantai: e.target.value })}
                  placeholder="Contoh: Lantai 1"
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Keterangan</label>
                <textarea
                  value={newBangsal.keterangan}
                  onChange={(e) => setNewBangsal({ ...newBangsal, keterangan: e.target.value })}
                  placeholder="Deskripsi bangsal..."
                  rows={3}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Template Ruang</label>
                <select
                  value={newBangsal.template}
                  onChange={(e) => setNewBangsal({ ...newBangsal, template: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Pilih Template --</option>
                  <option value="template1">Template 1 - 4 Kamar</option>
                  <option value="template2">Template 2 - 6 Kamar</option>
                  <option value="template3">Template 3 - 8 Kamar</option>
                  <option value="template4">Template 4 - 10 Kamar</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowAddBangsalModal(false);
                  setNewBangsal({ nama: '', lantai: '', keterangan: '', template: '' });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (newBangsal.nama && newBangsal.lantai && newBangsal.template) {
                    setDaftarBangsal([...daftarBangsal, {
                      id: Date.now(),
                      ...newBangsal
                    }]);
                    setShowAddBangsalModal(false);
                    setNewBangsal({ nama: '', lantai: '', keterangan: '', template: '' });
                  } else {
                    alert('Mohon lengkapi semua field yang wajib diisi');
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'peta' && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            Peta Ruang
          </h3>
          <p className="text-gray-600">Konten peta ruang akan ditampilkan di sini.</p>
        </div>
      )}
    </div>
  );
}
