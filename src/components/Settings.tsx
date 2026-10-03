import { useState } from 'react';

export default function Settings() {
  const [activeSection, setActiveSection] = useState('general');

  const sections = [
    { id: 'general', label: 'Umum', icon: 'fa-sliders' },
    { id: 'notifications', label: 'Notifikasi', icon: 'fa-bell' },
    { id: 'network', label: 'Jaringan', icon: 'fa-wifi' },
    { id: 'commax', label: 'Commax Device', icon: 'fa-microchip' },
    { id: 'backup', label: 'Backup & Restore', icon: 'fa-database' },
    { id: 'about', label: 'Tentang Sistem', icon: 'fa-info-circle' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Menu */}
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Pengaturan</h3>
          <div className="space-y-1">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                  activeSection === section.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className={`fas ${section.icon} w-5 text-center`}></i>
                <span>{section.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border p-6">
          {/* General Settings */}
          {activeSection === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Pengaturan Umum</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nama Rumah Sakit</label>
                  <input type="text" defaultValue="RS Umum Daerah Harapan Sehat" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Zona Waktu</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    <option>Asia/Jakarta (WIB, UTC+7)</option>
                    <option>Asia/Makassar (WITA, UTC+8)</option>
                    <option>Asia/Jayapura (WIT, UTC+9)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Format Tanggal</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Bahasa</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    <option>Bahasa Indonesia</option>
                    <option>English</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Mode Gelap</p>
                    <p className="text-xs text-gray-500">Aktifkan tampilan gelap</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                Simpan Perubahan
              </button>
            </div>
          )}

          {/* Notification Settings */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Pengaturan Notifikasi</h3>
              <div className="space-y-4">
                {[
                  { label: 'Notifikasi Panggilan Darurat', desc: 'Tampilkan alert untuk panggilan emergency', defaultChecked: true },
                  { label: 'Notifikasi Panggilan Normal', desc: 'Tampilkan alert untuk panggilan biasa', defaultChecked: true },
                  { label: 'Notifikasi Timeout', desc: 'Alert jika panggilan tidak direspon dalam waktu tertentu', defaultChecked: true },
                  { label: 'Notifikasi Device Fault', desc: 'Alert jika perangkat mengalami fault', defaultChecked: true },
                  { label: 'Notifikasi Device Offline', desc: 'Alert jika perangkat offline', defaultChecked: false },
                  { label: 'Suara Alert', desc: 'Aktifkan suara untuk panggilan masuk', defaultChecked: true },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={item.defaultChecked} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                ))}
                <div>
                  <label className="text-sm font-medium text-gray-700">Timeout Panggilan (detik)</label>
                  <input type="number" defaultValue={60} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Eskalasi Otomatis Setelah (detik)</label>
                  <input type="number" defaultValue={120} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                Simpan Perubahan
              </button>
            </div>
          )}

          {/* Network Settings */}
          {activeSection === 'network' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Pengaturan Jaringan</h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-green-600"></i>
                    <span className="text-sm font-medium text-green-700">Koneksi Jaringan Aktif</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">IP: 192.168.1.10 | Subnet: 255.255.255.0 | Gateway: 192.168.1.1</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">IP Address Server</label>
                  <input type="text" defaultValue="192.168.1.10" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">MQTT Broker</label>
                  <input type="text" defaultValue="mqtt://192.168.1.1:1883" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">API Endpoint</label>
                  <input type="text" defaultValue="http://192.168.1.10:8080/api/v1" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">WebSocket URL</label>
                  <input type="text" defaultValue="ws://192.168.1.10:8081" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                Simpan Perubahan
              </button>
            </div>
          )}

          {/* Commax Device Settings */}
          {activeSection === 'commax' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Pengaturan Perangkat Commax</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Protocol</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    <option>Commax KN-TCP v2 (Default)</option>
                    <option>Commax KN-UDP</option>
                    <option>Commax KN-Serial</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Gateway IP</label>
                  <input type="text" defaultValue="192.168.1.50" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Port</label>
                  <input type="number" defaultValue={5000} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Heartbeat Interval (detik)</label>
                  <input type="number" defaultValue={30} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Timeout Koneksi (detik)</label>
                  <input type="number" defaultValue={60} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Auto Discovery</p>
                    <p className="text-xs text-gray-500">Otomatis mendeteksi perangkat Commax baru</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                Simpan Perubahan
              </button>
            </div>
          )}

          {/* Backup Settings */}
          {activeSection === 'backup' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Backup & Restore</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Backup Otomatis</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Backup database secara berkala</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Frekuensi Backup</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    <option>Setiap 6 jam</option>
                    <option>Setiap 12 jam</option>
                    <option>Setiap hari</option>
                    <option>Setiap minggu</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                    <i className="fas fa-download mr-2"></i>Backup Sekarang
                  </button>
                  <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700">
                    <i className="fas fa-upload mr-2"></i>Restore
                  </button>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Riwayat Backup</h4>
                  <div className="space-y-2">
                    {[
                      { date: '2026-01-15 06:00', size: '24.5 MB', status: 'success' },
                      { date: '2026-01-14 18:00', size: '24.3 MB', status: 'success' },
                      { date: '2026-01-14 06:00', size: '24.1 MB', status: 'success' },
                    ].map((backup, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                        <span className="text-gray-700">{backup.date}</span>
                        <span className="text-gray-500">{backup.size}</span>
                        <span className="text-green-600"><i className="fas fa-check-circle"></i></span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* About */}
          {activeSection === 'about' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Tentang Sistem</h3>
              <div className="space-y-4">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-hospital text-white text-2xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-gray-800">Nurse Digital Monitor</h4>
                  <p className="text-sm text-gray-600 mt-1">Commax Digital Nurse Call System</p>
                  <p className="text-xs text-gray-500 mt-2">Version 2.1.0</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-500">Versi Aplikasi</span>
                    <span className="font-medium text-gray-800">2.1.0</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-500">Versi Database</span>
                    <span className="font-medium text-gray-800">3.0.0</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-500">Commax Protocol</span>
                    <span className="font-medium text-gray-800">KN-TCP v2</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-500">Last Update</span>
                    <span className="font-medium text-gray-800">15 Januari 2026</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-500">License</span>
                    <span className="font-medium text-gray-800">Enterprise</span>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-xs text-blue-700">
                    © 2026 Nurse Digital Monitor. Terintegrasi dengan Commax Digital Nurse Call System.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
