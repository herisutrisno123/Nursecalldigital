// Database Structure - Commax Digital Nurse Call System

// Tabel rooms - Data Kamar
export interface Room {
  id: string;
  room_number: string;
  floor: number;
  building: string;
  bed_count: number;
  room_type: 'VIP' | 'Reguler' | 'ICU' | 'NICU' | 'HCU';
  status: 'active' | 'inactive' | 'maintenance';
  created_at: string;
}

// Tabel devices - Perangkat Commax Digital
export interface Device {
  id: string;
  device_name: string;
  device_type: 'bedside_unit' | 'bathroom_pull' | 'corridor_display' | 'nurse_station' | 'dome_light';
  model: string;
  ip_address: string;
  mac_address: string;
  room_id: string;
  status: 'online' | 'offline' | 'fault' | 'maintenance';
  firmware_version: string;
  last_seen: string;
  created_at: string;
}

// Tabel call_events - Event Panggilan Pasien
export interface CallEvent {
  id: string;
  device_id: string;
  room_id: string;
  event_type: 'normal_call' | 'emergency_call' | 'bathroom_call' | 'reset_call' | 'cancel_call';
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  acknowledged_at: string | null;
  acknowledged_by: string | null;
  resolved_at: string | null;
  notes: string;
}

// Tabel call_sessions - Sesi Panggilan Lengkap
export interface CallSession {
  id: string;
  call_event_id: string;
  room_id: string;
  patient_name: string;
  nurse_id: string | null;
  start_time: string;
  response_time: string | null;
  end_time: string | null;
  duration_seconds: number | null;
  status: 'active' | 'responded' | 'resolved' | 'timeout' | 'escalated';
  call_type: string;
}

// Tabel nurses - Data Perawat
export interface Nurse {
  id: string;
  name: string;
  nip: string;
  role: 'head_nurse' | 'nurse' | 'assistant_nurse';
  shift: 'pagi' | 'siang' | 'malam';
  floor: number;
  phone: string;
  email: string;
  status: 'active' | 'on_duty' | 'off_duty' | 'break';
  avatar: string;
  created_at: string;
}

// Tabel nurse_actions - Aktivitas Perawat
export interface NurseAction {
  id: string;
  nurse_id: string;
  call_session_id: string;
  action_type: 'acknowledge' | 'respond' | 'assist' | 'medicate' | 'escalate' | 'close';
  timestamp: string;
  notes: string;
  duration_minutes: number;
}

