import { useState } from 'react';
import { gatewayLogs } from '../data/mockData';

export default function Integration() {
  const [filter, setFilter] = useState<string>('all');

  const filteredLogs = filter === 'all' ? gatewayLogs : gatewayLogs.filter(l => l.source === filter);

  const connectionStatus: Record<string, { status: string; address: string; uptime: string; count: number; countLabel: string }> = {
    mqtt: { status: 'connected', address: 'mqtt://192.168.1.1:1883', uptime: '23h 45m', count: 1247, countLabel: 'Messages' },
    api: { status: 'connected', address: 'http://192.168.1.10:8080/api/v1', uptime: '23h 45m', count: 3456, countLabel: 'Requests' },
    websocket: { status: 'connected', address: 'ws://192.168.1.10:8081', uptime: '23h 45m', count: 5, countLabel: 'Clients' },
    tcp: { status: 'connected', address: '192.168.1.50:5000', uptime: '23h 45m', count: 10, countLabel: 'Connections' },
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(connectionStatus).map(([key, conn]) => (
          <div key={key} className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className={`fas ${
                    key === 'mqtt' ? 'fa-broadcast-tower' :
                    key === 'api' ? 'fa-plug' :
                    key === 'websocket' ? 'fa-exchange-alt' :
                    'fa-network-wired'
                  } text-blue-600 text-sm`}></i>
                </div>
                <span className="font-medium text-gray-800 uppercase text-sm">{key}</span>
              </div>
              <span className="flex items-center gap-1 text-xs text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                {conn.status}
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Address:</span>
                <span className="font-mono text-gray-700 truncate ml-2 max-w-[140px]">{conn.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Uptime:</span>
                <span className="text-gray-700">{conn.uptime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{conn.countLabel}:</span>
                <span className="font-bold text-gray-800">{conn.count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Commax Protocol Info */}
      <div className="bg-white rounded-xl shadow-sm border p-5">
        <h3 className="font-semibold text-gray-800 mb-4">
          <i className="fas fa-microchip mr-2 text-blue-600"></i>
          Konfigurasi Commax Digital Protocol
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Parameter Koneksi</h4>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-gray-500">Gateway IP:</span>
                <span className="text-gray-800">192.168.1.50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Port TCP:</span>
                <span className="text-gray-800">5000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Protocol:</span>
                <span className="text-gray-800">Commax KN-TCP v2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Baud Rate:</span>
                <span className="text-gray-800">9600</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Data Bits:</span>
                <span className="text-gray-800">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">MQTT Topic:</span>
                <span className="text-gray-800">commax/nurse-call/#</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Mapping Perangkat</h4>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-gray-700">Bedside Unit → Topic: <code className="bg-gray-200 px-1 rounded">commax/bedside/{'{room_id}'}</code></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                <span className="text-gray-700">Bathroom Pull → Topic: <code className="bg-gray-200 px-1 rounded">commax/bathroom/{'{room_id}'}</code></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                <span className="text-gray-700">Corridor Display → Topic: <code className="bg-gray-200 px-1 rounded">commax/display/{'{floor}'}</code></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                <span className="text-gray-700">Nurse Station → Topic: <code className="bg-gray-200 px-1 rounded">commax/station/{'{floor}'}</code></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                <span className="text-gray-700">Dome Light → Topic: <code className="bg-gray-200 px-1 rounded">commax/dome/{'{room_id}'}</code></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gateway Logs */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Gateway Logs</h3>
          <div className="flex gap-2">
            {['all', 'mqtt', 'api', 'websocket', 'tcp'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${filter === f ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {f === 'all' ? 'Semua' : f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Waktu</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Source</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Event</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Response</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {new Date(log.timestamp).toLocaleString('id-ID')}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700 font-medium uppercase">{log.source}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 text-xs">{log.event_type}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      log.status === 'success' ? 'bg-green-100 text-green-700' :
                      log.status === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{log.response_time_ms}ms</td>
                  <td className="px-4 py-3 text-xs text-gray-500 font-mono max-w-[200px] truncate">{log.payload}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
