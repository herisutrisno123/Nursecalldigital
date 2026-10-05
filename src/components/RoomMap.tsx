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
  const [showEditBangsalModal, setShowEditBangsalModal] = useState(false);
  const [editingBangsal, setEditingBangsal] = useState<{
    id: number;
    nama: string;
    lantai: string;
    keterangan: string;
    template: string;
  } | null>(null);
  const [selectedBangsalId, setSelectedBangsalId] = useState<number | null>(null);
  const [kamarList, setKamarList] = useState<Array<{
    id: number;
    nomor: string;
    tipe: string;
    status: string;
    layoutId?: string; // ID denah yang dipilih
  }>>([]);
  const [showPilihDenahModal, setShowPilihDenahModal] = useState(false);
  const [daftarDenah, setDaftarDenah] = useState<Array<{
    id: string;
    name: string;
    roomType: string;
    elements: any[];
  }>>([]);

  // Load daftar denah dari localStorage
  const loadDaftarDenah = () => {
    const savedData = localStorage.getItem('savedLayouts');
    if (savedData) {
      try {
        const layouts = JSON.parse(savedData);
        setDaftarDenah(layouts);
      } catch (error) {
        console.error('Error loading layouts:', error);
      }
    }
  };

  // Fungsi untuk menambah kamar - membuka modal pilih denah
  const handleTambahKamar = () => {
    loadDaftarDenah();
    setShowPilihDenahModal(true);
  };

  // Fungsi untuk memilih denah dan menambah kamar
  const handlePilihDenah = (layoutId: string) => {
    const layout = daftarDenah.find(l => l.id === layoutId);
    if (layout) {
      const newKamar = {
        id: Date.now(),
        nomor: String(kamarList.length + 1),
        tipe: layout.roomType,
        status: 'Tersedia',
        layoutId: layoutId
      };
      setKamarList([...kamarList, newKamar]);
      setShowPilihDenahModal(false);
    }
  };

  // Fungsi untuk menyimpan bangsal
  const handleSimpanBangsal = () => {
    if (confirm('Simpan perubahan bangsal ini?')) {
      alert('Bangsal berhasil disimpan!');
    }
  };

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
            {/* Template VVIP: 1 Kamar */}
            <div className="border-2 border-gray-300 rounded-lg p-4 hover:border-indigo-500 cursor-pointer transition">
              <h4 className="font-semibold text-gray-800 mb-3">Template VVIP - 1 Kamar</h4>
              <div className="flex gap-2 h-48">
                {/* Kamar Kiri */}
                <div className="flex-1 grid grid-rows-1 gap-2">
                  <div className="bg-purple-100 border-2 border-purple-400 rounded flex items-center justify-center text-xs font-semibold">
                    Kamar VVIP
                  </div>
                </div>
                {/* Koridor */}
                <div className="w-16 bg-gray-200 border-2 border-gray-400 rounded flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-600 transform -rotate-90">KORIDOR</span>
                </div>
                {/* Kamar Kanan */}
                <div className="flex-1"></div>
              </div>
              <p className="text-sm text-gray-600 mt-3">1 kamar di kiri</p>
            </div>

            {/* Template VIP: 2 Kamar */}
            <div className="border-2 border-gray-300 rounded-lg p-4 hover:border-indigo-500 cursor-pointer transition">
              <h4 className="font-semibold text-gray-800 mb-3">Template VIP - 2 Kamar</h4>
              <div className="flex gap-2 h-48">
                {/* Kamar Kiri */}
                <div className="flex-1 grid grid-rows-1 gap-2">
                  <div className="bg-indigo-100 border-2 border-indigo-400 rounded flex items-center justify-center text-xs font-semibold">
                    Kamar VIP 1
                  </div>
                </div>
                {/* Koridor */}
                <div className="w-16 bg-gray-200 border-2 border-gray-400 rounded flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-600 transform -rotate-90">KORIDOR</span>
                </div>
                {/* Kamar Kanan */}
                <div className="flex-1 grid grid-rows-1 gap-2">
                  <div className="bg-indigo-100 border-2 border-indigo-400 rounded flex items-center justify-center text-xs font-semibold">
                    Kamar VIP 2
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">1 kamar di kiri, 1 kamar di kanan</p>
            </div>

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
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingBangsal(bangsal);
                          setShowEditBangsalModal(true);
                        }}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus bangsal ${bangsal.nama}?`)) {
                            setDaftarBangsal(daftarBangsal.filter(b => b.id !== bangsal.id));
                          }
                        }}
                        className="text-red-500 hover:text-red-700 text-sm"
                        title="Hapus"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Lantai:</span>
                      <span className="ml-2 font-medium text-gray-700">{bangsal.lantai}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Template:</span>
                      <span className="ml-2 font-medium text-gray-700">
                        {bangsal.template === 'vvip' && 'Template VVIP - 1 Kamar'}
                        {bangsal.template === 'vip' && 'Template VIP - 2 Kamar'}
                        {bangsal.template === 'template1' && 'Template 1 - 4 Kamar'}
                        {bangsal.template === 'template2' && 'Template 2 - 6 Kamar'}
                        {bangsal.template === 'template3' && 'Template 3 - 8 Kamar'}
                        {bangsal.template === 'template4' && 'Template 4 - 10 Kamar'}
                      </span>
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
                  <option value="vvip">Template VVIP - 1 Kamar</option>
                  <option value="vip">Template VIP - 2 Kamar</option>
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

      {/* Modal Edit Bangsal */}
      {showEditBangsalModal && editingBangsal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Edit Bangsal</h3>
                <button
                  onClick={() => {
                    setShowEditBangsalModal(false);
                    setEditingBangsal(null);
                  }}
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
                  value={editingBangsal.nama}
                  onChange={(e) => setEditingBangsal({ ...editingBangsal, nama: e.target.value })}
                  placeholder="Contoh: Bangsal A"
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Nama Lantai</label>
                <input
                  type="text"
                  value={editingBangsal.lantai}
                  onChange={(e) => setEditingBangsal({ ...editingBangsal, lantai: e.target.value })}
                  placeholder="Contoh: Lantai 1"
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Keterangan</label>
                <textarea
                  value={editingBangsal.keterangan}
                  onChange={(e) => setEditingBangsal({ ...editingBangsal, keterangan: e.target.value })}
                  placeholder="Deskripsi bangsal..."
                  rows={3}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Template Ruang</label>
                <select
                  value={editingBangsal.template}
                  onChange={(e) => setEditingBangsal({ ...editingBangsal, template: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Pilih Template --</option>
                  <option value="vvip">Template VVIP - 1 Kamar</option>
                  <option value="vip">Template VIP - 2 Kamar</option>
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
                  setShowEditBangsalModal(false);
                  setEditingBangsal(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (editingBangsal.nama && editingBangsal.lantai && editingBangsal.template) {
                    setDaftarBangsal(daftarBangsal.map(b => 
                      b.id === editingBangsal.id ? editingBangsal : b
                    ));
                    setShowEditBangsalModal(false);
                    setEditingBangsal(null);
                  } else {
                    alert('Mohon lengkapi semua field yang wajib diisi');
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pilih Denah */}
      {showPilihDenahModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-6 border-b flex-shrink-0">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Pilih Denah Kamar</h3>
                <button
                  onClick={() => setShowPilihDenahModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {daftarDenah.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <i className="fas fa-drafting-compass text-4xl mb-3 text-gray-300"></i>
                  <p>Belum ada denah kamar yang dibuat</p>
                  <p className="text-sm mt-1">Silakan buat denah di menu "Editor Kamar" terlebih dahulu</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {daftarDenah.map((layout) => (
                    <div
                      key={layout.id}
                      onClick={() => handlePilihDenah(layout.id)}
                      className="border-2 border-gray-200 rounded-lg p-4 hover:border-indigo-500 cursor-pointer transition"
                    >
                      <h4 className="font-semibold text-gray-800 mb-2">{layout.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {layout.roomType}
                        </span>
                        <span>{layout.elements.length} elemen</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end flex-shrink-0">
              <button
                onClick={() => setShowPilihDenahModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100"
              >
                Batal
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
          
          {/* Dropdown Pilihan Bangsal */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Pilih Bangsal:</label>
            <select
              value={selectedBangsalId || ''}
              onChange={(e) => {
                const bangsalId = Number(e.target.value);
                setSelectedBangsalId(bangsalId);
                const bangsal = daftarBangsal.find(b => b.id === bangsalId);
                if (bangsal) {
                  const templateKamarCount = {
                    'vvip': 1,
                    'vip': 2,
                    'template1': 4,
                    'template2': 6,
                    'template3': 8,
                    'template4': 10
                  };
                  const count = templateKamarCount[bangsal.template as keyof typeof templateKamarCount] || 0;
                  const newKamarList = Array.from({ length: count }, (_, i) => ({
                    id: Date.now() + i,
                    nomor: `${i + 1}`,
                    tipe: bangsal.template === 'vvip' ? 'VVIP' : bangsal.template === 'vip' ? 'VIP' : 'Reguler',
                    status: 'Tersedia'
                  }));
                  setKamarList(newKamarList);
                }
              }}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Pilih Bangsal --</option>
              {daftarBangsal.map(bangsal => (
                <option key={bangsal.id} value={bangsal.id}>
                  {bangsal.nama} - {bangsal.lantai}
                </option>
              ))}
            </select>
          </div>

          {/* Tombol Tambah Kamar dan Simpan - SELALU DITAMPILKAN */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={handleTambahKamar}
              disabled={!selectedBangsalId}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedBangsalId 
                  ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <i className="fas fa-plus mr-2"></i>
              Tambah Kamar
            </button>
            <button
              type="button"
              onClick={handleSimpanBangsal}
              disabled={!selectedBangsalId}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedBangsalId 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <i className="fas fa-save mr-2"></i>
              Simpan
            </button>
          </div>

          {/* Tampilan Template Bangsal */}
          {selectedBangsalId && (() => {
            const selectedBangsal = daftarBangsal.find(b => b.id === selectedBangsalId);
            if (!selectedBangsal) return null;

            const templateConfig = {
              'vvip': { left: 1, right: 0 },
              'vip': { left: 1, right: 1 },
              'template1': { left: 2, right: 2 },
              'template2': { left: 3, right: 3 },
              'template3': { left: 4, right: 4 },
              'template4': { left: 5, right: 5 }
            };

            const config = templateConfig[selectedBangsal.template as keyof typeof templateConfig];
            if (!config) return null;

            return (
              <div className="border-2 border-gray-300 rounded-lg p-6">
                <h4 className="font-semibold text-gray-800 mb-4">
                  Template: {selectedBangsal.nama}
                </h4>
                <div className="flex gap-2 h-64">
                  {/* Kamar Kiri */}
                  <div className="flex-1 grid gap-2" style={{ gridTemplateRows: `repeat(${config.left}, 1fr)` }}>
                    {kamarList.slice(0, config.left).map((kamar) => {
                      const layout = kamar.layoutId ? daftarDenah.find(l => l.id === kamar.layoutId) : null;
                      
                      return (
                        <div 
                          key={kamar.id}
                          className={`${layout ? 'bg-white' : 'bg-blue-100'} border-2 ${layout ? 'border-gray-400' : 'border-blue-400'} rounded p-2 flex flex-col justify-center cursor-pointer hover:shadow-md transition relative overflow-hidden`}
                          onClick={() => {
                            const nomor = prompt(`Edit nomor kamar:`, kamar.nomor);
                            if (nomor) {
                              setKamarList(kamarList.map(k => 
                                k.id === kamar.id ? { ...k, nomor } : k
                              ));
                            }
                          }}
                        >
                          {layout ? (
                            <>
                              {/* Tampilkan denah */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-[10px] text-gray-500">
                                  <i className="fas fa-drafting-compass"></i> Denah: {layout.name}
                                </div>
                              </div>
                              <div className="relative z-10 bg-white bg-opacity-80 px-1 py-0.5 rounded">
                                <div className="text-xs font-semibold text-center">Kamar {kamar.nomor}</div>
                                <div className="text-[10px] text-center text-gray-600">{kamar.tipe}</div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="text-xs font-semibold text-center">Kamar {kamar.nomor}</div>
                              <div className="text-[10px] text-center text-gray-600">{kamar.tipe}</div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {/* Koridor */}
                  <div className="w-20 bg-gray-200 border-2 border-gray-400 rounded flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-600 transform -rotate-90">KORIDOR</span>
                  </div>
                  {/* Kamar Kanan */}
                  <div className="flex-1 grid gap-2" style={{ gridTemplateRows: `repeat(${config.right}, 1fr)` }}>
                    {kamarList.slice(config.left, config.left + config.right).map((kamar) => {
                      const layout = kamar.layoutId ? daftarDenah.find(l => l.id === kamar.layoutId) : null;
                      
                      return (
                        <div 
                          key={kamar.id}
                          className={`${layout ? 'bg-white' : 'bg-blue-100'} border-2 ${layout ? 'border-gray-400' : 'border-blue-400'} rounded p-2 flex flex-col justify-center cursor-pointer hover:shadow-md transition relative overflow-hidden`}
                          onClick={() => {
                            const nomor = prompt(`Edit nomor kamar:`, kamar.nomor);
                            if (nomor) {
                              setKamarList(kamarList.map(k => 
                                k.id === kamar.id ? { ...k, nomor } : k
                              ));
                            }
                          }}
                        >
                          {layout ? (
                            <>
                              {/* Tampilkan denah */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-[10px] text-gray-500">
                                  <i className="fas fa-drafting-compass"></i> Denah: {layout.name}
                                </div>
                              </div>
                              <div className="relative z-10 bg-white bg-opacity-80 px-1 py-0.5 rounded">
                                <div className="text-xs font-semibold text-center">Kamar {kamar.nomor}</div>
                                <div className="text-[10px] text-center text-gray-600">{kamar.tipe}</div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="text-xs font-semibold text-center">Kamar {kamar.nomor}</div>
                              <div className="text-[10px] text-center text-gray-600">{kamar.tipe}</div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

          {!selectedBangsalId && (
            <div className="text-center py-12 text-gray-500">
              <i className="fas fa-map text-4xl mb-3 text-gray-300"></i>
              <p>Pilih bangsal untuk melihat dan mengedit peta ruang</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
