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

export default function RoomMap() {
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [savedLayouts, setSavedLayouts] = useState<SavedLayout[]>([]);
  const [selectedLayout, setSelectedLayout] = useState<string>('');
  const [roomList, setRoomList] = useState(initialRooms);

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

  const renderRoomLayout = (room: any) => {
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

  // FUNGSI HAPUS KAMAR - LANGSUNG DAN SEDERHANA
  const handleDeleteRoom = (roomId: string, roomNumber: string) => {
    const confirmed = window.confirm(`Hapus Kamar ${roomNumber}?`);
    if (confirmed) {
      setRoomList(roomList.filter(r => r.id !== roomId));
      if (selectedRoom === roomId) {
        setSelectedRoom(null);
      }
    }
  };

  // Keyboard shortcut untuk hapus
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedRoom) {
        const room = roomList.find(r => r.id === selectedRoom);
        if (room && window.confirm('Hapus Kamar ' + room.room_number + '?')) {
          setRoomList(roomList.filter(r => r.id !== selectedRoom));
          setSelectedRoom(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedRoom, roomList]);

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

      {/* TOMBOL HAPUS RAKSASA DI TENGAH LAYAR */}
      {selectedRoom && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 999999
        }}>
          <button
            onClick={() => {
              const room = roomList.find(r => r.id === selectedRoom);
              if (room && window.confirm('HAPUS ' + room.room_number + '?')) {
                setRoomList(roomList.filter(r => r.id !== selectedRoom));
                setSelectedRoom(null);
              }
            }}
            style={{
              width: '300px',
              height: '100px',
              backgroundColor: '#dc2626',
              color: 'white',
              borderRadius: '20px',
              border: '5px solid white',
              cursor: 'pointer',
              fontSize: '32px',
              fontWeight: 'bold',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}
          >
            🗑️ HAPUS
          </button>
        </div>
      )}

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
                {/* Area untuk klik select room - TIDAK menutupi tombol hapus */}
                <div
                  onClick={() => setSelectedRoom(room.id)}
                  className="cursor-pointer p-4 pb-16"
                >
                  {renderRoomLayout(room)}
                </div>

                {/* TOMBOL HAPUS - INLINE LANGSUNG */}
                <button
                  onClick={() => {
                    if (window.confirm('Hapus Kamar ' + room.room_number + '?')) {
                      setRoomList(roomList.filter(r => r.id !== room.id));
                      if (selectedRoom === room.id) setSelectedRoom(null);
                    }
                  }}
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    borderRadius: '50%',
                    border: '4px solid white',
                    cursor: 'pointer',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 15px rgba(0,0,0,0.3)'
                  }}
                  title={'Hapus Kamar ' + room.room_number}
                >
                  🗑️
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {selectedRoom && selectedRoomData && (
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="font-semibold text-gray-800 mb-4">
            Detail Kamar {selectedRoomData.room_number}
          </h3>
          <div className="grid grid-cols-3 gap-6 text-sm">
            <div>
              <p><strong>Tipe:</strong> {selectedRoomData.room_type}</p>
              <p><strong>Bed:</strong> {selectedRoomData.bed_count}</p>
            </div>
            <div>
              <p><strong>Gedung:</strong> {selectedRoomData.building}</p>
              <p><strong>Status:</strong> {selectedRoomData.status}</p>
            </div>
            <div>
              <button
                onClick={() => {
                  if (window.confirm('Hapus Kamar ' + selectedRoomData.room_number + '?')) {
                    setRoomList(roomList.filter(r => r.id !== selectedRoom));
                    setSelectedRoom(null);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                🗑️ Hapus Kamar Ini
              </button>
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
                  <input type="text" placeholder="401" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium">Bangsal</label>
                  <select defaultValue={selectedFloor} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm">
                    {floors.map(floor => (
                      <option key={floor} value={floor}>Bangsal {floor}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={() => setShowAddRoomModal(false)}
                className="px-4 py-2 border rounded-lg text-sm"
              >
                Batal
              </button>
              <button
                onClick={() => setShowAddRoomModal(false)}
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
