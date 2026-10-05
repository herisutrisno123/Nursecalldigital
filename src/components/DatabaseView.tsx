import { useState } from 'react';

interface TableInfo {
  name: string;
  description: string;
  columns: { name: string; type: string; constraint: string; description: string }[];
  icon: string;
  color: string;
}

const tables: TableInfo[] = [
  {
    name: 'rooms',
    description: 'Data Kamar - Menyimpan informasi seluruh kamar pasien',
    icon: 'fa-bed',
    color: 'bg-blue-100 text-blue-600',
    columns: [
      { name: 'id', type: 'VARCHAR(10)', constraint: 'PRIMARY KEY', description: 'ID unik kamar' },
      { name: 'room_number', type: 'VARCHAR(10)', constraint: 'NOT NULL', description: 'Nomor kamar' },
      { name: 'floor', type: 'INT', constraint: 'NOT NULL', description: 'Lantai' },
      { name: 'building', type: 'VARCHAR(50)', constraint: 'NOT NULL', description: 'Nama gedung' },
      { name: 'bed_count', type: 'INT', constraint: 'DEFAULT 1', description: 'Jumlah tempat tidur' },
      { name: 'room_type', type: 'ENUM', constraint: 'NOT NULL', description: 'Tipe kamar (VIP, Reguler, ICU, NICU, HCU)' },
      { name: 'status', type: 'ENUM', constraint: "DEFAULT 'active'", description: 'Status kamar (active, inactive, maintenance)' },
      { name: 'created_at', type: 'TIMESTAMP', constraint: 'DEFAULT NOW()', description: 'Waktu pembuatan' },
    ]
  },
  {
    name: 'devices',
    description: 'Perangkat Commax Digital - Menyimpan data semua perangkat nurse call',
    icon: 'fa-microchip',
    color: 'bg-green-100 text-green-600',
    columns: [
      { name: 'id', type: 'VARCHAR(10)', constraint: 'PRIMARY KEY', description: 'ID unik perangkat' },
      { name: 'device_name', type: 'VARCHAR(100)', constraint: 'NOT NULL', description: 'Nama perangkat' },
      { name: 'device_type', type: 'ENUM', constraint: 'NOT NULL', description: 'Tipe (bedside_unit, bathroom_pull, corridor_display, nurse_station, dome_light)' },
      { name: 'model', type: 'VARCHAR(50)', constraint: 'NOT NULL', description: 'Model perangkat Commax' },
      { name: 'ip_address', type: 'VARCHAR(15)', constraint: 'NOT NULL', description: 'Alamat IP perangkat' },
      { name: 'mac_address', type: 'VARCHAR(17)', constraint: 'UNIQUE', description: 'MAC address perangkat' },
      { name: 'room_id', type: 'VARCHAR(10)', constraint: 'FK → rooms.id', description: 'Referensi ke kamar' },
      { name: 'status', type: 'ENUM', constraint: "DEFAULT 'offline'", description: 'Status (online, offline, fault, maintenance)' },
      { name: 'firmware_version', type: 'VARCHAR(20)', constraint: '', description: 'Versi firmware' },
      { name: 'last_seen', type: 'TIMESTAMP', constraint: '', description: 'Waktu terakhir terkoneksi' },
      { name: 'created_at', type: 'TIMESTAMP', constraint: 'DEFAULT NOW()', description: 'Waktu registrasi' },
    ]
  },
  {
    name: 'call_events',
    description: 'Event Panggilan Pasien - Mencatat setiap event panggilan dari perangkat',
    icon: 'fa-phone-volume',
    color: 'bg-red-100 text-red-600',
    columns: [
      { name: 'id', type: 'VARCHAR(10)', constraint: 'PRIMARY KEY', description: 'ID unik event' },
      { name: 'device_id', type: 'VARCHAR(10)', constraint: 'FK → devices.id', description: 'Perangkat sumber panggilan' },
      { name: 'room_id', type: 'VARCHAR(10)', constraint: 'FK → rooms.id', description: 'Kamar asal panggilan' },
      { name: 'event_type', type: 'ENUM', constraint: 'NOT NULL', description: 'Tipe event (normal_call, emergency_call, bathroom_call, reset_call, cancel_call)' },
      { name: 'priority', type: 'ENUM', constraint: 'NOT NULL', description: 'Prioritas (low, medium, high, critical)' },
      { name: 'timestamp', type: 'TIMESTAMP', constraint: 'NOT NULL', description: 'Waktu event terjadi' },
      { name: 'acknowledged_at', type: 'TIMESTAMP', constraint: 'NULLABLE', description: 'Waktu diakui perawat' },
      { name: 'acknowledged_by', type: 'VARCHAR(10)', constraint: 'FK → nurses.id', description: 'Perawat yang mengakui' },
      { name: 'resolved_at', type: 'TIMESTAMP', constraint: 'NULLABLE', description: 'Waktu diselesaikan' },
      { name: 'notes', type: 'TEXT', constraint: '', description: 'Catatan event' },
    ]
  },
  {
    name: 'call_sessions',
    description: 'Sesi Panggilan Lengkap - Menggabungkan data panggilan menjadi satu sesi lengkap',
    icon: 'fa-layer-group',
    color: 'bg-purple-100 text-purple-600',
    columns: [
      { name: 'id', type: 'VARCHAR(10)', constraint: 'PRIMARY KEY', description: 'ID unik sesi' },
      { name: 'call_event_id', type: 'VARCHAR(10)', constraint: 'FK → call_events.id', description: 'Event panggilan awal' },
      { name: 'room_id', type: 'VARCHAR(10)', constraint: 'FK → rooms.id', description: 'Kamar' },
      { name: 'patient_name', type: 'VARCHAR(100)', constraint: '', description: 'Nama pasien' },
      { name: 'nurse_id', type: 'VARCHAR(10)', constraint: 'FK → nurses.id', description: 'Perawat yang merespon' },
      { name: 'start_time', type: 'TIMESTAMP', constraint: 'NOT NULL', description: 'Waktu mulai sesi' },
      { name: 'response_time', type: 'TIMESTAMP', constraint: 'NULLABLE', description: 'Waktu respon perawat' },
      { name: 'end_time', type: 'TIMESTAMP', constraint: 'NULLABLE', description: 'Waktu sesi berakhir' },
      { name: 'duration_seconds', type: 'INT', constraint: 'NULLABLE', description: 'Durasi sesi dalam detik' },
      { name: 'status', type: 'ENUM', constraint: "DEFAULT 'active'", description: 'Status (active, responded, resolved, timeout, escalated)' },
      { name: 'call_type', type: 'VARCHAR(50)', constraint: '', description: 'Tipe panggilan' },
    ]
  },
  {
    name: 'nurses',
    description: 'Data Perawat - Menyimpan informasi seluruh perawat',
    icon: 'fa-user-nurse',
    color: 'bg-pink-100 text-pink-600',
    columns: [
      { name: 'id', type: 'VARCHAR(10)', constraint: 'PRIMARY KEY', description: 'ID unik perawat' },
      { name: 'name', type: 'VARCHAR(100)', constraint: 'NOT NULL', description: 'Nama lengkap' },
      { name: 'nip', type: 'VARCHAR(20)', constraint: 'UNIQUE', description: 'Nomor Induk Pegawai' },
      { name: 'role', type: 'ENUM', constraint: 'NOT NULL', description: 'Role (head_nurse, nurse, assistant_nurse)' },
      { name: 'shift', type: 'ENUM', constraint: 'NOT NULL', description: 'Shift (pagi, siang, malam)' },
      { name: 'floor', type: 'INT', constraint: 'NOT NULL', description: 'Lantai penugasan' },
      { name: 'phone', type: 'VARCHAR(15)', constraint: '', description: 'Nomor telepon' },
      { name: 'email', type: 'VARCHAR(100)', constraint: 'UNIQUE', description: 'Email' },
      { name: 'status', type: 'ENUM', constraint: "DEFAULT 'off_duty'", description: 'Status (active, on_duty, off_duty, break)' },
      { name: 'avatar', type: 'VARCHAR(10)', constraint: '', description: 'Emoji avatar' },
      { name: 'created_at', type: 'TIMESTAMP', constraint: 'DEFAULT NOW()', description: 'Waktu pembuatan' },
    ]
  },
  {
    name: 'nurse_actions',
    description: 'Aktivitas Perawat - Mencatat setiap tindakan perawat terhadap panggilan',
    icon: 'fa-hands-helping',
    color: 'bg-orange-100 text-orange-600',
    columns: [
      { name: 'id', type: 'VARCHAR(10)', constraint: 'PRIMARY KEY', description: 'ID unik aksi' },
      { name: 'nurse_id', type: 'VARCHAR(10)', constraint: 'FK → nurses.id', description: 'Perawat yang melakukan aksi' },
      { name: 'call_session_id', type: 'VARCHAR(10)', constraint: 'FK → call_sessions.id', description: 'Sesi panggilan terkait' },
      { name: 'action_type', type: 'ENUM', constraint: 'NOT NULL', description: 'Tipe aksi (acknowledge, respond, assist, medicate, escalate, close)' },
      { name: 'timestamp', type: 'TIMESTAMP', constraint: 'NOT NULL', description: 'Waktu aksi dilakukan' },
      { name: 'notes', type: 'TEXT', constraint: '', description: 'Catatan aksi' },
      { name: 'duration_minutes', type: 'INT', constraint: 'DEFAULT 0', description: 'Durasi aksi dalam menit' },
    ]
  },
  {
    name: 'device_logs',
    description: 'Log Status Perangkat - Mencatat perubahan status dan event perangkat',
    icon: 'fa-scroll',
    color: 'bg-yellow-100 text-yellow-600',
    columns: [
      { name: 'id', type: 'VARCHAR(10)', constraint: 'PRIMARY KEY', description: 'ID unik log' },
      { name: 'device_id', type: 'VARCHAR(10)', constraint: 'FK → devices.id', description: 'Perangkat terkait' },
      { name: 'event_type', type: 'ENUM', constraint: 'NOT NULL', description: 'Tipe event (online, offline, fault, firmware_update, config_change, heartbeat)' },
      { name: 'timestamp', type: 'TIMESTAMP', constraint: 'NOT NULL', description: 'Waktu event' },
      { name: 'details', type: 'TEXT', constraint: '', description: 'Detail event' },
      { name: 'severity', type: 'ENUM', constraint: "DEFAULT 'info'", description: 'Severity (info, warning, error, critical)' },
    ]
  },
  {
    name: 'gateway_logs',
    description: 'Log Integrasi API/MQTT - Mencatat semua komunikasi gateway',
    icon: 'fa-network-wired',
    color: 'bg-indigo-100 text-indigo-600',
    columns: [
      { name: 'id', type: 'VARCHAR(10)', constraint: 'PRIMARY KEY', description: 'ID unik log' },
      { name: 'source', type: 'ENUM', constraint: 'NOT NULL', description: 'Sumber (mqtt, api, websocket, tcp)' },
      { name: 'event_type', type: 'ENUM', constraint: 'NOT NULL', description: 'Tipe event (message_received, message_sent, connection, disconnection, error)' },
      { name: 'payload', type: 'JSON', constraint: '', description: 'Payload data (JSON)' },
      { name: 'timestamp', type: 'TIMESTAMP', constraint: 'NOT NULL', description: 'Waktu event' },
      { name: 'status', type: 'ENUM', constraint: "DEFAULT 'pending'", description: 'Status (success, failed, pending)' },
      { name: 'response_time_ms', type: 'INT', constraint: 'DEFAULT 0', description: 'Waktu respon dalam milidetik' },
    ]
  },
];

