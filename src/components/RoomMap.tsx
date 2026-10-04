import { useState, useEffect } from 'react';
import { rooms, devices, callEvents, callSessions } from '../data/mockData';

interface LayoutElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  label?: string;
}

interface SavedLayout {
  id: string;
  name: string;
  roomType: string;
  elements: LayoutElement[];
  createdAt: string;
}

export default function RoomMap() {
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [savedLayouts, setSavedLayouts] = useState<SavedLayout[]>([]);
  const [selectedLayout, setSelectedLayout] = useState<string>('');
  const [roomList, setRoomList] = useState(rooms);

  // Load saved layouts from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('savedLayouts');
    if (savedData) {
      try {
        const parsedLayouts = JSON.parse(savedData);
        setSavedLayouts(parsedLayouts);
      } catch (error) {
        console.error('Error loading saved layouts:', error);
      }
    }
  }, [showAddRoomModal]); // Reload when modal opens

  const floorRooms = roomList.filter(r => r.floor === selectedFloor);
  const floors = [...new Set(roomList.map(r => r.floor))].sort();

  // Handle delete room
  const handleDeleteRoom = (roomId: string) => {
    console.log('Delete room clicked:', roomId);
    const room = roomList.find(r => r.id === roomId);
    if (!room) {
      console.error('Room not found:', roomId);
      return;
    }

    try {
      const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus Kamar ${room.room_number}?\n\nPerangkat dan event terkait juga akan dihapus.`);
      console.log('User confirmed:', confirmed);
      
      if (confirmed) {
        setRoomList(prev => {
          const newList = prev.filter(r => r.id !== roomId);
          console.log('Room deleted. New list length:', newList.length);
          return newList;
        });
        setSelectedRoom(null);
        console.log('Room deletion complete');
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Terjadi kesalahan saat menghapus kamar. Silakan coba lagi.');
    }
  };

  const getRoomStatus = (roomId: string) => {
    const activeCall = callSessions.find(s => s.room_id === roomId && s.status === 'active');
    if (activeCall) return 'active-call';
    const roomDevice = devices.filter(d => d.room_id === roomId);
    const hasFault = roomDevice.some(d => d.status === 'fault');
    if (hasFault) return 'fault';
    const room = roomList.find(r => r.id === roomId);
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

  // Render detailed room layout - Hospital Room Blueprint Style
  const renderRoomLayout = (room: any) => {
    const bedCount = room.bed_count;
    const hasBathroom = true;
    const isVIP = room.room_type === 'VIP';
    const isICU = room.room_type === 'ICU' || room.room_type === 'NICU';
    const isHCU = room.room_type === 'HCU';
    
    return (
      <div className="relative w-full h-full min-h-[180px] bg-white border-4 border-gray-700 overflow-hidden">
        {/* Room Number Label - Top Left */}
        <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs font-bold z-30 border-2 border-gray-700">
          {room.room_number}
        </div>

        {/* VIP/ICU Badge - Top Right */}
        {(isVIP || isICU || isHCU) && (
          <div className={`absolute top-2 right-2 px-2 py-1 rounded text-[9px] font-bold z-30 ${
            isVIP ? 'bg-purple-600 text-white' : 
            isICU ? 'bg-red-600 text-white' : 
            'bg-orange-600 text-white'
          }`}>
            {room.room_type}
          </div>
        )}

        {/* Bathroom - Top Right Corner */}
        {hasBathroom && (
          <div className={`absolute top-10 right-2 w-14 h-16 bg-blue-50 border-2 border-gray-600 flex flex-col items-center justify-center gap-0.5`}>
            <div className="text-[8px] font-bold text-gray-700">KM</div>
            {/* Toilet */}
            <div className="w-4 h-4 bg-white border border-gray-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
            </div>
            {/* Sink */}
            <div className="w-3 h-2 bg-white border border-gray-500 rounded-sm"></div>
          </div>
        )}

        {/* Beds Area */}
        <div className={`absolute top-12 left-3 ${hasBathroom ? 'right-18' : 'right-3'} grid gap-3 ${
          bedCount === 1 ? 'grid-cols-1' : 'grid-cols-2'
        }`}>
          {Array.from({ length: bedCount }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              {/* Bed Frame */}
              <div className={`w-full h-16 rounded border-3 ${
                isICU ? 'bg-blue-50 border-blue-600' :
                isVIP ? 'bg-purple-50 border-purple-600' :
                'bg-white border-gray-600'
              } relative shadow-md`}>
                {/* Mattress */}
                <div className="absolute inset-1 bg-white border border-gray-300 rounded-sm">
                  {/* Pillow */}
                  <div className="absolute top-1 left-1 right-1 h-3 bg-gray-100 border border-gray-300 rounded-sm"></div>
                  {/* Blanket */}
                  <div className="absolute bottom-1 left-1 right-1 h-4 bg-gray-50 border border-gray-200 rounded-sm"></div>
                </div>
                
                {/* IV Stand for ICU */}
                {isICU && (
                  <div className="absolute -top-1 -right-1 w-1 h-6 bg-gray-600">
                    <div className="absolute -top-1 left-0 w-1 h-1 bg-gray-700"></div>
                  </div>
                )}

                {/* Bed Label */}
                <div className="absolute bottom-0.5 right-0.5 bg-white px-1 rounded text-[8px] font-bold text-gray-700 border border-gray-400">
                  {String.fromCharCode(65 + i)}
                </div>
              </div>

              {/* Nightstand */}
              <div className="w-4 h-4 bg-amber-100 border border-gray-500 rounded-sm mt-1"></div>
            </div>
          ))}
        </div>

        {/* Window - Left Wall */}
        <div className="absolute top-1/2 left-0 w-1 h-12 bg-blue-300 border-t-2 border-b-2 border-blue-500 transform -translate-y-1/2"></div>

        {/* Door - Bottom Center */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          {/* Door Frame */}
          <div className="relative w-14">
            {/* Door Arc */}
            <div className="w-14 h-14 border-l-3 border-t-3 border-gray-700 rounded-tl-full opacity-40"></div>
            {/* Door Leaf */}
            <div className="absolute bottom-0 left-0 w-1 h-14 bg-gray-700"></div>
            {/* Door Handle */}
            <div className="absolute bottom-2 left-1 w-1 h-1 bg-gray-900 rounded-full"></div>
            {/* Threshold */}
            <div className="absolute bottom-0 left-0 w-14 h-1.5 bg-amber-700"></div>
          </div>
        </div>

        {/* Nurse Call Button - Near Bed */}
        <div className="absolute bottom-20 left-4 w-3 h-3 bg-red-500 border-2 border-red-700 rounded-full flex items-center justify-center">
          <div className="w-1 h-1 bg-white rounded-full"></div>
        </div>
      </div>
    );
  };

  const selectedRoomData = selectedRoom ? roomList.find(r => r.id === selectedRoom) : null;
  const selectedRoomDevices = selectedRoom ? devices.filter(d => d.room_id === selectedRoom) : [];
  const selectedRoomEvents = selectedRoom ? callEvents.filter(e => e.room_id === selectedRoom) : [];

  return (
    <div className="space-y-6">
      {/* Floor Selector */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-sm font-medium text-gray-700">Bangsal:</span>
        <select
          value={selectedFloor}
          onChange={(e) => { setSelectedFloor(Number(e.target.value)); setSelectedRoom(null); }}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {floors.map(floor => (
            <option key={floor} value={floor}>Bangsal {floor}</option>
          ))}
        </select>
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
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">
            Peta Kamar - Bangsal {selectedFloor}
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({floorRooms.length} kamar)
            </span>
          </h3>
          <button
            onClick={() => setIsFullScreen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm"
          >
            <i className="fas fa-expand mr-2"></i>Tampil
          </button>
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
                  className={`relative p-4 rounded-xl border-2 transition-all min-h-[180px] ${getRoomColor(status)} ${selectedRoom === room.id ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
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
                  className={`relative p-4 rounded-xl border-2 transition-all min-h-[180px] ${getRoomColor(status)} ${selectedRoom === room.id ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
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
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  console.log('Delete room button clicked');
                  handleDeleteRoom(selectedRoom);
                }}
                className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors cursor-pointer relative z-10"
                title="Hapus Kamar"
                style={{ pointerEvents: 'auto' }}
              >
                <i className="fas fa-trash mr-1"></i>Hapus
              </button>
              <button type="button" onClick={() => setSelectedRoom(null)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times"></i>
              </button>
            </div>
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
              {/* Pilih Denah Kamar dari Editor Denah */}
              {savedLayouts.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    <i className="fas fa-drafting-compass mr-1 text-indigo-600"></i>
                    Pilih Denah Kamar (dari Editor Denah)
                  </label>
                  <select 
                    value={selectedLayout}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedLayout(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Pilih Denah Kamar --</option>
                    {savedLayouts.map(layout => (
                      <option key={layout.id} value={layout.id}>
                        {layout.name} ({layout.roomType}) - {layout.elements.filter(el => el.type === 'bed').length} Bed
                      </option>
                    ))}
                  </select>
                  {selectedLayout && (
                    <div className="mt-2 p-2 bg-indigo-50 border border-indigo-200 rounded-lg">
                      <p className="text-xs text-indigo-700">
                        <i className="fas fa-info-circle mr-1"></i>
                        Denah kamar akan otomatis diterapkan saat menyimpan
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {savedLayouts.length === 0 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-700">
                    <i className="fas fa-exclamation-triangle mr-1"></i>
                    Belum ada denah kamar yang dibuat. Silakan buat denah di menu <strong>Editor Denah</strong> terlebih dahulu.
                  </p>
                </div>
              )}

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

      {/* Full Screen Modal */}
      {isFullScreen && (
        <div className="fixed inset-0 bg-white z-50 overflow-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b shadow-sm p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              Peta Kamar - Bangsal {selectedFloor}
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({floorRooms.length} kamar)
              </span>
            </h2>
            <button
              onClick={() => setIsFullScreen(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition shadow-sm"
            >
              <i className="fas fa-arrow-left mr-2"></i>Kembali
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Legend */}
            <div className="mb-6 flex gap-4 text-sm">
              <span className="flex items-center gap-2"><span className="w-4 h-4 bg-green-100 border border-green-300 rounded"></span> Normal</span>
              <span className="flex items-center gap-2"><span className="w-4 h-4 bg-red-100 border border-red-400 rounded"></span> Panggilan Aktif</span>
              <span className="flex items-center gap-2"><span className="w-4 h-4 bg-orange-100 border border-orange-400 rounded"></span> Fault</span>
              <span className="flex items-center gap-2"><span className="w-4 h-4 bg-yellow-100 border border-yellow-400 rounded"></span> Maintenance</span>
            </div>

            {/* Room Map */}
            <div className="relative">
              {/* Top rooms */}
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
                {floorRooms.filter((_, i) => i % 2 === 0).map(room => {
                  const status = getRoomStatus(room.id);
                  return (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoom(room.id)}
                      className={`relative p-5 rounded-xl border-2 transition-all min-h-[200px] ${getRoomColor(status)} ${selectedRoom === room.id ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
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
                          <div className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse flex items-center gap-1">
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
              <div className="h-12 bg-gray-100 border-y border-dashed border-gray-300 flex items-center justify-center mb-8">
                <span className="text-sm text-gray-400 tracking-widest uppercase">— Koridor —</span>
              </div>

              {/* Bottom rooms */}
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {floorRooms.filter((_, i) => i % 2 === 1).map(room => {
                  const status = getRoomStatus(room.id);
                  return (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoom(room.id)}
                      className={`relative p-5 rounded-xl border-2 transition-all min-h-[200px] ${getRoomColor(status)} ${selectedRoom === room.id ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
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
                          <div className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse flex items-center gap-1">
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
              <div className="mt-8 flex justify-center">
                <div className="px-8 py-4 bg-blue-100 border-2 border-blue-300 rounded-xl text-center">
                  <i className="fas fa-desktop text-blue-600 mr-2 text-lg"></i>
                  <span className="text-base font-medium text-blue-800">Nurse Station - Bangsal {selectedFloor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
