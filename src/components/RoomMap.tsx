import { useState, useEffect } from 'react';
import { rooms as initialRooms, devices, callEvents, callSessions } from '../data/mockData';

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

interface Room {
  id: string;
  room_number: string;
  floor: number;
  building: string;
  bed_count: number;
  room_type: string;
  status: string;
  layout_id?: string; // ID denah yang dipilih
}

export default function RoomMap() {
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [savedLayouts, setSavedLayouts] = useState<SavedLayout[]>([]);
  const [selectedLayout, setSelectedLayout] = useState<string>('');
  const [roomList, setRoomList] = useState<Room[]>(initialRooms);
  
  // State untuk form tambah kamar
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomFloor, setNewRoomFloor] = useState(selectedFloor);
  const [newRoomBuilding, setNewRoomBuilding] = useState('Gedung A');
  const [newRoomType, setNewRoomType] = useState('Reguler');
  const [newRoomBedCount, setNewRoomBedCount] = useState(1);

  // Fungsi untuk menyimpan kamar baru
  const handleSaveNewRoom = () => {
    if (!newRoomNumber.trim()) {
      alert('Nomor kamar harus diisi!');
      return;
    }

    const newRoom: Room = {
      id: `R${Date.now()}`,
      room_number: newRoomNumber,
      floor: newRoomFloor,
      building: newRoomBuilding,
      bed_count: newRoomBedCount,
      room_type: newRoomType,
      status: 'active',
      layout_id: selectedLayout || undefined
    };

    setRoomList([...roomList, newRoom]);
    
    // Reset form
    setNewRoomNumber('');
    setNewRoomFloor(selectedFloor);
    setNewRoomBuilding('Gedung A');
    setNewRoomType('Reguler');
    setNewRoomBedCount(1);
    setSelectedLayout('');
    
    // Tutup modal
    setShowAddRoomModal(false);
  };

  useEffect(() => {
    const savedData = localStorage.getItem('savedLayouts');
    if (savedData) {
      try {
        setSavedLayouts(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading layouts:', error);
      }
    }
  }, [showAddRoomModal]);

  const floorRooms = roomList.filter(r => r.floor === selectedFloor);
  const floors = [...new Set(roomList.map(r => r.floor))].sort();
  const selectedRoomData = selectedRoom ? roomList.find(r => r.id === selectedRoom) : null;

  const getRoomStatus = (roomId: string) => {
    const activeCall = callSessions.find(s => s.room_id === roomId && s.status === 'active');
    if (activeCall) return 'active-call';
    const hasFault = devices.filter(d => d.room_id === roomId).some(d => d.status === 'fault');
    if (hasFault) return 'fault';
    const room = roomList.find(r => r.id === roomId);
    if (room?.status === 'maintenance') return 'maintenance';
    if (room?.status === 'inactive') return 'inactive';
    return 'normal';
  };

  const getRoomColor = (status: string) => {
    switch (status) {
      case 'active-call': return 'bg-red-100 border-red-400';
      case 'fault': return 'bg-orange-100 border-orange-400';
      case 'maintenance': return 'bg-yellow-100 border-yellow-400';
      case 'inactive': return 'bg-gray-100 border-gray-300';
      default: return 'bg-green-50 border-green-300';
    }
  };

  const renderRoomLayout = (room: Room) => {
    // Jika kamar punya layout_id, tampilkan denah dari SavedLayout
    if (room.layout_id) {
      const layout = savedLayouts.find(l => l.id === room.layout_id);
      if (layout) {
        // Hitung scale untuk menyesuaikan denah dengan ukuran kamar
        const previewWidth = 200;
        const previewHeight = 180;
        const maxX = Math.max(...layout.elements.map(e => e.x + e.width));
        const maxY = Math.max(...layout.elements.map(e => e.y + e.height));
        const scaleX = (previewWidth - 20) / maxX;
        const scaleY = (previewHeight - 20) / maxY;
        const scale = Math.min(scaleX, scaleY, 0.5);

        return (
          <div className="relative w-full h-full min-h-[180px] bg-white border-4 border-gray-700 overflow-hidden">
            <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs font-bold border-2 border-gray-700 z-10">
              {room.room_number}
            </div>
            {/* Render elemen dari layout */}
            {layout.elements.map((element) => {
              const elementStyle = {
                position: 'absolute' as const,
                left: `${element.x * scale}px`,
                top: `${element.y * scale}px`,
                width: `${element.width * scale}px`,
                height: `${element.height * scale}px`,
              };

              switch (element.type) {
                case 'bed':
                  return (
                    <div key={element.id} style={elementStyle} className="bg-gradient-to-br from-pink-200 to-pink-300 border-2 border-gray-900 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🛏️</span>
                      {element.label && (
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 px-1 rounded text-[8px] font-bold">
                          {element.label}
                        </div>
                      )}
                    </div>
                  );
                case 'bathroom':
                  return (
                    <div key={element.id} style={elementStyle} className="bg-gradient-to-br from-blue-300 to-blue-400 border-2 border-gray-900 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🚿</span>
                    </div>
                  );
                case 'door':
                  return (
                    <div key={element.id} style={elementStyle} className="bg-gradient-to-br from-amber-400 to-amber-500 border-2 border-gray-900 rounded flex items-center justify-center">
                      <span className="text-sm">🚪</span>
                    </div>
                  );
                case 'window':
                  return (
                    <div key={element.id} style={elementStyle} className="bg-gradient-to-br from-cyan-300 to-cyan-400 border-2 border-gray-900 rounded flex items-center justify-center">
                      <span className="text-sm">🪟</span>
                    </div>
                  );
                case 'code_blue':
                  return (
                    <div key={element.id} style={elementStyle} className="bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-gray-900 rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-sm">🔵</span>
                    </div>
                  );
                case 'presence':
                  return (
                    <div key={element.id} style={elementStyle} className="bg-gradient-to-br from-green-400 to-green-600 border-2 border-gray-900 rounded-full flex items-center justify-center">
                      <span className="text-sm">👤</span>
                    </div>
                  );
                case 'monitor':
                  return (
                    <div key={element.id} style={elementStyle} className="bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-gray-900 rounded flex items-center justify-center">
                      <span className="text-sm">📺</span>
                    </div>
                  );
                case 'iv_stand':
                  return (
                    <div key={element.id} style={elementStyle} className="bg-gradient-to-br from-green-300 to-green-400 border-2 border-gray-900 rounded flex items-center justify-center">
                      <span className="text-sm">💉</span>
                    </div>
                  );
                case 'sofa':
                  return (
                    <div key={element.id} style={elementStyle} className="bg-gradient-to-br from-purple-300 to-purple-400 border-2 border-gray-900 rounded flex items-center justify-center">
                      <span className="text-sm">🛋️</span>
                    </div>
                  );
                case 'tv':
                  return (
                    <div key={element.id} style={elementStyle} className="bg-gradient-to-br from-gray-800 to-black border-2 border-gray-900 rounded flex items-center justify-center">
                      <span className="text-sm">📺</span>
                    </div>
                  );
                case 'wardrobe':
                  return (
                    <div key={element.id} style={elementStyle} className="bg-gradient-to-br from-amber-300 to-amber-400 border-2 border-gray-900 rounded flex items-center justify-center">
                      <span className="text-sm">🗄️</span>
                    </div>
                  );
                case 'room':
                  return (
                    <div key={element.id} style={elementStyle} className="border-2 border-dashed border-gray-400 bg-gray-50 opacity-30"></div>
                  );
                default:
                  return null;
              }
            })}
          </div>
        );
      }
    }

    // Default layout jika tidak ada layout_id
    return (
      <div className="relative w-full h-full min-h-[180px] bg-white border-4 border-gray-700 overflow-hidden">
        <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs font-bold border-2 border-gray-700">
          {room.room_number}
        </div>
        <div className="absolute top-10 right-2 w-14 h-16 bg-blue-50 border-2 border-gray-600 flex flex-col items-center justify-center">
          <div className="text-[8px] font-bold">KM</div>
          <div className="w-4 h-4 bg-white border border-gray-500 rounded-full"></div>
        </div>
        <div className="absolute top-12 left-3 right-20 grid gap-3 grid-cols-1">
          {Array.from({ length: room.bed_count }).map((_, i) => (
            <div key={i} className="h-16 bg-white border-2 border-gray-600 rounded relative">
              <div className="absolute top-1 left-1 right-1 h-3 bg-gray-100 rounded"></div>
              <div className="absolute bottom-0.5 right-0.5 bg-white px-1 rounded text-[8px] font-bold border">
                {String.fromCharCode(65 + i)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };





  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-sm font-medium text-gray-700">Bangsal:</span>
        <select
          value={selectedFloor}
          onChange={(e) => {
            setSelectedFloor(Number(e.target.value));
            setSelectedRoom(null);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
        >
          {floors.map(floor => (
            <option key={floor} value={floor}>Bangsal {floor}</option>
          ))}
        </select>
        <button
          onClick={() => setShowAddRoomModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
        >
          <i className="fas fa-plus mr-2"></i>Tambah Kamar
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          Peta Kamar - Bangsal {selectedFloor} ({floorRooms.length} kamar)
        </h3>

        {!selectedRoom && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            <strong>ℹ️ CARA HAPUS KAMAR:</strong><br/>
            1. Klik salah satu kamar untuk memilihnya<br/>
            2. Tombol "HAPUS KAMAR TERPILIH" akan muncul di atas<br/>
            3. Klik tombol tersebut atau tekan tombol <strong>DELETE</strong> di keyboard
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {floorRooms.map(room => {
            const status = getRoomStatus(room.id);
            const isSelected = selectedRoom === room.id;

            return (
              <div
                key={room.id}
                className={`relative rounded-xl border-2 min-h-[200px] ${getRoomColor(status)} ${
                  isSelected ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {/* Area untuk klik select room */}
                <div
                  onClick={() => setSelectedRoom(room.id)}
                  className="cursor-pointer p-4"
                >
                  {renderRoomLayout(room)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedRoom && selectedRoomData && (
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-gray-800">
              Detail Kamar {selectedRoomData.room_number}
            </h3>
            <a
              href="#delete"
              onClick={(e) => {
                e.preventDefault();
                setRoomList(roomList.filter(r => r.id !== selectedRoom));
                setSelectedRoom(null);
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ef4444',
                color: 'white',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                display: 'inline-block'
              }}
            >
              Hapus Kamar
            </a>
          </div>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p><strong>Tipe:</strong> {selectedRoomData.room_type}</p>
              <p><strong>Bed:</strong> {selectedRoomData.bed_count}</p>
              <p><strong>Gedung:</strong> {selectedRoomData.building}</p>
            </div>
            <div>
              <p><strong>Status:</strong> {selectedRoomData.status}</p>
              <p><strong>Lantai:</strong> {selectedRoomData.floor}</p>
              <p><strong>ID:</strong> {selectedRoomData.id}</p>
            </div>
          </div>
        </div>
      )}

      {showAddRoomModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Tambah Kamar Baru</h3>
            <div className="space-y-3">
              {savedLayouts.length > 0 && (
                <div>
                  <label className="text-sm font-medium">Pilih Denah Kamar</label>
                  <select
                    value={selectedLayout}
                    onChange={(e) => setSelectedLayout(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="">-- Pilih Denah --</option>
                    {savedLayouts.map(layout => (
                      <option key={layout.id} value={layout.id}>
                        {layout.name} ({layout.roomType})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Nomor Kamar</label>
                  <input 
                    type="text" 
                    value={newRoomNumber}
                    onChange={(e) => setNewRoomNumber(e.target.value)}
                    placeholder="401" 
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Bangsal</label>
                  <select 
                    value={newRoomFloor}
                    onChange={(e) => setNewRoomFloor(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  >
                    {floors.map(floor => (
                      <option key={floor} value={floor}>Bangsal {floor}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Gedung</label>
                  <select 
                    value={newRoomBuilding}
                    onChange={(e) => setNewRoomBuilding(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  >
                    <option>Gedung A</option>
                    <option>Gedung B</option>
                    <option>Gedung C</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Tipe Kamar</label>
                  <select 
                    value={newRoomType}
                    onChange={(e) => setNewRoomType(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  >
                    <option>Reguler</option>
                    <option>VIP</option>
                    <option>ICU</option>
                    <option>NICU</option>
                    <option>HCU</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Jumlah Bed</label>
                <input 
                  type="number" 
                  value={newRoomBedCount}
                  onChange={(e) => setNewRoomBedCount(Number(e.target.value))}
                  min={1}
                  max={4}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" 
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={() => {
                  setShowAddRoomModal(false);
                  setNewRoomNumber('');
                  setSelectedLayout('');
                }}
                className="px-4 py-2 border rounded-lg text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleSaveNewRoom}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
