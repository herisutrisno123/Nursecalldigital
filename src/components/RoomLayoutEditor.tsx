import { useState } from 'react';

// Types
interface LayoutElement {
  id: string;
  type: 'bed' | 'bathroom' | 'door' | 'window' | 'nurse_call' | 'iv_stand' | 'monitor' | 'sofa' | 'tv' | 'wardrobe';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  label?: string;
}

interface RoomLayout {
  id: string;
  name: string;
  roomType: string;
  elements: LayoutElement[];
  isPreset?: boolean;
  createdAt: string;
}

// Preset Layouts
const presetLayouts: RoomLayout[] = [
  {
    id: 'preset-reguler-1',
    name: 'Reguler 1 Bed',
    roomType: 'Reguler',
    isPreset: true,
    createdAt: '2026-01-01',
    elements: [
      { id: 'bed-1', type: 'bed', x: 20, y: 40, width: 60, height: 100, label: 'A' },
      { id: 'bathroom-1', type: 'bathroom', x: 200, y: 20, width: 80, height: 80 },
      { id: 'door-1', type: 'door', x: 140, y: 280, width: 60, height: 20 },
      { id: 'window-1', type: 'window', x: 0, y: 100, width: 10, height: 60 },
      { id: 'nurse-call-1', type: 'nurse_call', x: 90, y: 30, width: 15, height: 15 },
    ]
  },
  {
    id: 'preset-reguler-2',
    name: 'Reguler 2 Bed',
    roomType: 'Reguler',
    isPreset: true,
    createdAt: '2026-01-01',
    elements: [
      { id: 'bed-1', type: 'bed', x: 20, y: 40, width: 60, height: 100, label: 'A' },
      { id: 'bed-2', type: 'bed', x: 100, y: 40, width: 60, height: 100, label: 'B' },
      { id: 'bathroom-1', type: 'bathroom', x: 200, y: 20, width: 80, height: 80 },
      { id: 'door-1', type: 'door', x: 140, y: 280, width: 60, height: 20 },
      { id: 'window-1', type: 'window', x: 0, y: 100, width: 10, height: 60 },
      { id: 'nurse-call-1', type: 'nurse_call', x: 50, y: 30, width: 15, height: 15 },
      { id: 'nurse-call-2', type: 'nurse_call', x: 130, y: 30, width: 15, height: 15 },
    ]
  },
  {
    id: 'preset-icu',
    name: 'ICU 1 Bed',
    roomType: 'ICU',
    isPreset: true,
    createdAt: '2026-01-01',
    elements: [
      { id: 'bed-1', type: 'bed', x: 60, y: 60, width: 80, height: 120, label: 'A' },
      { id: 'iv-stand-1', type: 'iv_stand', x: 150, y: 50, width: 10, height: 40 },
      { id: 'monitor-1', type: 'monitor', x: 180, y: 80, width: 40, height: 50 },
      { id: 'bathroom-1', type: 'bathroom', x: 200, y: 200, width: 80, height: 80 },
      { id: 'door-1', type: 'door', x: 140, y: 280, width: 60, height: 20 },
      { id: 'window-1', type: 'window', x: 0, y: 80, width: 10, height: 80 },
      { id: 'nurse-call-1', type: 'nurse_call', x: 100, y: 40, width: 15, height: 15 },
    ]
  },
  {
    id: 'preset-vip',
    name: 'VIP Suite',
    roomType: 'VIP',
    isPreset: true,
    createdAt: '2026-01-01',
    elements: [
      { id: 'bed-1', type: 'bed', x: 40, y: 60, width: 90, height: 130, label: 'A' },
      { id: 'sofa-1', type: 'sofa', x: 180, y: 40, width: 80, height: 40 },
      { id: 'tv-1', type: 'tv', x: 200, y: 10, width: 50, height: 10 },
      { id: 'bathroom-1', type: 'bathroom', x: 200, y: 200, width: 80, height: 80 },
      { id: 'door-1', type: 'door', x: 140, y: 280, width: 60, height: 20 },
      { id: 'window-1', type: 'window', x: 0, y: 80, width: 10, height: 100 },
      { id: 'wardrobe-1', type: 'wardrobe', x: 200, y: 120, width: 30, height: 60 },
      { id: 'nurse-call-1', type: 'nurse_call', x: 80, y: 40, width: 15, height: 15 },
    ]
  },
  {
    id: 'preset-hcu',
    name: 'HCU 1 Bed',
    roomType: 'HCU',
    isPreset: true,
    createdAt: '2026-01-01',
    elements: [
      { id: 'bed-1', type: 'bed', x: 80, y: 80, width: 80, height: 120, label: 'A' },
      { id: 'monitor-1', type: 'monitor', x: 180, y: 100, width: 40, height: 50 },
      { id: 'iv-stand-1', type: 'iv_stand', x: 170, y: 70, width: 10, height: 40 },
      { id: 'door-1', type: 'door', x: 140, y: 280, width: 60, height: 20 },
      { id: 'window-1', type: 'window', x: 0, y: 100, width: 10, height: 80 },
      { id: 'nurse-call-1', type: 'nurse_call', x: 120, y: 60, width: 15, height: 15 },
    ]
  },
  {
    id: 'preset-nicu',
    name: 'NICU Incubator',
    roomType: 'NICU',
    isPreset: true,
    createdAt: '2026-01-01',
    elements: [
      { id: 'bed-1', type: 'bed', x: 80, y: 80, width: 70, height: 90, label: 'A' },
      { id: 'monitor-1', type: 'monitor', x: 170, y: 80, width: 50, height: 60 },
      { id: 'iv-stand-1', type: 'iv_stand', x: 160, y: 60, width: 10, height: 40 },
      { id: 'iv-stand-2', type: 'iv_stand', x: 60, y: 60, width: 10, height: 40 },
      { id: 'door-1', type: 'door', x: 140, y: 280, width: 60, height: 20 },
      { id: 'window-1', type: 'window', x: 0, y: 100, width: 10, height: 80 },
      { id: 'nurse-call-1', type: 'nurse_call', x: 110, y: 60, width: 15, height: 15 },
    ]
  },
];

