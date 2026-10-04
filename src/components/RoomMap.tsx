import { useState } from 'react';

export default function RoomMap() {
  const [activeTab, setActiveTab] = useState<'template' | 'peta'>('template');

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
