import { useState } from 'react';

export default function Settings() {
  const [activeSection, setActiveSection] = useState('general');
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activationSuccess, setActivationSuccess] = useState(false);

  const sections = [
    { id: 'general', label: 'Umum', icon: 'fa-sliders' },
    { id: 'notifications', label: 'Notifikasi', icon: 'fa-bell' },
    { id: 'network', label: 'Jaringan', icon: 'fa-wifi' },
    { id: 'commax', label: 'Commax Device', icon: 'fa-microchip' },
    { id: 'backup', label: 'Backup & Restore', icon: 'fa-database' },
    { id: 'license', label: 'Lisensi', icon: 'fa-certificate' },
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
                  <label className="text-sm font-medium text-gray-700">Alamat Rumah Sakit</label>
                  <textarea rows={3} defaultValue="Jl. Kesehatan No. 123, Kel. Sukamaju, Kec. Cilandak, Jakarta Selatan, DKI Jakarta 12560" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Penanggung Jawab</label>
                    <input type="text" defaultValue="dr. H. Bambang Suryadi, Sp.PD" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                    <p className="text-xs text-gray-400 mt-1">Nama lengkap penanggung jawab sistem</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Jabatan Penanggung Jawab</label>
                    <input type="text" defaultValue="Kepala Instalasi Rawat Inap" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Jumlah Channel Nurse Call</label>
                  <input type="number" defaultValue={64} min={1} max={512} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                  <p className="text-xs text-gray-400 mt-1">Total channel yang tersedia pada sistem Commax (maksimal sesuai kapasitas gateway)</p>
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

          {/* License */}
          {activeSection === 'license' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Manajemen Lisensi</h3>

              {/* License Status Card */}
              <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                      <i className="fas fa-shield-halved text-white text-xl"></i>
                    </div>
                    <div>
                      <p className="text-sm text-green-700 font-medium">Status Lisensi</p>
                      <p className="text-xl font-bold text-green-800">Aktif — Enterprise</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                    <i className="fas fa-check-circle mr-1"></i>Valid
                  </span>
                </div>
              </div>

              {/* License Details */}
              <div className="bg-white border rounded-xl p-5">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Informasi Lisensi</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-500">Tipe Lisensi</span>
                    <span className="font-medium text-gray-800">Enterprise (Perpetual)</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-500">Nomor Lisensi</span>
                    <span className="font-mono text-gray-800">NDM-ENT-2026-001234</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-500">Tanggal Aktivasi</span>
                    <span className="font-medium text-gray-800">01 Januari 2026</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-500">Masa Berlaku</span>
                    <span className="font-medium text-green-700">Unlimited (Perpetual)</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-500">Support & Update</span>
                    <span className="font-medium text-gray-800">s/d 31 Desember 2026</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-500">Penerbit</span>
                    <span className="font-medium text-gray-800">PT. Nurse Digital Indonesia</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-500">Dilaporkan ke</span>
                    <span className="font-medium text-gray-800">RSUD Harapan Sehat</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-white border rounded-xl p-5">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Fitur yang Tersedia</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    { label: 'Manajemen Panggilan Pasien', enabled: true },
                    { label: 'Monitoring Perangkat Commax', enabled: true },
                    { label: 'Peta Kamar Real-time', enabled: true },
                    { label: 'Statistik & Reporting', enabled: true },
                    { label: 'Integrasi MQTT / API / TCP', enabled: true },
                    { label: 'Manajemen Akun Multi-Role', enabled: true },
                    { label: 'Maksimal 512 Channel', enabled: true },
                    { label: 'Maksimal 100 Kamar', enabled: true },
                    { label: 'Backup & Restore Otomatis', enabled: true },
                    { label: 'Audit Trail & Log', enabled: true },
                    { label: 'Multi-Floor & Multi-Building', enabled: true },
                    { label: 'Priority Escalation', enabled: true },
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                      <i className={`fas ${feature.enabled ? 'fa-check-circle text-green-600' : 'fa-times-circle text-gray-400'}`}></i>
                      <span className={feature.enabled ? 'text-gray-700' : 'text-gray-400'}>{feature.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => setShowActivateModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  <i className="fas fa-key mr-2"></i>Aktivasikan Lisensi Baru
                </button>
                <button 
                  onClick={() => setShowRenewModal(true)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                >
                  <i className="fas fa-sync-alt mr-2"></i>Perbarui Lisensi
                </button>
                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                  <i className="fas fa-file-export mr-2"></i>Ekspor File Lisensi
                </button>
              </div>

              {/* Success Notification */}
              {activationSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <i className="fas fa-check-circle text-green-600 text-xl"></i>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800">Lisensi berhasil diperbarui!</p>
                    <p className="text-xs text-green-600">Sistem akan menggunakan lisensi baru mulai sekarang.</p>
                  </div>
                  <button 
                    onClick={() => setActivationSuccess(false)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}

              {/* License History */}
              <div className="bg-white border rounded-xl p-5">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Riwayat Lisensi</h4>
                <div className="space-y-2 text-xs">
                  {[
                    { date: '01 Jan 2026', action: 'Aktivasi Lisensi Enterprise', status: 'success', user: 'admin' },
                    { date: '15 Des 2025', action: 'Upgrade dari Professional ke Enterprise', status: 'success', user: 'admin' },
                    { date: '01 Jan 2025', action: 'Aktivasi Lisensi Professional', status: 'success', user: 'admin' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-circle text-green-500 text-[8px]"></i>
                        <span className="text-gray-700">{item.action}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-500">
                        <span>oleh {item.user}</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  ))}
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

      {/* Activate License Modal */}
      {showActivateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-key text-blue-600"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Aktivasi Lisensi Baru</h3>
                </div>
                <button 
                  onClick={() => setShowActivateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nomor Lisensi</label>
                <input 
                  type="text" 
                  placeholder="Contoh: NDM-ENT-2026-XXXXXX"
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 font-mono" 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Kunci Aktivasi</label>
                <input 
                  type="text" 
                  placeholder="Masukkan kunci aktivasi"
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 font-mono" 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Tipe Lisensi</label>
                <select className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                  <option>Enterprise (Perpetual)</option>
                  <option>Professional (1 Tahun)</option>
                  <option>Standard (6 Bulan)</option>
                </select>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
                <i className="fas fa-info-circle mr-1"></i>
                Pastikan nomor lisensi dan kunci aktivasi sesuai dengan yang diberikan oleh distributor resmi.
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex gap-3 justify-end">
              <button 
                onClick={() => setShowActivateModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  setIsProcessing(true);
                  setTimeout(() => {
                    setIsProcessing(false);
                    setShowActivateModal(false);
                    setActivationSuccess(true);
                    setTimeout(() => setActivationSuccess(false), 5000);
                  }, 2000);
                }}
                disabled={isProcessing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Memproses...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check"></i>
                    Aktivasi
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Renew License Modal */}
      {showRenewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-sync-alt text-green-600"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Perbarui Lisensi</h3>
                </div>
                <button 
                  onClick={() => setShowRenewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
                <i className="fas fa-exclamation-triangle mr-1"></i>
                Perbarui lisensi akan memperpanjang masa berlaku support dan update tanpa mengubah fitur yang tersedia.
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Lisensi Saat Ini</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500">Nomor:</span>
                    <span className="font-mono text-gray-800">NDM-ENT-2026-001234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Support s/d:</span>
                    <span className="font-medium text-gray-800">31 Desember 2026</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Kunci Perpanjangan</label>
                <input 
                  type="text" 
                  placeholder="Masukkan kunci perpanjangan"
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 font-mono" 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Durasi Perpanjangan</label>
                <select className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                  <option>1 Tahun</option>
                  <option>2 Tahun</option>
                  <option>3 Tahun</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex gap-3 justify-end">
              <button 
                onClick={() => setShowRenewModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  setIsProcessing(true);
                  setTimeout(() => {
                    setIsProcessing(false);
                    setShowRenewModal(false);
                    setActivationSuccess(true);
                    setTimeout(() => setActivationSuccess(false), 5000);
                  }, 2000);
                }}
                disabled={isProcessing}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Memproses...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check"></i>
                    Perbarui
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