export default function DatabaseView() {
  const [selectedTable, setSelectedTable] = useState<string>('rooms');
  const [showSQL, setShowSQL] = useState(false);

  const selectedTableData = tables.find(t => t.name === selectedTable);

  const generateSQL = () => {
    return tables.map(table => {
      const cols = table.columns.map(col => {
        let line = `  ${col.name} ${col.type}`;
        if (col.constraint) line += ` ${col.constraint}`;
        return line;
      }).join(',\n');
      return `-- ${table.description}\nCREATE TABLE ${table.name} (\n${cols}\n);`;
    }).join('\n\n');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Struktur database untuk sistem Nurse Digital Monitor terintegrasi Commax</p>
        </div>
        <button
          onClick={() => setShowSQL(!showSQL)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${showSQL ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}
        >
          <i className="fas fa-code mr-2"></i>{showSQL ? 'Tutup SQL' : 'Lihat SQL'}
        </button>
      </div>

      {/* SQL View */}
      {showSQL && (
        <div className="bg-slate-900 rounded-xl p-5 overflow-x-auto">
          <pre className="text-sm text-green-400 font-mono whitespace-pre">{generateSQL()}</pre>
        </div>
      )}

      {/* Table Selector */}
      <div className="flex gap-2 flex-wrap">
        {tables.map(table => (
          <button
            key={table.name}
            onClick={() => setSelectedTable(table.name)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
              selectedTable === table.name ? 'bg-blue-600 text-white shadow' : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            <i className={`fas ${table.icon} text-xs`}></i>
            <span>{table.name}</span>
          </button>
        ))}
      </div>

      {/* Table Detail */}
      {selectedTableData && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-5 border-b bg-gray-50">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedTableData.color}`}>
                <i className={`fas ${selectedTableData.icon}`}></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Tabel: {selectedTableData.name}</h3>
                <p className="text-sm text-gray-500">{selectedTableData.description}</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">#</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Kolom</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Tipe Data</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Constraint</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Deskripsi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {selectedTableData.columns.map((col, index) => (
                  <tr key={col.name} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400 text-xs">{index + 1}</td>
                    <td className="px-4 py-3">
                      <code className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono text-gray-800">{col.name}</code>
                      {col.constraint.includes('PRIMARY KEY') && (
                        <i className="fas fa-key text-yellow-500 ml-2 text-xs" title="Primary Key"></i>
                      )}
                      {col.constraint.includes('FK') && (
                        <i className="fas fa-link text-blue-500 ml-2 text-xs" title="Foreign Key"></i>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-purple-50 rounded text-xs font-mono text-purple-700">{col.type}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{col.constraint || '-'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{col.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Stats */}
          <div className="p-4 border-t bg-gray-50 flex items-center gap-4 text-xs text-gray-500">
            <span><i className="fas fa-columns mr-1"></i>{selectedTableData.columns.length} kolom</span>
            <span><i className="fas fa-key mr-1 text-yellow-500"></i>1 Primary Key</span>
            <span><i className="fas fa-link mr-1 text-blue-500"></i>{selectedTableData.columns.filter(c => c.constraint.includes('FK')).length} Foreign Key</span>
          </div>
        </div>
      )}

      {/* ER Diagram Summary */}
      <div className="bg-white rounded-xl shadow-sm border p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Relasi Antar Tabel (ER Diagram)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Relasi Utama</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-100 rounded text-blue-700 font-mono">rooms</span>
                <i className="fas fa-arrow-right text-gray-400"></i>
                <span className="px-2 py-0.5 bg-green-100 rounded text-green-700 font-mono">devices</span>
                <span className="text-gray-500">(1:N)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-green-100 rounded text-green-700 font-mono">devices</span>
                <i className="fas fa-arrow-right text-gray-400"></i>
                <span className="px-2 py-0.5 bg-red-100 rounded text-red-700 font-mono">call_events</span>
                <span className="text-gray-500">(1:N)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-red-100 rounded text-red-700 font-mono">call_events</span>
                <i className="fas fa-arrow-right text-gray-400"></i>
                <span className="px-2 py-0.5 bg-purple-100 rounded text-purple-700 font-mono">call_sessions</span>
                <span className="text-gray-500">(1:1)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-pink-100 rounded text-pink-700 font-mono">nurses</span>
                <i className="fas fa-arrow-right text-gray-400"></i>
                <span className="px-2 py-0.5 bg-orange-100 rounded text-orange-700 font-mono">nurse_actions</span>
                <span className="text-gray-500">(1:N)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-purple-100 rounded text-purple-700 font-mono">call_sessions</span>
                <i className="fas fa-arrow-right text-gray-400"></i>
                <span className="px-2 py-0.5 bg-orange-100 rounded text-orange-700 font-mono">nurse_actions</span>
                <span className="text-gray-500">(1:N)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-green-100 rounded text-green-700 font-mono">devices</span>
                <i className="fas fa-arrow-right text-gray-400"></i>
                <span className="px-2 py-0.5 bg-yellow-100 rounded text-yellow-700 font-mono">device_logs</span>
                <span className="text-gray-500">(1:N)</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Data Flow Commax</h4>
            <div className="space-y-2 text-xs text-gray-600">
              <p>1. <strong>Commax Device</strong> → mengirim event via TCP/MQTT</p>
              <p>2. <strong>Gateway</strong> → menerima & menerjemahkan protocol</p>
              <p>3. <strong>call_events</strong> → menyimpan event mentah</p>
              <p>4. <strong>call_sessions</strong> → menggabungkan jadi sesi lengkap</p>
              <p>5. <strong>nurse_actions</strong> → mencatat respon perawat</p>
              <p>6. <strong>device_logs</strong> → monitoring kesehatan perangkat</p>
              <p>7. <strong>gateway_logs</strong> → audit trail integrasi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