// Toolbox items for drag & drop
const toolboxItems = [
  { type: 'bed', label: 'Tempat Tidur', icon: '🛏️', defaultWidth: 60, defaultHeight: 100 },
  { type: 'bathroom', label: 'Kamar Mandi', icon: '🚿', defaultWidth: 80, defaultHeight: 80 },
  { type: 'door', label: 'Pintu', icon: '🚪', defaultWidth: 60, defaultHeight: 20 },
  { type: 'window', label: 'Jendela', icon: '🪟', defaultWidth: 10, defaultHeight: 60 },
  { type: 'nurse_call', label: 'Nurse Call', icon: '🔴', defaultWidth: 15, defaultHeight: 15 },
  { type: 'iv_stand', label: 'Tiang Infus', icon: '💉', defaultWidth: 10, defaultHeight: 40 },
  { type: 'monitor', label: 'Monitor', icon: '📺', defaultWidth: 40, defaultHeight: 50 },
  { type: 'sofa', label: 'Sofa', icon: '🛋️', defaultWidth: 80, defaultHeight: 40 },
  { type: 'tv', label: 'TV', icon: '📺', defaultWidth: 50, defaultHeight: 10 },
  { type: 'wardrobe', label: 'Lemari', icon: '🗄️', defaultWidth: 30, defaultHeight: 60 },
];

