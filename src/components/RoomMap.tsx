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

  // Fungsi render elemen yang sama persis dengan RoomLayoutEditor
  const renderElement = (element: LayoutElement, scale: number) => {
    const elementStyle = {
      position: 'absolute' as const,
      left: `${element.x * scale}px`,
      top: `${element.y * scale}px`,
      width: `${element.width * scale}px`,
      height: `${element.height * scale}px`,
      transform: `rotate(${element.rotation || 0}deg)`,
    };

    switch (element.type) {
      case 'room':
        return (
          <div key={element.id} style={{...elementStyle, backgroundColor: 'transparent', border: '3px solid #6b7280'}} className="relative">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap">
              Kamar ({element.width} x {element.height})
            </div>
          </div>
        );

      case 'bed':
        return (
          <div key={element.id} style={elementStyle} className="bg-white border-2 border-gray-700">
            <div className="absolute inset-0 border-2 border-gray-600 bg-gradient-to-br from-gray-100 to-white">
              <div className="absolute inset-0 border-2 border-gray-500"></div>
              <div className="absolute top-0 left-0 right-0 h-2 bg-gray-500"></div>
              <div className="absolute top-2 left-0 w-1 bottom-2 bg-gray-500"></div>
              <div className="absolute top-2 right-0 w-1 bottom-2 bg-gray-500"></div>
              <div className="absolute top-2 left-1 right-1 bottom-2 bg-blue-50 border border-blue-200 rounded-sm">
                <div className="absolute top-1 left-1 right-1 h-2 bg-white border border-gray-300 rounded-sm"></div>
                <div className="absolute top-4 left-0 right-0 bottom-0 bg-blue-100 border-t border-blue-300"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-500"></div>
              <div className="absolute bottom-[-2px] left-[15%] w-2 h-2 bg-gray-700 rounded-full"></div>
              <div className="absolute bottom-[-2px] right-[15%] w-2 h-2 bg-gray-700 rounded-full"></div>
            </div>
            {element.label && (
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-white px-1.5 py-0.5 rounded text-[9px] font-bold text-gray-800 border border-gray-400 shadow-sm z-10">
                {element.label}
              </div>
            )}
          </div>
        );

      case 'bathroom':
        return (
          <div key={element.id} style={elementStyle} className="bg-blue-50">
            <div className="absolute inset-0 border-2 border-gray-700 bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="absolute top-2 left-2 w-4 h-5 bg-white border-2 border-gray-600 rounded-full">
                <div className="absolute top-0.5 left-0.5 right-0.5 h-1.5 bg-blue-200 rounded-full"></div>
              </div>
              <div className="absolute top-2 right-2 w-3 h-3 bg-white border-2 border-gray-600 rounded-sm">
                <div className="absolute top-0.5 left-0.5 right-0.5 h-0.5 bg-blue-300 rounded-sm"></div>
              </div>
              <div className="absolute bottom-2 left-2 right-2 h-4 bg-blue-200 border border-blue-400 rounded-sm flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              </div>
              <div className="absolute bottom-1 right-1 text-[7px] font-bold text-blue-700">KM</div>
            </div>
          </div>
        );

      case 'door':
        return (
          <div key={element.id} style={{...elementStyle, border: 'none'}}>
            <div className="absolute inset-0 border-4 border-amber-950 bg-amber-100 rounded-sm shadow-lg">
              <div className="absolute inset-1 border-2 border-amber-800 bg-gradient-to-br from-amber-50 to-amber-100">
                <div className="absolute inset-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-sm">
                  <div 
                    className="absolute top-1 bottom-1 left-1 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 border-2 border-amber-700 rounded-sm"
                    style={{ width: '55%', transform: 'skewY(-5deg)', transformOrigin: 'left center' }}
                  >
                    <div className="absolute top-1 left-1 right-1 h-[35%] border border-amber-600 rounded-sm bg-amber-300 opacity-60"></div>
                    <div className="absolute bottom-1 left-1 right-1 h-[35%] border border-amber-600 rounded-sm bg-amber-300 opacity-60"></div>
                    <div className="absolute top-[45%] right-1 w-1.5 h-2.5 bg-gray-800 rounded-full shadow"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'window':
        return (
          <div key={element.id} style={elementStyle} className="bg-gradient-to-br from-blue-100 to-blue-200">
            <div className="absolute inset-0 border-2 border-gray-700">
              <div className="absolute inset-0.5 grid grid-cols-2 gap-0.5">
                <div className="bg-blue-200 border border-blue-400"></div>
                <div className="bg-blue-200 border border-blue-400"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600"></div>
            </div>
          </div>
        );

      case 'code_blue':
        return (
          <div key={element.id} style={{...elementStyle, borderRadius: '50%'}} className="bg-blue-500">
            <div className="absolute inset-0 rounded-full border-4 border-blue-800 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 flex items-center justify-center shadow-2xl animate-pulse">
              <div className="w-4 h-4 bg-white rounded-full shadow-inner"></div>
            </div>
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-[9px] font-bold text-blue-800 whitespace-nowrap bg-white px-1 rounded">CODE BLUE</div>
          </div>
        );

      case 'presence':
        return (
          <div key={element.id} style={{...elementStyle, borderRadius: '50%'}} className="bg-green-500">
            <div className="absolute inset-0 rounded-full border-4 border-green-800 bg-gradient-to-br from-green-400 via-green-500 to-green-700 flex items-center justify-center shadow-2xl">
              <div className="w-4 h-4 bg-white rounded-full shadow-inner"></div>
            </div>
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-[9px] font-bold text-green-800 whitespace-nowrap bg-white px-1 rounded">PRESENCE</div>
          </div>
        );

      case 'monitor':
        return (
          <div key={element.id} style={elementStyle} className="bg-gray-900">
            <div className="absolute inset-0.5 bg-black border border-gray-600 rounded-sm overflow-hidden">
              <div className="absolute inset-0 bg-black rounded-sm">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                  <path d="M0,25 L20,25 L25,10 L30,40 L35,25 L100,25" stroke="#00ff00" strokeWidth="1" fill="none"/>
                </svg>
                <div className="absolute top-0.5 right-0.5 text-[6px] text-green-400 font-bold">88</div>
                <div className="absolute bottom-0.5 left-0.5 text-[6px] text-cyan-400 font-bold">98%</div>
              </div>
            </div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-gray-700"></div>
          </div>
        );

      case 'iv_stand':
        return (
          <div key={element.id} style={elementStyle} className="bg-transparent">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-700"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-0.5 bg-gray-700 rounded-full"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-3 bg-gradient-to-b from-blue-200 to-blue-400 border border-blue-500 rounded-t-sm">
              <div className="absolute top-0.5 left-0.5 right-0.5 h-0.5 bg-blue-300"></div>
            </div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-1 bg-gray-700"></div>
          </div>
        );

      case 'sofa':
        return (
          <div key={element.id} style={elementStyle} className="bg-gradient-to-br from-purple-100 to-purple-200">
            <div className="absolute top-0 left-0 right-0 h-[30%] bg-gradient-to-b from-purple-400 to-purple-500 border-2 border-purple-700 rounded-t-sm"></div>
            <div className="absolute top-[30%] left-0 right-0 bottom-0 bg-gradient-to-b from-purple-200 to-purple-300 border-2 border-purple-600 rounded-b-sm">
              <div className="absolute inset-1 grid grid-cols-2 gap-0.5">
                <div className="bg-purple-100 border border-purple-400 rounded-sm"></div>
                <div className="bg-purple-100 border border-purple-400 rounded-sm"></div>
              </div>
            </div>
          </div>
        );

      case 'tv':
        return (
          <div key={element.id} style={elementStyle} className="bg-black">
            <div className="absolute inset-0.5 bg-black border border-gray-700 rounded-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-900/10 to-transparent"></div>
              </div>
              <div className="absolute bottom-0.5 right-0.5 text-[6px] text-gray-400">TV</div>
            </div>
          </div>
        );

      case 'wardrobe':
        return (
          <div key={element.id} style={elementStyle} className="bg-gradient-to-br from-amber-100 to-amber-200">
            <div className="absolute inset-0 border-2 border-amber-800 rounded-sm grid grid-cols-2 gap-px p-0.5">
              <div className="bg-amber-50 border border-amber-600 rounded-sm relative">
                <div className="absolute top-1/2 right-0.5 w-0.5 h-2 bg-amber-900 transform -translate-y-1/2"></div>
              </div>
              <div className="bg-amber-50 border border-amber-600 rounded-sm relative">
                <div className="absolute top-1/2 left-0.5 w-0.5 h-2 bg-amber-900 transform -translate-y-1/2"></div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderRoomLayout = (room: Room) => {
    // Jika kamar punya layout_id, tampilkan denah dari SavedLayout
    if (room.layout_id) {
      const layout = savedLayouts.find(l => l.id === room.layout_id);
      if (layout) {
        // Hitung ukuran asli denah dari layout
        const layoutWidth = Math.max(...layout.elements.map(e => e.x + e.width));
        const layoutHeight = Math.max(...layout.elements.map(e => e.y + e.height));
        
        // Ukuran target container (kartu kamar di peta)
        const targetWidth = 280; // px - ukuran kartu kamar
        const targetHeight = 200; // px - ukuran kartu kamar
        
        // Hitung scale agar denah mengisi PENUH container, lalu dikali 2
        const scaleX = targetWidth / layoutWidth;
        const scaleY = targetHeight / layoutHeight;
        const scale = Math.min(scaleX, scaleY) * 2; // 2x lebih besar
        
        return (
          <div className="relative w-full h-full min-h-[200px] bg-white border-4 border-gray-700 overflow-hidden">
            <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs font-bold border-2 border-gray-700 z-20">
              {room.room_number}
            </div>
            {/* Wrapper yang akan di-scale untuk mengisi container */}
            <div className="absolute inset-0 flex items-center justify-start">
              {/* Container dengan ukuran asli denah, di-scale 2x lebih besar dan diposisikan ke kiri */}
              <div 
                style={{
                  width: `${layoutWidth}px`,
                  height: `${layoutHeight}px`,
                  position: 'relative',
                  transform: `translate(0%, -50%) scale(${scale})`,
                  transformOrigin: 'left center',
                  left: '0',
                  top: '50%'
                }}
              >
                {/* Render elemen dengan scale = 1 (ukuran asli) */}
                {layout.elements.map((element) => renderElement(element, 1))}
              </div>
            </div>
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

        {/* Layout dengan koridor di tengah */}
        <div className="flex gap-4">
          {/* Kamar-kamar di kiri koridor */}
          <div className="flex-1 grid grid-cols-1 gap-4">
            {floorRooms.filter((_, i) => i % 2 === 0).map(room => {
              const status = getRoomStatus(room.id);
              const isSelected = selectedRoom === room.id;

              return (
                <div
                  key={room.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('roomId', room.id);
                  }}
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

          {/* Koridor di tengah */}
          <div className="w-24 bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center relative">
            <div className="text-gray-500 font-bold text-sm transform -rotate-90 whitespace-nowrap">
              KORIDOR
            </div>
          </div>

          {/* Kamar-kamar di kanan koridor */}
          <div className="flex-1 grid grid-cols-1 gap-4">
            {floorRooms.filter((_, i) => i % 2 === 1).map(room => {
              const status = getRoomStatus(room.id);
              const isSelected = selectedRoom === room.id;

              return (
                <div
                  key={room.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('roomId', room.id);
                  }}
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
