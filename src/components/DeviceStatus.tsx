import { useState } from 'react';
import { devices, rooms, deviceLogs } from '../data/mockData';

export default function DeviceStatus() {
  const [filter, setFilter] = useState<string>('all');
  const [view, setView] = useState<'devices' | 'logs'>('devices');
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);

  const filteredDevices = filter === 'all' ? devices : devices.filter(d => d.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-700';
      case 'offline': return 'bg-gray-100 text-gray-700';
      case 'fault': return 'bg-red-100 text-red-700';
      case 'maintenance': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'bedside_unit': return 'fa-bed';
      case 'bathroom_pull': return 'fa-bath';
      case 'corridor_display': return 'fa-tv';
      case 'nurse_station': return 'fa-desktop';
      case 'dome_light': return 'fa-lightbulb';
      default: return 'fa-microchip';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setView('devices')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${view === 'devices' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}
          >
            <i className="fas fa-microchip mr-2"></i>Daftar Perangkat
          </button>
          <button
            onClick={() => setView('logs')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${view === 'logs' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}
          >
            <i className="fas fa-scroll mr-2"></i>Log Perangkat
          </button>
        </div>

        {view === 'devices' && (
          <div className="flex gap-2 flex-wrap items-center">
            <div className="flex gap-2 flex-wrap">
              {['all', 'online', 'offline', 'fault', 'maintenance'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${filter === f ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {f === 'all' ? 'Semua' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAddDeviceModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition shadow-sm"
            >
              <i className="fas fa-plus mr-2"></i>Tambah Perangkat
            </button>
          </div>
        )}
      </div>

      {/* Device Cards */}
      {view === 'devices' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDevices.map(device => {
            const room = rooms.find(r => r.id === device.room_id);
            return (
              <div key={device.id} className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      device.status === 'online' ? 'bg-green-100 text-green-600' :
                      device.status === 'fault' ? 'bg-red-100 text-red-600' :
                      device.status === 'offline' ? 'bg-gray-100 text-gray-500' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      <i className={`fas ${getDeviceIcon(device.device_type)}`}></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 text-sm">{device.device_name}</h4>
                      <p className="text-xs text-gray-500">Kamar {room?.room_number} • {room?.building}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(device.status)}`}>
                    {device.status.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Model:</span>
                    <span className="font-medium">{device.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IP Address:</span>
                    <span className="font-mono">{device.ip_address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>MAC:</span>
                    <span className="font-mono">{device.mac_address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Firmware:</span>
                    <span>{device.firmware_version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Terakhir Terlihat:</span>
                    <span>{new Date(device.last_seen).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {device.status === 'fault' && (
                  <div className="mt-3 p-2 bg-red-50 rounded-lg text-xs text-red-700 flex items-center gap-2">
                    <i className="fas fa-exclamation-triangle"></i>
                    <span>Perlu perhatian - perangkat mengalami fault</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Device Logs */}
      {view === 'logs' && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Waktu</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Perangkat</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Event</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Severity</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {deviceLogs.map(log => {
                  const device = devices.find(d => d.id === log.device_id);
                  return (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {new Date(log.timestamp).toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3 text-gray-700 text-xs">{device?.device_name || log.device_id}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{log.event_type}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          log.severity === 'critical' ? 'bg-red-100 text-red-700' :
                          log.severity === 'error' ? 'bg-orange-100 text-orange-700' :
                          log.severity === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {log.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{log.details}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-xl font-bold text-gray-800">{devices.length}</p>
          <p className="text-xs text-gray-500">Total Perangkat</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-xl font-bold text-green-600">{devices.filter(d => d.status === 'online').length}</p>
          <p className="text-xs text-gray-500">Online</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-xl font-bold text-gray-500">{devices.filter(d => d.status === 'offline').length}</p>
          <p className="text-xs text-gray-500">Offline</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-xl font-bold text-red-600">{devices.filter(d => d.status === 'fault').length}</p>
          <p className="text-xs text-gray-500">Fault</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-xl font-bold text-yellow-600">{devices.filter(d => d.status === 'maintenance').length}</p>
          <p className="text-xs text-gray-500">Maintenance</p>
        </div>
      </div>

      {/* Add Device Modal */}
      {showAddDeviceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-microchip text-green-600"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Tambah Perangkat Baru</h3>
                </div>
                <button 
                  onClick={() => setShowAddDeviceModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nama Perangkat</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Bedside Unit 401-A"
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Tipe Perangkat</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    <option value="bedside_unit">Bedside Unit</option>
                    <option value="bathroom_pull">Bathroom Pull</option>
                    <option value="corridor_display">Corridor Display</option>
                    <option value="nurse_station">Nurse Station</option>
                    <option value="dome_light">Dome Light</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Model</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Commax KN-702T"
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Firmware Version</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: v2.1.4"
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">IP Address</label>
                  <input 
                    type="text" 
                    placeholder="192.168.1.xxx"
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">MAC Address</label>
                  <input 
                    type="text" 
                    placeholder="AA:BB:CC:DD:EE:FF"
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Kamar</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    {rooms.map(room => (
                      <option key={room.id} value={room.id}>
                        Kamar {room.room_number} - {room.building} ({room.room_type})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="fault">Fault</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
                <i className="fas fa-info-circle mr-1"></i>
                Pastikan IP Address dan MAC Address unik untuk setiap perangkat. Perangkat akan otomatis terdeteksi setelah ditambahkan.
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex gap-3 justify-end flex-shrink-0">
              <button 
                onClick={() => setShowAddDeviceModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100"
              >
                Batal
              </button>
              <button 
                onClick={() => setShowAddDeviceModal(false)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2"
              >
                <i className="fas fa-save"></i>
                Simpan Perangkat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