export default function RoomLayoutEditor() {
  const [activeTab, setActiveTab] = useState<'preset' | 'editor' | 'saved'>('preset');
  const [selectedPreset, setSelectedPreset] = useState<RoomLayout | null>(null);
  const [editorLayout, setEditorLayout] = useState<RoomLayout>({
    id: 'new-layout',
    name: 'Layout Baru',
    roomType: 'Reguler',
    elements: [],
    createdAt: new Date().toISOString(),
  });
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [savedLayouts, setSavedLayouts] = useState<RoomLayout[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [layoutName, setLayoutName] = useState('');
  const [roomType, setRoomType] = useState('Reguler');

  // Handle preset selection
  const handlePresetSelect = (preset: RoomLayout) => {
    setSelectedPreset(preset);
  };

  const handleUsePreset = () => {
    if (selectedPreset) {
      setEditorLayout({
        ...selectedPreset,
        id: `custom-${Date.now()}`,
        isPreset: false,
        createdAt: new Date().toISOString(),
      });
      setActiveTab('editor');
    }
  };

  // Handle drag from toolbox
  const handleDragStart = (type: string) => {
    setDraggedItem(type);
  };

  const handleCanvasDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggedItem) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const item = toolboxItems.find(i => i.type === draggedItem);
    if (!item) return;

    const newElement: LayoutElement = {
      id: `${draggedItem}-${Date.now()}`,
      type: draggedItem as any,
      x: Math.max(0, x - item.defaultWidth / 2),
      y: Math.max(0, y - item.defaultHeight / 2),
      width: item.defaultWidth,
      height: item.defaultHeight,
      label: draggedItem === 'bed' ? String.fromCharCode(65 + editorLayout.elements.filter(e => e.type === 'bed').length) : undefined,
    };

    setEditorLayout({
      ...editorLayout,
      elements: [...editorLayout.elements, newElement],
    });
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Handle element selection and movement
  const handleElementClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElement(id);
  };

  const handleCanvasClick = () => {
    setSelectedElement(null);
  };

  const handleElementDrag = (e: React.MouseEvent, id: string) => {
    if (selectedElement !== id) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const element = editorLayout.elements.find(el => el.id === id);
    if (!element) return;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      setEditorLayout({
        ...editorLayout,
        elements: editorLayout.elements.map(el =>
          el.id === id
            ? { ...el, x: Math.max(0, element.x + dx), y: Math.max(0, element.y + dy) }
            : el
        ),
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Handle element deletion
  const handleDeleteElement = () => {
    if (selectedElement) {
      setEditorLayout({
        ...editorLayout,
        elements: editorLayout.elements.filter(el => el.id !== selectedElement),
      });
      setSelectedElement(null);
    }
  };

  // Handle element rotation
  const handleRotateElement = () => {
    if (selectedElement) {
      setEditorLayout({
        ...editorLayout,
        elements: editorLayout.elements.map(el =>
          el.id === selectedElement
            ? { ...el, rotation: ((el.rotation || 0) + 90) % 360 }
            : el
        ),
      });
    }
  };

  // Save layout
  const handleSaveLayout = () => {
    if (!layoutName.trim()) {
      alert('Silakan masukkan nama layout');
      return;
    }

    const newLayout: RoomLayout = {
      ...editorLayout,
      name: layoutName,
      roomType: roomType,
      createdAt: new Date().toISOString(),
    };

    setSavedLayouts([...savedLayouts, newLayout]);
    alert('Layout berhasil disimpan!');
    setLayoutName('');
    setActiveTab('saved');
  };

  // Render element based on type
  const renderElement = (element: LayoutElement, isSelected: boolean) => {
    const baseStyle = {
      position: 'absolute' as const,
      left: `${element.x}px`,
      top: `${element.y}px`,
      width: `${element.width}px`,
      height: `${element.height}px`,
      transform: `rotate(${element.rotation || 0}deg)`,
      cursor: 'move',
      border: isSelected ? '2px solid #3b82f6' : '1px solid #6b7280',
      boxShadow: isSelected ? '0 0 0 2px rgba(59, 130, 246, 0.3)' : 'none',
    };

    switch (element.type) {
      case 'bed':
        return (
          <div key={element.id} style={baseStyle} className="bg-white border-2 border-gray-600 rounded-sm" onClick={(e) => handleElementClick(element.id, e)} onMouseDown={(e) => handleElementDrag(e, element.id)}>
            <div className="absolute top-1 left-1 right-1 h-2 bg-gray-200 rounded-sm"></div>
            <div className="absolute bottom-1 left-1 right-1 h-3 bg-gray-100 rounded-sm"></div>
            {element.label && <div className="absolute bottom-0 right-0 bg-white px-1 text-[8px] font-bold">{element.label}</div>}
          </div>
        );
      case 'bathroom':
        return (
          <div key={element.id} style={baseStyle} className="bg-blue-50 border-2 border-blue-400 rounded-sm flex items-center justify-center" onClick={(e) => handleElementClick(element.id, e)} onMouseDown={(e) => handleElementDrag(e, element.id)}>
            <span className="text-xs font-bold text-blue-600">KM</span>
          </div>
        );
      case 'door':
        return (
          <div key={element.id} style={baseStyle} className="bg-amber-100 border-2 border-amber-700" onClick={(e) => handleElementClick(element.id, e)} onMouseDown={(e) => handleElementDrag(e, element.id)}>
            <div className="w-full h-full border-t-2 border-gray-700 rounded-t-full opacity-50"></div>
          </div>
        );
      case 'window':
        return (
          <div key={element.id} style={baseStyle} className="bg-blue-200 border-2 border-blue-500" onClick={(e) => handleElementClick(element.id, e)} onMouseDown={(e) => handleElementDrag(e, element.id)}></div>
        );
      case 'nurse_call':
        return (
          <div key={element.id} style={baseStyle} className="bg-red-500 border-2 border-red-700 rounded-full flex items-center justify-center" onClick={(e) => handleElementClick(element.id, e)} onMouseDown={(e) => handleElementDrag(e, element.id)}>
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        );
      case 'iv_stand':
        return (
          <div key={element.id} style={baseStyle} className="bg-gray-600" onClick={(e) => handleElementClick(element.id, e)} onMouseDown={(e) => handleElementDrag(e, element.id)}></div>
        );
      case 'monitor':
        return (
          <div key={element.id} style={baseStyle} className="bg-gray-800 border-2 border-gray-900 rounded-sm flex items-center justify-center" onClick={(e) => handleElementClick(element.id, e)} onMouseDown={(e) => handleElementDrag(e, element.id)}>
            <span className="text-[8px] text-green-400 font-bold">MONITOR</span>
          </div>
        );
      case 'sofa':
        return (
          <div key={element.id} style={baseStyle} className="bg-purple-100 border-2 border-purple-400 rounded-sm" onClick={(e) => handleElementClick(element.id, e)} onMouseDown={(e) => handleElementDrag(e, element.id)}></div>
        );
      case 'tv':
        return (
          <div key={element.id} style={baseStyle} className="bg-gray-900 border-2 border-black" onClick={(e) => handleElementClick(element.id, e)} onMouseDown={(e) => handleElementDrag(e, element.id)}></div>
        );
      case 'wardrobe':
        return (
          <div key={element.id} style={baseStyle} className="bg-amber-100 border-2 border-amber-600 rounded-sm" onClick={(e) => handleElementClick(element.id, e)} onMouseDown={(e) => handleElementDrag(e, element.id)}></div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <i className="fas fa-drafting-compass text-indigo-600"></i>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-indigo-800">Editor Denah Kamar</h3>
            <p className="text-sm text-indigo-700 mt-1">
              Buat dan kelola denah kamar rumah sakit dengan preset layout siap pakai atau editor drag & drop untuk layout custom.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('preset')}
          className={`px-4 py-2 font-medium text-sm transition ${activeTab === 'preset' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-800'}`}
        >
          <i className="fas fa-th-large mr-2"></i>Preset Layout
        </button>
        <button
          onClick={() => setActiveTab('editor')}
          className={`px-4 py-2 font-medium text-sm transition ${activeTab === 'editor' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-800'}`}
        >
          <i className="fas fa-edit mr-2"></i>Drag & Drop Editor
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2 font-medium text-sm transition ${activeTab === 'saved' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-800'}`}
        >
          <i className="fas fa-save mr-2"></i>Layout Tersimpan ({savedLayouts.length})
        </button>
      </div>

      {/* Preset Layout Tab */}
      {activeTab === 'preset' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {presetLayouts.map(preset => (
              <div
                key={preset.id}
                onClick={() => handlePresetSelect(preset)}
                className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition ${
                  selectedPreset?.id === preset.id ? 'border-indigo-500 shadow-lg' : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">{preset.name}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    preset.roomType === 'ICU' ? 'bg-red-100 text-red-700' :
                    preset.roomType === 'VIP' ? 'bg-purple-100 text-purple-700' :
                    preset.roomType === 'HCU' ? 'bg-orange-100 text-orange-700' :
                    preset.roomType === 'NICU' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {preset.roomType}
                  </span>
                </div>
                
                {/* Mini Preview */}
                <div className="relative w-full h-40 bg-gray-50 border border-gray-300 rounded-lg overflow-hidden mb-3">
                  {preset.elements.map(element => {
                    const scale = 0.4;
                    return (
                      <div
                        key={element.id}
                        className={`absolute ${
                          element.type === 'bed' ? 'bg-white border border-gray-600' :
                          element.type === 'bathroom' ? 'bg-blue-50 border border-blue-400' :
                          element.type === 'door' ? 'bg-amber-100 border border-amber-700' :
                          element.type === 'window' ? 'bg-blue-200 border border-blue-500' :
                          element.type === 'nurse_call' ? 'bg-red-500 border border-red-700 rounded-full' :
                          element.type === 'monitor' ? 'bg-gray-800 border border-gray-900' :
                          'bg-gray-200 border border-gray-400'
                        }`}
                        style={{
                          left: `${element.x * scale}px`,
                          top: `${element.y * scale}px`,
                          width: `${element.width * scale}px`,
                          height: `${element.height * scale}px`,
                        }}
                      ></div>
                    );
                  })}
                </div>

                <div className="text-xs text-gray-500">
                  {preset.elements.length} elemen • {preset.elements.filter(e => e.type === 'bed').length} bed
                </div>
              </div>
            ))}
          </div>

          {selectedPreset && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-indigo-800">Preset "{selectedPreset.name}" dipilih</p>
                <p className="text-sm text-indigo-600">Klik "Gunakan Preset" untuk mengedit layout ini</p>
              </div>
              <button
                onClick={handleUsePreset}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
              >
                <i className="fas fa-arrow-right mr-2"></i>Gunakan Preset
              </button>
            </div>
          )}
        </div>
      )}

      {/* Drag & Drop Editor Tab */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Toolbox */}
          <div className="bg-white rounded-xl border p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Toolbox</h4>
            <div className="space-y-2">
              {toolboxItems.map(item => (
                <div
                  key={item.type}
                  draggable
                  onDragStart={() => handleDragStart(item.type)}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 border border-gray-200"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <h4 className="font-semibold text-gray-800 mb-2">Properti</h4>
              {selectedElement ? (
                <div className="space-y-2">
                  <button
                    onClick={handleRotateElement}
                    className="w-full px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200"
                  >
                    <i className="fas fa-rotate-right mr-2"></i>Rotasi 90°
                  </button>
                  <button
                    onClick={handleDeleteElement}
                    className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200"
                  >
                    <i className="fas fa-trash mr-2"></i>Hapus
                  </button>
                </div>
              ) : (
                <p className="text-xs text-gray-500">Klik elemen untuk memilih</p>
              )}
            </div>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800">Canvas Denah</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nama Layout"
                    value={layoutName}
                    onChange={(e) => setLayoutName(e.target.value)}
                    className="px-3 py-1.5 border rounded-lg text-sm"
                  />
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="px-3 py-1.5 border rounded-lg text-sm"
                  >
                    <option>Reguler</option>
                    <option>VIP</option>
                    <option>ICU</option>
                    <option>NICU</option>
                    <option>HCU</option>
                  </select>
                  <button
                    onClick={handleSaveLayout}
                    className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                  >
                    <i className="fas fa-save mr-2"></i>Simpan
                  </button>
                </div>
              </div>

              <div
                className="relative w-full h-96 bg-white border-4 border-gray-700 rounded-lg overflow-hidden"
                onDrop={handleCanvasDrop}
                onDragOver={handleDragOver}
                onClick={handleCanvasClick}
              >
                {/* Grid */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}></div>

                {/* Elements */}
                {editorLayout.elements.map(element => renderElement(element, selectedElement === element.id))}

                {/* Empty State */}
                {editorLayout.elements.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <i className="fas fa-mouse-pointer text-4xl mb-2"></i>
                      <p className="text-sm">Drag elemen dari toolbox ke sini</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-3 text-xs text-gray-500">
                <i className="fas fa-info-circle mr-1"></i>
                Tip: Drag elemen dari toolbox, klik elemen untuk memilih, lalu drag untuk memindahkan
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Layouts Tab */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          {savedLayouts.length === 0 ? (
            <div className="bg-white rounded-xl border p-12 text-center">
              <i className="fas fa-folder-open text-4xl text-gray-300 mb-3"></i>
              <p className="text-gray-500">Belum ada layout yang disimpan</p>
              <p className="text-sm text-gray-400 mt-1">Buat layout baru di tab "Drag & Drop Editor"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedLayouts.map(layout => (
                <div key={layout.id} className="bg-white rounded-xl border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">{layout.name}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      layout.roomType === 'ICU' ? 'bg-red-100 text-red-700' :
                      layout.roomType === 'VIP' ? 'bg-purple-100 text-purple-700' :
                      layout.roomType === 'HCU' ? 'bg-orange-100 text-orange-700' :
                      layout.roomType === 'NICU' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {layout.roomType}
                    </span>
                  </div>
                  
                  {/* Mini Preview */}
                  <div className="relative w-full h-32 bg-gray-50 border border-gray-300 rounded-lg overflow-hidden mb-3">
                    {layout.elements.map(element => {
                      const scale = 0.35;
                      return (
                        <div
                          key={element.id}
                          className={`absolute ${
                            element.type === 'bed' ? 'bg-white border border-gray-600' :
                            element.type === 'bathroom' ? 'bg-blue-50 border border-blue-400' :
                            element.type === 'door' ? 'bg-amber-100 border border-amber-700' :
                            element.type === 'window' ? 'bg-blue-200 border border-blue-500' :
                            element.type === 'nurse_call' ? 'bg-red-500 border border-red-700 rounded-full' :
                            element.type === 'monitor' ? 'bg-gray-800 border border-gray-900' :
                            'bg-gray-200 border border-gray-400'
                          }`}
                          style={{
                            left: `${element.x * scale}px`,
                            top: `${element.y * scale}px`,
                            width: `${element.width * scale}px`,
                            height: `${element.height * scale}px`,
                          }}
                        ></div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{layout.elements.length} elemen</span>
                    <span>{new Date(layout.createdAt).toLocaleDateString('id-ID')}</span>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => {
                        setEditorLayout(layout);
                        setLayoutName(layout.name);
                        setRoomType(layout.roomType);
                        setActiveTab('editor');
                      }}
                      className="flex-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200"
                    >
                      <i className="fas fa-edit mr-1"></i>Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Hapus layout ini?')) {
                          setSavedLayouts(savedLayouts.filter(l => l.id !== layout.id));
                        }
                      }}
                      className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
