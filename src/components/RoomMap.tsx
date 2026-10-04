import { useState } from 'react';
import { rooms } from '../data/mockData';

export default function RoomMap() {
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const floorRooms = rooms.filter(r => r.floor === selectedFloor);
  const floors = [...new Set(rooms.map(r => r.floor))].sort();
  const selectedRoomData = selectedRoom ? rooms.find(r => r.id === selectedRoom) : null;

  const getRoomStatus = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room?.status === 'maintenance') return 'maintenance';
    if (room?.status === 'inactive') return 'inactive';
    return 'normal';
  };

  const getRoomColor = (status: string) => {
    switch (status) {
      case 'maintenance': return 'bg-yellow-100 border-yellow-400';
      case 'inactive': return 'bg-gray-100 border-gray-300';
      default: return 'bg-green-50 border-green-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
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
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          Peta Kamar - Bangsal {selectedFloor} ({floorRooms.length} kamar)
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {floorRooms.map(room => {
            const status = getRoomStatus(room.id);
            const isSelected = selectedRoom === room.id;

            return (
              <div
                key={room.id}
                onClick={() => setSelectedRoom(room.id)}
                className={`relative rounded-xl border-2 min-h-[150px] p-4 cursor-pointer ${getRoomColor(status)} ${
                  isSelected ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 mb-2">
                    {room.room_number}
                  </div>
                  <div className="text-sm text-gray-600">
                    {room.room_type}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {room.bed_count} Bed
                  </div>
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
            <button
              onClick={() => setSelectedRoom(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-times"></i>
            </button>
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
    </div>
  );
}