// Tabel device_logs - Log Status Perangkat
export interface DeviceLog {
  id: string;
  device_id: string;
  event_type: 'online' | 'offline' | 'fault' | 'firmware_update' | 'config_change' | 'heartbeat';
  timestamp: string;
  details: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

// Tabel gateway_logs - Log Integrasi API/MQTT
export interface GatewayLog {
  id: string;
  source: 'mqtt' | 'api' | 'websocket' | 'tcp';
  event_type: 'message_received' | 'message_sent' | 'connection' | 'disconnection' | 'error';
  payload: string;
  timestamp: string;
  status: 'success' | 'failed' | 'pending';
  response_time_ms: number;
}

// Mock Data
export const rooms: Room[] = [
  { id: 'R001', room_number: '101', floor: 1, building: 'Gedung A', bed_count: 2, room_type: 'Reguler', status: 'active', created_at: '2024-01-01' },
  { id: 'R002', room_number: '102', floor: 1, building: 'Gedung A', bed_count: 2, room_type: 'Reguler', status: 'active', created_at: '2024-01-01' },
  { id: 'R003', room_number: '103', floor: 1, building: 'Gedung A', bed_count: 1, room_type: 'VIP', status: 'active', created_at: '2024-01-01' },
  { id: 'R004', room_number: '104', floor: 1, building: 'Gedung A', bed_count: 2, room_type: 'Reguler', status: 'active', created_at: '2024-01-01' },
  { id: 'R005', room_number: '201', floor: 2, building: 'Gedung A', bed_count: 2, room_type: 'ICU', status: 'active', created_at: '2024-01-01' },
  { id: 'R006', room_number: '202', floor: 2, building: 'Gedung A', bed_count: 1, room_type: 'ICU', status: 'active', created_at: '2024-01-01' },
  { id: 'R007', room_number: '203', floor: 2, building: 'Gedung A', bed_count: 2, room_type: 'HCU', status: 'active', created_at: '2024-01-01' },
  { id: 'R008', room_number: '204', floor: 2, building: 'Gedung A', bed_count: 1, room_type: 'VIP', status: 'maintenance', created_at: '2024-01-01' },
  { id: 'R009', room_number: '301', floor: 3, building: 'Gedung B', bed_count: 2, room_type: 'Reguler', status: 'active', created_at: '2024-01-01' },
  { id: 'R010', room_number: '302', floor: 3, building: 'Gedung B', bed_count: 2, room_type: 'Reguler', status: 'active', created_at: '2024-01-01' },
  { id: 'R011', room_number: '303', floor: 3, building: 'Gedung B', bed_count: 1, room_type: 'NICU', status: 'active', created_at: '2024-01-01' },
  { id: 'R012', room_number: '304', floor: 3, building: 'Gedung B', bed_count: 2, room_type: 'Reguler', status: 'inactive', created_at: '2024-01-01' },
];

export const devices: Device[] = [
  { id: 'D001', device_name: 'Bedside Unit 101-A', device_type: 'bedside_unit', model: 'Commax KN-702T', ip_address: '192.168.1.101', mac_address: 'AA:BB:CC:DD:01:01', room_id: 'R001', status: 'online', firmware_version: 'v2.1.4', last_seen: '2026-01-15T08:30:00', created_at: '2024-01-01' },
  { id: 'D002', device_name: 'Bathroom Pull 101', device_type: 'bathroom_pull', model: 'Commax KN-301B', ip_address: '192.168.1.102', mac_address: 'AA:BB:CC:DD:01:02', room_id: 'R001', status: 'online', firmware_version: 'v2.1.4', last_seen: '2026-01-15T08:30:00', created_at: '2024-01-01' },
  { id: 'D003', device_name: 'Bedside Unit 102-A', device_type: 'bedside_unit', model: 'Commax KN-702T', ip_address: '192.168.1.103', mac_address: 'AA:BB:CC:DD:01:03', room_id: 'R002', status: 'online', firmware_version: 'v2.1.4', last_seen: '2026-01-15T08:29:00', created_at: '2024-01-01' },
  { id: 'D004', device_name: 'Corridor Display Lantai 1', device_type: 'corridor_display', model: 'Commax KN-800D', ip_address: '192.168.1.104', mac_address: 'AA:BB:CC:DD:01:04', room_id: 'R001', status: 'online', firmware_version: 'v3.0.1', last_seen: '2026-01-15T08:30:00', created_at: '2024-01-01' },
  { id: 'D005', device_name: 'Nurse Station Lantai 1', device_type: 'nurse_station', model: 'Commax KN-900S', ip_address: '192.168.1.105', mac_address: 'AA:BB:CC:DD:01:05', room_id: 'R001', status: 'online', firmware_version: 'v3.2.0', last_seen: '2026-01-15T08:30:00', created_at: '2024-01-01' },
  { id: 'D006', device_name: 'Bedside Unit 201-A', device_type: 'bedside_unit', model: 'Commax KN-702T', ip_address: '192.168.1.201', mac_address: 'AA:BB:CC:DD:02:01', room_id: 'R005', status: 'online', firmware_version: 'v2.1.4', last_seen: '2026-01-15T08:30:00', created_at: '2024-01-01' },
  { id: 'D007', device_name: 'Bedside Unit 202-A', device_type: 'bedside_unit', model: 'Commax KN-702T', ip_address: '192.168.1.202', mac_address: 'AA:BB:CC:DD:02:02', room_id: 'R006', status: 'fault', firmware_version: 'v2.1.4', last_seen: '2026-01-15T07:15:00', created_at: '2024-01-01' },
  { id: 'D008', device_name: 'Dome Light 201', device_type: 'dome_light', model: 'Commax KN-401L', ip_address: '192.168.1.203', mac_address: 'AA:BB:CC:DD:02:03', room_id: 'R005', status: 'online', firmware_version: 'v1.5.0', last_seen: '2026-01-15T08:30:00', created_at: '2024-01-01' },
  { id: 'D009', device_name: 'Bedside Unit 301-A', device_type: 'bedside_unit', model: 'Commax KN-702T', ip_address: '192.168.1.301', mac_address: 'AA:BB:CC:DD:03:01', room_id: 'R009', status: 'offline', firmware_version: 'v2.1.4', last_seen: '2026-01-14T22:00:00', created_at: '2024-01-01' },
  { id: 'D010', device_name: 'Nurse Station Lantai 2', device_type: 'nurse_station', model: 'Commax KN-900S', ip_address: '192.168.1.205', mac_address: 'AA:BB:CC:DD:02:05', room_id: 'R005', status: 'online', firmware_version: 'v3.2.0', last_seen: '2026-01-15T08:30:00', created_at: '2024-01-01' },
];

export const callEvents: CallEvent[] = [
  { id: 'CE001', device_id: 'D001', room_id: 'R001', event_type: 'normal_call', priority: 'medium', timestamp: '2026-01-15T08:15:00', acknowledged_at: '2026-01-15T08:15:30', acknowledged_by: 'N001', resolved_at: '2026-01-15T08:25:00', notes: 'Pasien meminta bantuan minum' },
  { id: 'CE002', device_id: 'D006', room_id: 'R005', event_type: 'emergency_call', priority: 'critical', timestamp: '2026-01-15T08:20:00', acknowledged_at: '2026-01-15T08:20:10', acknowledged_by: 'N002', resolved_at: null, notes: 'Pasien ICU - sesak napas' },
  { id: 'CE003', device_id: 'D002', room_id: 'R001', event_type: 'bathroom_call', priority: 'high', timestamp: '2026-01-15T08:22:00', acknowledged_at: '2026-01-15T08:22:45', acknowledged_by: 'N003', resolved_at: '2026-01-15T08:30:00', notes: 'Pasien butuh bantuan ke kamar mandi' },
  { id: 'CE004', device_id: 'D003', room_id: 'R002', event_type: 'normal_call', priority: 'low', timestamp: '2026-01-15T07:45:00', acknowledged_at: '2026-01-15T07:46:00', acknowledged_by: 'N001', resolved_at: '2026-01-15T07:55:00', notes: 'Permintaan ganti infus' },
  { id: 'CE005', device_id: 'D001', room_id: 'R001', event_type: 'normal_call', priority: 'medium', timestamp: '2026-01-15T07:30:00', acknowledged_at: '2026-01-15T07:31:00', acknowledged_by: 'N004', resolved_at: '2026-01-15T07:40:00', notes: 'Pasien minta posisi tidur diubah' },
  { id: 'CE006', device_id: 'D006', room_id: 'R005', event_type: 'emergency_call', priority: 'critical', timestamp: '2026-01-15T06:00:00', acknowledged_at: '2026-01-15T06:00:05', acknowledged_by: 'N002', resolved_at: '2026-01-15T06:30:00', notes: 'Desaturasi O2 - intervensi darurat' },
  { id: 'CE007', device_id: 'D003', room_id: 'R002', event_type: 'cancel_call', priority: 'low', timestamp: '2026-01-15T07:00:00', acknowledged_at: null, acknowledged_by: null, resolved_at: '2026-01-15T07:00:30', notes: 'Panggilan dibatalkan pasien' },
  { id: 'CE008', device_id: 'D001', room_id: 'R001', event_type: 'normal_call', priority: 'medium', timestamp: '2026-01-15T06:30:00', acknowledged_at: '2026-01-15T06:32:00', acknowledged_by: 'N005', resolved_at: '2026-01-15T06:45:00', notes: 'Pemeriksaan tanda vital pagi' },
];

export const callSessions: CallSession[] = [
  { id: 'CS001', call_event_id: 'CE001', room_id: 'R001', patient_name: 'Ahmad Sudirman', nurse_id: 'N001', start_time: '2026-01-15T08:15:00', response_time: '2026-01-15T08:15:30', end_time: '2026-01-15T08:25:00', duration_seconds: 600, status: 'resolved', call_type: 'Normal Call' },
  { id: 'CS002', call_event_id: 'CE002', room_id: 'R005', patient_name: 'Siti Rahayu', nurse_id: 'N002', start_time: '2026-01-15T08:20:00', response_time: '2026-01-15T08:20:10', end_time: null, duration_seconds: null, status: 'active', call_type: 'Emergency Call' },
  { id: 'CS003', call_event_id: 'CE003', room_id: 'R001', patient_name: 'Ahmad Sudirman', nurse_id: 'N003', start_time: '2026-01-15T08:22:00', response_time: '2026-01-15T08:22:45', end_time: '2026-01-15T08:30:00', duration_seconds: 480, status: 'resolved', call_type: 'Bathroom Call' },
  { id: 'CS004', call_event_id: 'CE004', room_id: 'R002', patient_name: 'Budi Santoso', nurse_id: 'N001', start_time: '2026-01-15T07:45:00', response_time: '2026-01-15T07:46:00', end_time: '2026-01-15T07:55:00', duration_seconds: 600, status: 'resolved', call_type: 'Normal Call' },
  { id: 'CS005', call_event_id: 'CE005', room_id: 'R001', patient_name: 'Ahmad Sudirman', nurse_id: 'N004', start_time: '2026-01-15T07:30:00', response_time: '2026-01-15T07:31:00', end_time: '2026-01-15T07:40:00', duration_seconds: 600, status: 'resolved', call_type: 'Normal Call' },
  { id: 'CS006', call_event_id: 'CE006', room_id: 'R005', patient_name: 'Siti Rahayu', nurse_id: 'N002', start_time: '2026-01-15T06:00:00', response_time: '2026-01-15T06:00:05', end_time: '2026-01-15T06:30:00', duration_seconds: 1800, status: 'resolved', call_type: 'Emergency Call' },
];

export const nurses: Nurse[] = [
  { id: 'N001', name: 'Nurse Dewi Kartika', nip: '198501012010012001', role: 'head_nurse', shift: 'pagi', floor: 1, phone: '081234567890', email: 'dewi@hospital.com', status: 'on_duty', avatar: '👩‍⚕️', created_at: '2024-01-01' },
  { id: 'N002', name: 'Nurse Rina Wulandari', nip: '199003152015022002', role: 'nurse', shift: 'pagi', floor: 2, phone: '081234567891', email: 'rina@hospital.com', status: 'on_duty', avatar: '👩‍⚕️', created_at: '2024-01-01' },
  { id: 'N003', name: 'Nurse Andi Prasetyo', nip: '199205202016011003', role: 'nurse', shift: 'pagi', floor: 1, phone: '081234567892', email: 'andi@hospital.com', status: 'on_duty', avatar: '👨‍⚕️', created_at: '2024-01-01' },
  { id: 'N004', name: 'Nurse Maya Sari', nip: '198807102012012004', role: 'nurse', shift: 'siang', floor: 1, phone: '081234567893', email: 'maya@hospital.com', status: 'off_duty', avatar: '👩‍⚕️', created_at: '2024-01-01' },
  { id: 'N005', name: 'Nurse Budi Hartono', nip: '199108252017011005', role: 'assistant_nurse', shift: 'malam', floor: 2, phone: '081234567894', email: 'budi.h@hospital.com', status: 'off_duty', avatar: '👨‍⚕️', created_at: '2024-01-01' },
  { id: 'N006', name: 'Nurse Lina Marlina', nip: '199306122018022006', role: 'nurse', shift: 'pagi', floor: 3, phone: '081234567895', email: 'lina@hospital.com', status: 'on_duty', avatar: '👩‍⚕️', created_at: '2024-01-01' },
];

export const nurseActions: NurseAction[] = [
  { id: 'NA001', nurse_id: 'N001', call_session_id: 'CS001', action_type: 'acknowledge', timestamp: '2026-01-15T08:15:30', notes: 'Panggilan diakui', duration_minutes: 0 },
  { id: 'NA002', nurse_id: 'N001', call_session_id: 'CS001', action_type: 'respond', timestamp: '2026-01-15T08:16:00', notes: 'Menuju kamar 101', duration_minutes: 1 },
  { id: 'NA003', nurse_id: 'N001', call_session_id: 'CS001', action_type: 'assist', timestamp: '2026-01-15T08:18:00', notes: 'Membantu pasien minum', duration_minutes: 7 },
  { id: 'NA004', nurse_id: 'N001', call_session_id: 'CS001', action_type: 'close', timestamp: '2026-01-15T08:25:00', notes: 'Sesi ditutup', duration_minutes: 0 },
  { id: 'NA005', nurse_id: 'N002', call_session_id: 'CS002', action_type: 'acknowledge', timestamp: '2026-01-15T08:20:10', notes: 'Emergency diakui - prioritas tinggi', duration_minutes: 0 },
  { id: 'NA006', nurse_id: 'N002', call_session_id: 'CS002', action_type: 'escalate', timestamp: '2026-01-15T08:21:00', notes: 'Memanggil dokter jaga', duration_minutes: 1 },
  { id: 'NA007', nurse_id: 'N003', call_session_id: 'CS003', action_type: 'respond', timestamp: '2026-01-15T08:23:00', notes: 'Membantu pasien ke kamar mandi', duration_minutes: 7 },
  { id: 'NA008', nurse_id: 'N002', call_session_id: 'CS006', action_type: 'medicate', timestamp: '2026-01-15T06:10:00', notes: 'Pemberian O2 tambahan', duration_minutes: 20 },
];

export const deviceLogs: DeviceLog[] = [
  { id: 'DL001', device_id: 'D001', event_type: 'heartbeat', timestamp: '2026-01-15T08:30:00', details: 'Heartbeat OK - latency 12ms', severity: 'info' },
  { id: 'DL002', device_id: 'D007', event_type: 'fault', timestamp: '2026-01-15T07:15:00', details: 'Koneksi terputus - timeout 30s', severity: 'error' },
  { id: 'DL003', device_id: 'D009', event_type: 'offline', timestamp: '2026-01-14T22:00:00', details: 'Perangkat tidak merespon', severity: 'warning' },
  { id: 'DL004', device_id: 'D005', event_type: 'firmware_update', timestamp: '2026-01-14T02:00:00', details: 'Update firmware v3.2.0 berhasil', severity: 'info' },
  { id: 'DL005', device_id: 'D006', event_type: 'heartbeat', timestamp: '2026-01-15T08:30:00', details: 'Heartbeat OK - latency 8ms', severity: 'info' },
  { id: 'DL006', device_id: 'D003', event_type: 'config_change', timestamp: '2026-01-14T10:00:00', details: 'Volume ringtone diubah ke 80%', severity: 'info' },
];

export const gatewayLogs: GatewayLog[] = [
  { id: 'GL001', source: 'mqtt', event_type: 'message_received', payload: '{"device":"D001","event":"call","type":"normal"}', timestamp: '2026-01-15T08:15:00', status: 'success', response_time_ms: 5 },
  { id: 'GL002', source: 'mqtt', event_type: 'message_sent', payload: '{"action":"acknowledge","device":"D001","nurse":"N001"}', timestamp: '2026-01-15T08:15:30', status: 'success', response_time_ms: 8 },
  { id: 'GL003', source: 'api', event_type: 'message_received', payload: '{"endpoint":"/api/v1/calls","method":"POST"}', timestamp: '2026-01-15T08:20:00', status: 'success', response_time_ms: 12 },
  { id: 'GL004', source: 'websocket', event_type: 'connection', payload: '{"client":"nurse_station_1","ip":"192.168.1.105"}', timestamp: '2026-01-15T08:00:00', status: 'success', response_time_ms: 3 },
  { id: 'GL005', source: 'mqtt', event_type: 'error', payload: '{"error":"connection_timeout","broker":"mqtt://192.168.1.1"}', timestamp: '2026-01-14T22:00:00', status: 'failed', response_time_ms: 30000 },
  { id: 'GL006', source: 'tcp', event_type: 'message_received', payload: '{"protocol":"commax_tcp","data":"0x4E433031"}', timestamp: '2026-01-15T08:22:00', status: 'success', response_time_ms: 2 },
];

// Statistics helper
export const getStatistics = () => {
  const totalCalls = callEvents.length;
  const emergencyCalls = callEvents.filter(e => e.event_type === 'emergency_call').length;
  const avgResponseTime = 25; // seconds
  const activeCalls = callSessions.filter(s => s.status === 'active').length;
  const resolvedToday = callSessions.filter(s => s.status === 'resolved').length;
  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const offlineDevices = devices.filter(d => d.status === 'offline').length;
  const faultDevices = devices.filter(d => d.status === 'fault').length;
  const activeNurses = nurses.filter(n => n.status === 'on_duty').length;

  return {
    totalCalls,
    emergencyCalls,
    avgResponseTime,
    activeCalls,
    resolvedToday,
    onlineDevices,
    offlineDevices,
    faultDevices,
    activeNurses,
    totalDevices: devices.length,
    totalRooms: rooms.length,
    totalNurses: nurses.length,
  };
};
