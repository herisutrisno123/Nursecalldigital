import { useState } from 'react';
import { rooms, devices, callEvents, callSessions } from '../data/mockData';

export default function RoomMap() {
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);

  const floorRooms = rooms.filter(r => r.floor === selectedFloor);
  const floors = [...new Set(rooms.map(r => r.floor))].sort();

  const getRoomStatus = (roomId: string) => {
    const activeCall = callSessions.find(s => s.room_id === roomId && s.status === 'active');
    if (activeCall) return 'active-call';
    const roomDevice = devices.filter(d => d.room_id === roomId);
    const hasFault = roomDevice.some(d => d.status === 'fault');
    if (hasFault) return 'fault';
    const room = rooms.find(r => r.id === roomId);
    if (room?.status === 'maintenance') return 'maintenance';
    if (room?.status === 'inactive') return 'inactive';
    return 'normal';
  };

  const getRoomColor = (status: string) => {
    switch (status) {
      case 'active-call': return 'bg-red-100 border-red-400 text-red-800 hover:bg-red-200';
      case 'fault': return 'bg-orange-100 border-orange-400 text-orange-800 hover:bg-orange-200';
      case 'maintenance': return 'bg-yellow-100 border-yellow-400 text-yellow-800 hover:bg-yellow-200';
      case 'inactive': return 'bg-gray-100 border-gray-300 text-gray-500';
      default: return 'bg-green-50 border-green-300 text-green-800 hover:bg-green-100';
    }
  };

  const getRoomIcon = (status: string) => {
    switch (status) {
      case 'active-call': return 'fa-phone-volume text-red-500';
      case 'fault': return 'fa-exclamation-triangle text-orange-500';
      case 'maintenance': return 'fa-wrench text-yellow-500';
      case 'inactive': return 'fa-power-off text-gray-400';
      default: return 'fa-check-circle text-green-500';
    }
  };

  // Render detailed room layout
  const renderRoomLayout = (room: any) => {
    const bedCount = room.bed_count;
    const hasBathroom = true; // All rooms have bathroom
    const isVIP = room.room_type === 'VIP';
    const isICU = room.room_type === 'ICU' || room.room_type === 'NICU';
    
    return (
      <div className="relative w-full h-full min-h-[120px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-300 overflow-hidden">
        {/* Room Number Label */}
        <div className="absolute top-1 left-1 bg-white px-2 py-0.5 rounded text-xs font-bold shadow-sm z-10">
          {room.room_number}
        </div>

        {/* Architectural Door Design */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          {/* Door frame */}
          <div className="relative w-10 h-1">
            {/* Door leaf (swinging arc) */}
            <div className="absolute bottom-0 left-0 w-10 h-10 border-l-2 border-t-2 border-gray-600 rounded-tl-full opacity-60"></div>
            {/* Door line */}
            <div className="absolute bottom-0 left-0 w-0.5 h-10 bg-gray-600"></div>
          </div>
        </div>

        {/* Beds */}
        <div className={`absolute top-6 left-2 right-2 grid gap-1 ${
          bedCount === 1 ? 'grid-cols-1' : 'grid-cols-2'
        }`}>
          {Array.from({ length: bedCount }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              {/* Bed */}
              <div className={`w-full h-12 rounded border-2 ${
                isICU ? 'bg-blue-100 border-blue-400' :
                isVIP ? 'bg-purple-100 border-purple-400' :
                'bg-white border-gray-400'
              } flex items-center justify-center relative`}>
                {/* Pillow */}
                <div className="absolute top-1 left-1 right-1 h-2 bg-gray-200 rounded"></div>
                {/* Bed icon */}
                <i className={`fas fa-bed text-xs ${
                  isICU ? 'text-blue-600' :
                  isVIP ? 'text-purple-600' :
                  'text-gray-600'
                }`}></i>
                {/* Bed number */}
                <span className="absolute bottom-0.5 right-1 text-[8px] font-bold text-gray-500">
                  {String.fromCharCode(65 + i)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bathroom */}
        {hasBathroom && (
          <div className="absolute bottom-3 right-1 w-10 h-10 bg-blue-50 border-2 border-blue-300 rounded flex items-center justify-center">
            <i className="fas fa-bath text-blue-500 text-xs"></i>
          </div>
        )}

        {/* VIP/ICU Badge */}
        {(isVIP || isICU) && (
          <div className={`absolute top-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-bold ${
            isVIP ? 'bg-purple-500 text-white' : 'bg-blue-500 text-white'
          }`}>
            {room.room_type}
          </div>
        )}
      </div>
    );
  };

  const selectedRoomData = selectedRoom ? rooms.find(r => r.id === selectedRoom) : null;
  const selectedRoomDevices = selectedRoom ? devices.filter(d => d.room_id === selectedRoom) : [];
  const selectedRoomEvents = selectedRoom ? callEvents.filter(e => e.room_id === selectedRoom) : [];

  return (
    <div className="space-y-6">
      {/* Floor Selector */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-sm font-medium text-gray-700">Bangsal:</span>
        <div className="flex gap-2">
          {floors.map(floor => (
            <button
              key={floor}
              onClick={() => { setSelectedFloor(floor); setSelectedRoom(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedFloor === floor ? 'bg-blue-600 text-white shadow' : 'bg-white text-gray-600 border hover:bg-gray-50'
              }`}
            >
              Bangsal {floor}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAddRoomModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition shadow-sm"
        >
          <i className="fas fa-plus mr-2"></i>Tambah Kamar
        </button>
        <div className="ml-auto flex gap-3 text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-100 border border-green-300 rounded"></span> Normal</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-100 border border-red-400 rounded"></span> Panggilan Aktif</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-100 border border-orange-400 rounded"></span> Fault</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-100 border border-yellow-400 rounded"></span> Maintenance</span>
        </div>
      </div>

      {/* Room Map Grid */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800">
            Peta Kamar - Bangsal {selectedFloor}
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({floorRooms.length} kamar)
            </span>
          </h3>
        </div>

        {/* Corridor representation */}
        <div className="relative">
          {/* Top rooms */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {floorRooms.filter((_, i) => i % 2 === 0).map(room => {
              const status = getRoomStatus(room.id);
              return (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room.id)}
                  className={`relative p-2 rounded-xl border-2 transition-all ${getRoomColor(status)} ${selectedRoom === room.id ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
                >
                  {/* Status indicator */}
                  <div className="absolute top-2 right-2 z-10">
                    <i className={`fas ${getRoomIcon(status)}`}></i>
                  </div>
                  
                  {/* Room layout */}
                  {renderRoomLayout(room)}
                  
                  {/* Active call overlay */}
                  {status === 'active-call' && (
                    <div className="absolute inset-0 bg-red-500/10 rounded-xl flex items-center justify-center">
                      <div className="bg-red-600 text-white px-2 py-1 rounded-full text-[10px] font-bold animate-pulse flex items-center gap-1">
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                        PANGGILAN AKTIF
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Corridor */}
          <div className="h-8 bg-gray-100 border-y border-dashed border-gray-300 flex items-center justify-center mb-6">
            <span className="text-xs text-gray-400 tracking-widest uppercase">— Koridor —</span>
          </div>

          {/* Bottom rooms */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {floorRooms.filter((_, i) => i % 2 === 1).map(room => {
              const status = getRoomStatus(room.id);
              return (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room.id)}
                  className={`relative p-2 rounded-xl border-2 transition-all ${getRoomColor(status)} ${selectedRoom === room.id ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
                >
                  {/* Status indicator */}
                  <div className="absolute top-2 right-2 z-10">
                    <i className={`fas ${getRoomIcon(status)}`}></i>
                  </div>
                  
                  {/* Room layout */}
                  {renderRoomLayout(room)}
                  
                  {/* Active call overlay */}
                  {status === 'active-call' && (
                    <div className="absolute inset-0 bg-red-500/10 rounded-xl flex items-center justify-center">
                      <div className="bg-red-600 text-white px-2 py-1 rounded-full text-[10px] font-bold animate-pulse flex items-center gap-1">
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                        PANGGILAN AKTIF
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Nurse Station */}
          <div className="mt-6 flex justify-center">
            <div className="px-6 py-3 bg-blue-100 border-2 border-blue-300 rounded-xl text-center">
              <i className="fas fa-desktop text-blue-600 mr-2"></i>
              <span className="text-sm font-medium text-blue-800">Nurse Station - Bangsal {selectedFloor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Room Detail Panel */}
      {selectedRoom && selectedRoomData && (
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">
              Detail Kamar {selectedRoomData.room_number}
            </h3>
            <button onClick={() => setSelectedRoom(null)} className="text-gray-400 hover:text-gray-600">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Room Info */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Informasi Kamar</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tipe:</span>
                  <span className="font-medium">{selectedRoomData.room_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Jumlah Bed:</span>
                  <span className="font-medium">{selectedRoomData.bed_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Gedung:</span>
                  <span className="font-medium">{selectedRoomData.building}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className={`font-medium ${selectedRoomData.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
                    {selectedRoomData.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Devices */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Perangkat ({selectedRoomDevices.length})</h4>
              <div className="space-y-2">
                {selectedRoomDevices.map(device => (
                  <div key={device.id} className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded">
                    <span className={`w-2 h-2 rounded-full ${
                      device.status === 'online' ? 'bg-green-500' :
                      device.status === 'fault' ? 'bg-red-500' : 'bg-gray-400'
                    }`}></span>
                    <span className="text-gray-700 text-xs">{device.device_name}</span>
                    <span className="ml-auto text-[10px] text-gray-500">{device.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Events */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Event Terbaru</h4>
              <div className="space-y-2">
                {selectedRoomEvents.slice(0, 5).map(event => (
                  <div key={event.id} className="text-xs p-2 bg-gray-50 rounded">
                    <div className="flex justify-between">
                      <span className="text-gray-700">{event.event_type.replace('_', ' ')}</span>
                      <span className="text-gray-500">
                        {new Date(event.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-gray-500 mt-0.5">{event.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Room Modal */}
      {showAddRoomModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-plus text-green-600"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Tambah Kamar Baru</h3>
                </div>
                <button 
                  onClick={() => setShowAddRoomModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nomor Kamar</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: 401"
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Bangsal</label>
                  <select 
                    defaultValue={selectedFloor}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    {floors.map(floor => (
                      <option key={floor} value={floor}>Bangsal {floor}</option>
                    ))}
                    <option value={4}>Bangsal 4</option>
                    <option value={5}>Bangsal 5</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Gedung</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    <option>Gedung A</option>
                    <option>Gedung B</option>
                    <option>Gedung C</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Tipe Kamar</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    <option>Reguler</option>
                    <option>VIP</option>
                    <option>ICU</option>
                    <option>NICU</option>
                    <option>HCU</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Jumlah Bed</label>
                  <input 
                    type="number" 
                    min={1}
                    max={4}
                    defaultValue={1}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
                <i className="fas fa-info-circle mr-1"></i>
                Setelah kamar ditambahkan, Anda dapat mengkonfigurasi perangkat Commax untuk kamar ini di menu Status Perangkat.
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex gap-3 justify-end flex-shrink-0">
              <button 
                onClick={() => setShowAddRoomModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100"
              >
                Batal
              </button>
              <button 
                onClick={() => setShowAddRoomModal(false)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2"
              >
                <i className="fas fa-save"></i>
                Simpan Kamar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
