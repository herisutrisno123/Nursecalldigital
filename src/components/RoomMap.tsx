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
          <p className="text-gray-600">Konten template ruang akan ditampilkan di sini.</p>
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
