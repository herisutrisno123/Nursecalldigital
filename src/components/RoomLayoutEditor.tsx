import { useState, useEffect, useRef } from 'react';

// Types
interface LayoutElement {
  id: string;
  type: 'room' | 'bed' | 'bathroom' | 'door' | 'window' | 'nurse_call' | 'iv_stand' | 'monitor' | 'sofa' | 'tv' | 'wardrobe';
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

// Toolbox items for drag & drop
const toolboxItems = [
  { type: 'room', label: 'Kotak Kamar', icon: '📐', defaultWidth: 300, defaultHeight: 350 },
  { type: 'bed', label: 'Tempat Tidur', icon: '🛏️', defaultWidth: 60, defaultHeight: 100 },
  { type: 'bathroom', label: 'Kamar Mandi', icon: '🚿', defaultWidth: 80, defaultHeight: 80 },
  { type: 'door', label: 'Pintu', icon: '🚪', defaultWidth: 20, defaultHeight: 60 },
  { type: 'window', label: 'Jendela', icon: '🪟', defaultWidth: 10, defaultHeight: 60 },
  { type: 'nurse_call', label: 'Nurse Call', icon: '🔴', defaultWidth: 15, defaultHeight: 15 },
  { type: 'iv_stand', label: 'Tiang Infus', icon: '💉', defaultWidth: 10, defaultHeight: 40 },
  { type: 'monitor', label: 'Monitor', icon: '📺', defaultWidth: 40, defaultHeight: 50 },
  { type: 'sofa', label: 'Sofa', icon: '🛋️', defaultWidth: 80, defaultHeight: 40 },
  { type: 'tv', label: 'TV', icon: '📺', defaultWidth: 50, defaultHeight: 10 },
  { type: 'wardrobe', label: 'Lemari', icon: '🗄️', defaultWidth: 30, defaultHeight: 60 },
];

export default function RoomLayoutEditor() {
  const [activeTab, setActiveTab] = useState<'editor' | 'saved'>('editor');
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
  const [is3DView, setIs3DView] = useState(false);
  const [resizingElement, setResizingElement] = useState<string | null>(null);
  const resizeStartRef = useRef<{ x: number; y: number; width: number; height: number; elementId: string } | null>(null);

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

    const GRID_SIZE = 10;
    // Snap to grid
    const snappedX = Math.round((x - item.defaultWidth / 2) / GRID_SIZE) * GRID_SIZE;
    const snappedY = Math.round((y - item.defaultHeight / 2) / GRID_SIZE) * GRID_SIZE;

    const newElement: LayoutElement = {
      id: `${draggedItem}-${Date.now()}`,
      type: draggedItem as any,
      x: Math.max(0, snappedX),
      y: Math.max(0, snappedY),
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
    e.preventDefault();
    setSelectedElement(id);
  };

  const handleCanvasClick = () => {
    setSelectedElement(null);
  };

  const handleElementDrag = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    // Select the element first
    setSelectedElement(id);

    const startX = e.clientX;
    const startY = e.clientY;
    const element = editorLayout.elements.find(el => el.id === id);
    if (!element) return;

    const GRID_SIZE = 10; // Snap to 10px grid
    const startElementX = element.x;
    const startElementY = element.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      // Snap to grid
      const newX = Math.round((startElementX + dx) / GRID_SIZE) * GRID_SIZE;
      const newY = Math.round((startElementY + dy) / GRID_SIZE) * GRID_SIZE;

      setEditorLayout({
        ...editorLayout,
        elements: editorLayout.elements.map(el =>
          el.id === id
            ? { ...el, x: Math.max(0, newX), y: Math.max(0, newY) }
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
  const handleDeleteElement = (elementId?: string) => {
    const targetId = elementId || selectedElement;
    
    if (!targetId) {
      alert('Silakan pilih elemen yang ingin dihapus terlebih dahulu');
      return;
    }

    const elementToDelete = editorLayout.elements.find(el => el.id === targetId);
    if (!elementToDelete) return;

    const elementLabel = elementToDelete.type === 'bed' && elementToDelete.label 
      ? `Tempat Tidur ${elementToDelete.label}`
      : elementToDelete.type === 'bathroom' 
      ? 'Kamar Mandi'
      : elementToDelete.type === 'door'
      ? 'Pintu'
      : elementToDelete.type === 'window'
      ? 'Jendela'
      : elementToDelete.type === 'room'
      ? 'Kotak Kamar'
      : elementToDelete.type;

    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus ${elementLabel} ini?`
    );

    if (confirmDelete) {
      setEditorLayout({
        ...editorLayout,
        elements: editorLayout.elements.filter(el => el.id !== targetId),
      });
      if (selectedElement === targetId) {
        setSelectedElement(null);
      }
    }
  };

  // Handle resize for room element
  const handleResizeStart = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    const element = editorLayout.elements.find(el => el.id === elementId);
    if (!element) return;

    setResizingElement(elementId);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: element.width,
      height: element.height,
      elementId: elementId,
    };

    const handleResizeMove = (moveEvent: MouseEvent) => {
      if (!resizeStartRef.current) return;

      const dx = moveEvent.clientX - resizeStartRef.current.x;
      const dy = moveEvent.clientY - resizeStartRef.current.y;

      const newWidth = Math.max(100, resizeStartRef.current.width + dx);
      const newHeight = Math.max(100, resizeStartRef.current.height + dy);

      setEditorLayout(prev => ({
        ...prev,
        elements: prev.elements.map(el =>
          el.id === resizeStartRef.current!.elementId
            ? { ...el, width: newWidth, height: newHeight }
            : el
        ),
      }));
    };

    const handleResizeEnd = () => {
      setResizingElement(null);
      resizeStartRef.current = null;
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };

    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  // Handle element rotation
  const handleRotateElement = () => {
    if (!selectedElement) {
      alert('Silakan pilih elemen yang ingin diputar terlebih dahulu');
      return;
    }

    setEditorLayout({
      ...editorLayout,
      elements: editorLayout.elements.map(el =>
        el.id === selectedElement
          ? { ...el, rotation: ((el.rotation || 0) + 90) % 360 }
          : el
      ),
    });
  };

  // Save layout
  const handleSaveLayout = () => {
    // Validasi nama layout
    if (!layoutName || layoutName.trim() === '') {
      alert('⚠️ Silakan masukkan nama layout terlebih dahulu');
      return;
    }

    // Validasi elemen
    if (editorLayout.elements.length === 0) {
      alert('⚠️ Layout kosong! Silakan tambahkan minimal 1 elemen dari toolbox');
      return;
    }

    // Buat layout baru
    const newLayout: RoomLayout = {
      id: `layout-${Date.now()}`,
      name: layoutName.trim(),
      roomType: roomType,
      elements: [...editorLayout.elements],
      createdAt: new Date().toISOString(),
    };

    // Simpan ke state
    setSavedLayouts(prevLayouts => [...prevLayouts, newLayout]);
    
    // Feedback sukses
    alert(`✅ Layout "${newLayout.name}" berhasil disimpan!\n\nTotal elemen: ${newLayout.elements.length}`);
    
    // Reset form
    setLayoutName('');
    setEditorLayout({
      id: 'new-layout',
      name: 'Layout Baru',
      roomType: 'Reguler',
      elements: [],
      createdAt: new Date().toISOString(),
    });
    setSelectedElement(null);
    
    // Pindah ke tab saved
    setActiveTab('saved');
  };

  // Render cartoon-style mini preview for saved/preset layouts
  const renderArchitecturalPreview = (elements: LayoutElement[], previewWidth: number, previewHeight: number, scale: number) => {
    return (
      <div 
        className="relative bg-yellow-50 border-4 border-gray-900 rounded-2xl overflow-hidden mx-auto shadow-lg"
        style={{ 
          width: `${previewWidth}px`, 
          height: `${previewHeight}px`,
        }}
      >
        {/* Cartoon floor pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle, #fbbf24 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        ></div>

        {/* Windows with cartoon style */}
        {elements.filter(e => e.type === 'window').map((element, idx) => (
          <div
            key={`win-${idx}`}
            className="absolute flex items-center justify-center"
            style={{
              left: `${element.x * scale}px`,
              top: `${element.y * scale}px`,
              width: `${element.width * scale}px`,
              height: `${element.height * scale}px`,
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-cyan-300 to-cyan-400 border-4 border-gray-900 rounded-lg relative shadow-xl flex items-center justify-center">
              {/* Window emoji */}
              <span className="text-2xl">🪟</span>
            </div>
          </div>
        ))}

        {/* Bathroom with cartoon style */}
        {elements.filter(e => e.type === 'bathroom').map((element, idx) => (
          <div
            key={`bath-${idx}`}
            className="absolute flex items-center justify-center"
            style={{
              left: `${element.x * scale}px`,
              top: `${element.y * scale}px`,
              width: `${element.width * scale}px`,
              height: `${element.height * scale}px`,
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-blue-300 to-blue-400 border-4 border-gray-900 rounded-xl relative shadow-xl flex items-center justify-center">
              {/* Bathroom emoji */}
              <span className="text-3xl">🚿</span>
              
              {/* KM Label */}
              <div className="absolute bottom-1 right-1 bg-white px-1.5 py-0.5 rounded-full text-[10px] font-black text-blue-700 border-2 border-gray-900">
                KM
              </div>
            </div>
          </div>
        ))}

        {/* Beds with cartoon style */}
        {elements.filter(e => e.type === 'bed').map((element, idx) => (
          <div
            key={`bed-${idx}`}
            className="absolute flex items-center justify-center"
            style={{
              left: `${element.x * scale}px`,
              top: `${element.y * scale}px`,
              width: `${element.width * scale}px`,
              height: `${element.height * scale}px`,
              transform: `rotate(${element.rotation || 0}deg)`,
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-pink-200 to-pink-300 border-4 border-gray-900 rounded-xl relative shadow-xl flex items-center justify-center">
              {/* Bed emoji */}
              <span className="text-3xl">🛏️</span>
              
              {/* Bed Label */}
              {element.label && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 px-2 py-0.5 rounded-full text-xs font-black text-gray-900 border-3 border-gray-900 shadow-md z-10">
                  {element.label}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Doors with cartoon style */}
        {elements.filter(e => e.type === 'door').map((element, idx) => (
          <div
            key={`door-${idx}`}
            className="absolute flex items-center justify-center"
            style={{
              left: `${element.x * scale}px`,
              top: `${element.y * scale}px`,
              width: `${element.width * scale}px`,
              height: `${element.height * scale}px`,
              transform: `rotate(${element.rotation || 0}deg)`,
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-amber-400 to-amber-500 border-4 border-gray-900 rounded-lg relative shadow-xl flex items-center justify-center">
              {/* Door emoji */}
              <span className="text-2xl">🚪</span>
            </div>
          </div>
        ))}

        {/* Nurse call with cartoon style */}
        {elements.filter(e => e.type === 'nurse_call').map((element, idx) => (
          <div
            key={`call-${idx}`}
            className="absolute flex items-center justify-center"
            style={{
              left: `${element.x * scale}px`,
              top: `${element.y * scale}px`,
              width: `${element.width * scale}px`,
              height: `${element.height * scale}px`,
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-red-400 to-red-500 border-4 border-gray-900 rounded-full shadow-xl flex items-center justify-center animate-pulse">
              {/* Nurse call emoji */}
              <span className="text-xl">🔴</span>
            </div>
          </div>
        ))}

        {/* Monitors with cartoon style */}
        {elements.filter(e => e.type === 'monitor').map((element, idx) => (
          <div
            key={`mon-${idx}`}
            className="absolute flex items-center justify-center"
            style={{
              left: `${element.x * scale}px`,
              top: `${element.y * scale}px`,
              width: `${element.width * scale}px`,
              height: `${element.height * scale}px`,
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 border-4 border-gray-900 rounded-xl relative shadow-xl flex items-center justify-center">
              {/* Monitor emoji */}
              <span className="text-2xl">📺</span>
            </div>
          </div>
        ))}

        {/* IV Stands with cartoon style */}
        {elements.filter(e => e.type === 'iv_stand').map((element, idx) => (
          <div
            key={`iv-${idx}`}
            className="absolute flex items-center justify-center"
            style={{
              left: `${element.x * scale}px`,
              top: `${element.y * scale}px`,
              width: `${element.width * scale}px`,
              height: `${element.height * scale}px`,
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-green-300 to-green-400 border-4 border-gray-900 rounded-lg relative shadow-xl flex items-center justify-center">
              {/* IV emoji */}
              <span className="text-2xl">💉</span>
            </div>
          </div>
        ))}

        {/* Sofas with cartoon style */}
        {elements.filter(e => e.type === 'sofa').map((element, idx) => (
          <div
            key={`sofa-${idx}`}
            className="absolute flex items-center justify-center"
            style={{
              left: `${element.x * scale}px`,
              top: `${element.y * scale}px`,
              width: `${element.width * scale}px`,
              height: `${element.height * scale}px`,
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-purple-300 to-purple-400 border-4 border-gray-900 rounded-xl relative shadow-xl flex items-center justify-center">
              {/* Sofa emoji */}
              <span className="text-2xl">🛋️</span>
            </div>
          </div>
        ))}

        {/* TVs with cartoon style */}
        {elements.filter(e => e.type === 'tv').map((element, idx) => (
          <div
            key={`tv-${idx}`}
            className="absolute flex items-center justify-center"
            style={{
              left: `${element.x * scale}px`,
              top: `${element.y * scale}px`,
              width: `${element.width * scale}px`,
              height: `${element.height * scale}px`,
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black border-4 border-gray-900 rounded-xl relative shadow-xl flex items-center justify-center">
              {/* TV emoji */}
              <span className="text-2xl">📺</span>
            </div>
          </div>
        ))}

        {/* Wardrobes with cartoon style */}
        {elements.filter(e => e.type === 'wardrobe').map((element, idx) => (
          <div
            key={`ward-${idx}`}
            className="absolute flex items-center justify-center"
            style={{
              left: `${element.x * scale}px`,
              top: `${element.y * scale}px`,
              width: `${element.width * scale}px`,
              height: `${element.height * scale}px`,
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-amber-300 to-amber-400 border-4 border-gray-900 rounded-xl relative shadow-xl flex items-center justify-center">
              {/* Wardrobe emoji */}
              <span className="text-2xl">🗄️</span>
            </div>
          </div>
        ))}

        {/* Room number label with cartoon style */}
        <div className="absolute top-2 left-2 bg-yellow-300 px-2 py-1 rounded-full text-xs font-black text-gray-900 border-4 border-gray-900 shadow-lg z-20">
          🏥 {elements.find(e => e.type === 'bed')?.label || 'RM'}
        </div>
      </div>
    );
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== 'editor') return;
      
      // Delete or Backspace to delete selected element
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElement) {
        // Prevent default behavior for form inputs
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
          return;
        }
        e.preventDefault();
        handleDeleteElement();
      }
      
      // Escape to deselect
      if (e.key === 'Escape') {
        setSelectedElement(null);
      }
      
      // R to rotate
      if (e.key === 'r' || e.key === 'R') {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
          return;
        }
        if (selectedElement) {
          e.preventDefault();
          handleRotateElement();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, selectedElement, editorLayout]);

  // Render element based on type - Architectural Style with 3D option
  const renderElement = (element: LayoutElement, isSelected: boolean) => {
    const baseStyle = {
      position: 'absolute' as const,
      left: `${element.x}px`,
      top: `${element.y}px`,
      width: `${element.width}px`,
      height: `${element.height}px`,
      transform: `rotate(${element.rotation || 0}deg)`,
      cursor: 'move',
      border: isSelected ? '2px solid #2563eb' : '2px solid #1f2937',
      boxShadow: isSelected ? '0 0 0 3px rgba(37, 99, 235, 0.3)' : '0 1px 3px rgba(0,0,0,0.2)',
    };

    // 3D style for elements
    const element3DStyle = {
      ...baseStyle,
      transformStyle: 'preserve-3d' as const,
      transform: `rotate(${element.rotation || 0}deg) ${is3DView ? 'perspective(800px) rotateX(45deg)' : ''}`,
      transition: 'transform 0.3s ease',
    };

    // Delete button component for selected elements
    const DeleteButton = () => (
      isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleDeleteElement(element.id);
          }}
          className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-all hover:scale-110 z-50"
          title="Hapus elemen"
          style={{ transform: 'translateZ(20px)' }}
        >
          <i className="fas fa-times text-xs"></i>
        </button>
      )
    );

    switch (element.type) {
      case 'room':
        return (
          <div 
            key={element.id} 
            style={{
              ...baseStyle,
              backgroundColor: 'transparent',
              border: isSelected ? '3px dashed #2563eb' : '3px dashed #6b7280',
              boxShadow: isSelected ? '0 0 0 3px rgba(37, 99, 235, 0.3)' : 'none',
            }}
            className="relative"
            onClick={(e) => handleElementClick(element.id, e)}
            onMouseDown={(e) => handleElementDrag(e, element.id)}
          >
            {/* Room Label */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap">
              Kamar ({Math.round(element.width / 10)}m x {Math.round(element.height / 10)}m)
            </div>
            
            {/* Resize Handles - Corners */}
            {isSelected && (
              <>
                {/* Top-Left */}
                <div
                  className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize hover:bg-blue-600 hover:scale-125 transition-transform"
                  onMouseDown={(e) => handleResizeStart(e, element.id)}
                  style={{ zIndex: 10 }}
                />
                {/* Top-Right */}
                <div
                  className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize hover:bg-blue-600 hover:scale-125 transition-transform"
                  onMouseDown={(e) => handleResizeStart(e, element.id)}
                  style={{ zIndex: 10 }}
                />
                {/* Bottom-Left */}
                <div
                  className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize hover:bg-blue-600 hover:scale-125 transition-transform"
                  onMouseDown={(e) => handleResizeStart(e, element.id)}
                  style={{ zIndex: 10 }}
                />
                {/* Bottom-Right */}
                <div
                  className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize hover:bg-blue-600 hover:scale-125 transition-transform"
                  onMouseDown={(e) => handleResizeStart(e, element.id)}
                  style={{ zIndex: 10 }}
                />
                {/* Edge Handles */}
                <div
                  className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-ns-resize hover:bg-blue-600 hover:scale-125 transition-transform"
                  onMouseDown={(e) => handleResizeStart(e, element.id)}
                  style={{ zIndex: 10 }}
                />
                <div
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-ns-resize hover:bg-blue-600 hover:scale-125 transition-transform"
                  onMouseDown={(e) => handleResizeStart(e, element.id)}
                  style={{ zIndex: 10 }}
                />
                <div
                  className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-ew-resize hover:bg-blue-600 hover:scale-125 transition-transform"
                  onMouseDown={(e) => handleResizeStart(e, element.id)}
                  style={{ zIndex: 10 }}
                />
                <div
                  className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-ew-resize hover:bg-blue-600 hover:scale-125 transition-transform"
                  onMouseDown={(e) => handleResizeStart(e, element.id)}
                  style={{ zIndex: 10 }}
                />
              </>
            )}
          </div>
        );

      case 'bed':
        return (
          <div 
            key={element.id} 
            style={is3DView ? element3DStyle : baseStyle} 
            className="bg-white" 
            onClick={(e) => handleElementClick(element.id, e)} 
            onMouseDown={(e) => handleElementDrag(e, element.id)}
          >
            {is3DView ? (
              <>
                {/* 3D Hospital Bed - Realistic Design */}
                <div className="absolute inset-0" style={{ transform: 'translateZ(10px)', transformStyle: 'preserve-3d' }}>
                  {/* Metal Frame Base - Stainless Steel */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 rounded-sm shadow-2xl" style={{ transform: 'translateZ(0px)' }}>
                    {/* Metal texture */}
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.3) 1px, rgba(255,255,255,0.3) 2px)'
                    }}></div>
                  </div>
                  
                  {/* Headboard - Metal */}
                  <div className="absolute top-0 left-0 right-0 h-[10%] rounded-t-sm" style={{ transform: 'translateZ(2px)' }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-400 via-gray-500 to-gray-600 border-2 border-gray-700 rounded-t-sm shadow-lg">
                      {/* Metal shine */}
                      <div className="absolute inset-0 opacity-30" style={{
                        backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 50%)'
                      }}></div>
                    </div>
                  </div>
                  
                  {/* Side Rails - Hospital Bed Feature */}
                  <div className="absolute top-[10%] left-0 w-[5%] bottom-[10%]" style={{ transform: 'translateZ(3px)' }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-600 border-2 border-gray-700 rounded-l-sm">
                      {/* Rail bars */}
                      <div className="absolute top-[20%] left-0 right-0 h-[2px] bg-gray-800"></div>
                      <div className="absolute top-[40%] left-0 right-0 h-[2px] bg-gray-800"></div>
                      <div className="absolute top-[60%] left-0 right-0 h-[2px] bg-gray-800"></div>
                      <div className="absolute top-[80%] left-0 right-0 h-[2px] bg-gray-800"></div>
                    </div>
                  </div>
                  <div className="absolute top-[10%] right-0 w-[5%] bottom-[10%]" style={{ transform: 'translateZ(3px)' }}>
                    <div className="absolute inset-0 bg-gradient-to-l from-gray-500 to-gray-600 border-2 border-gray-700 rounded-r-sm">
                      {/* Rail bars */}
                      <div className="absolute top-[20%] left-0 right-0 h-[2px] bg-gray-800"></div>
                      <div className="absolute top-[40%] left-0 right-0 h-[2px] bg-gray-800"></div>
                      <div className="absolute top-[60%] left-0 right-0 h-[2px] bg-gray-800"></div>
                      <div className="absolute top-[80%] left-0 right-0 h-[2px] bg-gray-800"></div>
                    </div>
                  </div>
                  
                  {/* Mattress - Hospital Style */}
                  <div className="absolute top-[10%] left-[5%] right-[5%] bottom-[10%] rounded-sm" style={{ transform: 'translateZ(5px)' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-blue-100 border-2 border-gray-300 rounded-sm shadow-inner">
                      {/* Mattress texture */}
                      <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, gray 1px, transparent 0)',
                        backgroundSize: '8px 8px'
                      }}></div>
                      {/* Mattress edge */}
                      <div className="absolute inset-0 border-2 border-blue-200 rounded-sm"></div>
                    </div>
                  </div>
                  
                  {/* Pillow - Hospital Style */}
                  <div className="absolute top-[12%] left-[10%] right-[10%] h-[10%] rounded" style={{ transform: 'translateZ(8px)' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50 border-2 border-gray-300 rounded shadow-md">
                      {/* Pillow cover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-100 rounded opacity-50"></div>
                    </div>
                  </div>
                  
                  {/* Sheet/Blanket - Hospital Blue */}
                  <div className="absolute top-[25%] left-[5%] right-[5%] bottom-[12%] rounded-sm" style={{ transform: 'translateZ(6px)' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 border-2 border-blue-400 rounded-sm shadow-md">
                      {/* Fabric texture */}
                      <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.3) 5px, rgba(255,255,255,0.3) 10px)'
                      }}></div>
                      {/* Fold effect */}
                      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-blue-300 to-transparent"></div>
                    </div>
                  </div>
                  
                  {/* Footboard - Metal */}
                  <div className="absolute bottom-0 left-0 right-0 h-[8%] rounded-b-sm" style={{ transform: 'translateZ(2px)' }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-500 via-gray-400 to-gray-500 border-2 border-gray-700 rounded-b-sm shadow-lg">
                      {/* Metal shine */}
                      <div className="absolute inset-0 opacity-30" style={{
                        backgroundImage: 'linear-gradient(0deg, rgba(255,255,255,0.4) 0%, transparent 50%)'
                      }}></div>
                    </div>
                  </div>
                  
                  {/* Wheels - Hospital Bed Feature */}
                  <div className="absolute bottom-[-3%] left-[10%] w-[8%] h-[6%]" style={{ transform: 'translateZ(1px)' }}>
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-gray-900 rounded-full shadow-lg"></div>
                  </div>
                  <div className="absolute bottom-[-3%] right-[10%] w-[8%] h-[6%]" style={{ transform: 'translateZ(1px)' }}>
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-gray-900 rounded-full shadow-lg"></div>
                  </div>
                </div>
                
                {/* 3D Bed - Left Side */}
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-gray-500 to-gray-600 border-2 border-gray-700"
                  style={{ 
                    transform: 'rotateY(-90deg) translateZ(0px)',
                    transformOrigin: 'left center',
                    width: '10px'
                  }}
                ></div>
                
                {/* 3D Bed - Right Side */}
                <div 
                  className="absolute top-0 right-0 h-full bg-gradient-to-l from-gray-500 to-gray-600 border-2 border-gray-700"
                  style={{ 
                    transform: 'rotateY(90deg) translateZ(0px)',
                    transformOrigin: 'right center',
                    width: '10px'
                  }}
                ></div>
                
                {/* 3D Bed - Front Side */}
                <div 
                  className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-gray-500 to-gray-600 border-2 border-gray-700"
                  style={{ 
                    transform: 'rotateX(-90deg) translateZ(0px)',
                    transformOrigin: 'bottom center',
                    height: '10px'
                  }}
                ></div>
                
                {/* 3D Bed - Back Side */}
                <div 
                  className="absolute top-0 left-0 w-full bg-gradient-to-b from-gray-500 to-gray-600 border-2 border-gray-700"
                  style={{ 
                    transform: 'rotateX(90deg) translateZ(0px)',
                    transformOrigin: 'top center',
                    height: '10px'
                  }}
                ></div>

                {/* Shadow */}
                <div 
                  className="absolute inset-0 bg-black opacity-30 blur-md"
                  style={{ transform: 'translateZ(-2px) translateY(6px)' }}
                ></div>
              </>
            ) : (
              <>
                {/* 2D Hospital Bed */}
                <div className="absolute inset-0 border-2 border-gray-600 bg-gradient-to-br from-gray-100 to-white">
                  {/* Metal Frame */}
                  <div className="absolute inset-0 border-2 border-gray-500"></div>
                  {/* Headboard */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gray-500"></div>
                  {/* Side Rails */}
                  <div className="absolute top-2 left-0 w-1 bottom-2 bg-gray-500"></div>
                  <div className="absolute top-2 right-0 w-1 bottom-2 bg-gray-500"></div>
                  {/* Mattress */}
                  <div className="absolute top-2 left-1 right-1 bottom-2 bg-blue-50 border border-blue-200 rounded-sm">
                    {/* Pillow */}
                    <div className="absolute top-1 left-1 right-1 h-2 bg-white border border-gray-300 rounded-sm"></div>
                    {/* Blanket */}
                    <div className="absolute top-4 left-0 right-0 bottom-0 bg-blue-100 border-t border-blue-300"></div>
                  </div>
                  {/* Footboard */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-500"></div>
                  {/* Wheels */}
                  <div className="absolute bottom-[-2px] left-[15%] w-2 h-2 bg-gray-700 rounded-full"></div>
                  <div className="absolute bottom-[-2px] right-[15%] w-2 h-2 bg-gray-700 rounded-full"></div>
                </div>
              </>
            )}
            
            {/* Bed Label */}
            {element.label && (
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-white px-1.5 py-0.5 rounded text-[9px] font-bold text-gray-800 border border-gray-400 shadow-sm z-10">
                {element.label}
              </div>
            )}
            
            {/* Delete Button */}
            <DeleteButton />
          </div>
        );
      case 'bathroom':
        return (
          <div key={element.id} style={is3DView ? element3DStyle : baseStyle} className="bg-blue-50" onClick={(e) => handleElementClick(element.id, e)} onMouseDown={(e) => handleElementDrag(e, element.id)}>
            {is3DView ? (
              <>
                {/* 3D Bathroom - Realistic */}
                <div className="absolute inset-0" style={{ transform: 'translateZ(5px)', transformStyle: 'preserve-3d' }}>
                  {/* Floor tiles */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-600 rounded-sm">
                    <div className="absolute inset-0 opacity-30" style={{
                      backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                      backgroundSize: '10px 10px',
                      backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px'
                    }}></div>
                  </div>
                  
                  {/* Toilet - Realistic 3D */}
                  <div className="absolute top-[10%] left-[10%] w-[30%] h-[40%]" style={{ transform: 'translateZ(8px)' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100 border-2 border-gray-400 rounded-t-full shadow-lg">
                      {/* Toilet bowl */}
                      <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-b from-white to-gray-50 border-t-2 border-gray-300 rounded-b-lg">
                        {/* Water */}
                        <div className="absolute top-2 left-2 right-2 h-3 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-60"></div>
                      </div>
                      {/* Tank */}
                      <div className="absolute top-0 left-[20%] right-[20%] h-[40%] bg-gradient-to-b from-white to-gray-100 border-2 border-gray-400 rounded-t-lg"></div>
                    </div>
                  </div>
                  
                  {/* Sink - Realistic 3D */}
                  <div className="absolute top-[10%] right-[10%] w-[35%] h-[30%]" style={{ transform: 'translateZ(6px)' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100 border-2 border-gray-400 rounded-lg shadow-md">
                      {/* Basin */}
                      <div className="absolute inset-2 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-gray-300 rounded-lg">
                        {/* Drain */}
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-600 rounded-full"></div>
                      </div>
                      {/* Faucet */}
                      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-gradient-to-b from-gray-400 to-gray-600 rounded-t-full"></div>
                    </div>
                  </div>
                  
                  {/* Shower area - Realistic 3D */}
                  <div className="absolute bottom-[10%] left-[10%] right-[10%] h-[35%]" style={{ transform: 'translateZ(4px)' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-400 rounded-lg shadow-md">
                      {/* Shower head */}
                      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gradient-to-br from-gray-300 to-gray-500 border border-gray-600 rounded-full"></div>
                      {/* Water drops effect */}
                      <div className="absolute inset-0 opacity-30" style={{
                        backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(100,150,255,0.5) 0%, transparent 50%)'
                      }}></div>
                    </div>
                  </div>
                  
                  {/* Label */}
                  <div className="absolute bottom-1 right-1 text-[8px] font-bold text-blue-700 bg-white px-1 rounded border border-blue-300" style={{ transform: 'translateZ(10px)' }}>KM</div>
                </div>
                
                {/* 3D Sides */}
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-gray-300 to-gray-400 border-2 border-gray-600" style={{ transform: 'rotateY(-90deg)', transformOrigin: 'left center', width: '5px' }}></div>
                <div className="absolute top-0 right-0 h-full bg-gradient-to-l from-gray-300 to-gray-400 border-2 border-gray-600" style={{ transform: 'rotateY(90deg)', transformOrigin: 'right center', width: '5px' }}></div>
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-gray-400 to-gray-300 border-2 border-gray-600" style={{ transform: 'rotateX(-90deg)', transformOrigin: 'bottom center', height: '5px' }}></div>
                
                {/* Shadow */}
                <div className="absolute inset-0 bg-black opacity-20 blur-md" style={{ transform: 'translateZ(-2px) translateY(4px)' }}></div>
              </>
            ) : (
              <>
                {/* 2D Bathroom */}
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
              </>
            )}
            
            {/* Delete Button */}
            <DeleteButton />
          </div>
        );
      case 'door':
        return (
          <div key={element.id} style={is3DView ? { ...element3DStyle, border: 'none' } : { ...baseStyle, border: 'none' }} onClick={(e) => handleElementClick(element.id, e)} onMouseDown={(e) => handleElementDrag(e, element.id)}>
            {is3DView ? (
              <>
                {/* 3D Door - Vertical Standing Position */}
                <div className="absolute inset-0" style={{ transform: 'translateZ(8px)', transformStyle: 'preserve-3d' }}>
                  {/* Door Frame - Vertical */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-900 to-amber-800 border-2 border-amber-950 rounded-sm shadow-xl">
                    {/* Door Panel - Vertical */}
                    <div className="absolute inset-1 bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 border-2 border-amber-800 rounded-sm">
                      {/* Wood grain texture - vertical */}
                      <div className="absolute inset-0 opacity-30" style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(0,0,0,0.2) 4px, rgba(0,0,0,0.2) 8px)'
                      }}></div>
                      {/* Upper panel */}
                      <div className="absolute top-2 left-2 right-2 h-[35%] border-2 border-amber-700 rounded-sm bg-gradient-to-br from-amber-500 to-amber-600 opacity-80"></div>
                      {/* Lower panel */}
                      <div className="absolute bottom-2 left-2 right-2 h-[35%] border-2 border-amber-700 rounded-sm bg-gradient-to-br from-amber-500 to-amber-600 opacity-80"></div>
                      {/* Door Handle - Realistic */}
                      <div className="absolute top-[45%] left-2" style={{ transform: 'translateZ(3px)' }}>
                        <div className="w-2 h-4 bg-gradient-to-br from-gray-300 to-gray-600 border border-gray-700 rounded-full shadow-lg"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-800 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 3D Door Side - Thickness */}
                <div className="absolute top-0 left-0 h-full bg-gradient-to-l from-amber-900 to-amber-800 border-2 border-amber-950" style={{ transform: 'rotateY(-90deg)', transformOrigin: 'left center', width: '8px' }}></div>
                
                {/* Shadow */}
                <div className="absolute inset-0 bg-black opacity-20 blur-md" style={{ transform: 'translateZ(-2px) translateY(4px)' }}></div>
              </>
            ) : (
              <>
                {/* 2D Door - Vertical Standing */}
                <div className="absolute inset-0 border-2 border-gray-800 bg-amber-50">
                  <div className="absolute inset-0.5 bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-700">
                    {/* Door panels - vertical */}
                    <div className="absolute top-1 left-1 right-1 h-[35%] border border-amber-600 rounded-sm"></div>
                    <div className="absolute bottom-1 left-1 right-1 h-[35%] border border-amber-600 rounded-sm"></div>
                    {/* Door Handle - vertical position */}
                    <div className="absolute top-[45%] left-1 w-1.5 h-2 bg-gray-800 rounded-full"></div>
                  </div>
                </div>
              </>
            )}
            
            {/* Delete Button */}
            <DeleteButton />
          </div>
        );
      case 'window':
        return (
          <div key={element.id} style={is3DView ? element3DStyle : baseStyle} className="bg-gradient-to-br from-blue-100 to-blue-200" onClick={(e) => handleElementClick(element.id, e)} onMouseDown={(e) => handleElementDrag(e, element.id)}>
            {is3DView ? (
              <>
                {/* 3D Window - Realistic */}
                <div className="absolute inset-0" style={{ transform: 'translateZ(6px)', transformStyle: 'preserve-3d' }}>
                  {/* Window Frame */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800 border-2 border-gray-900 rounded-sm shadow-xl">
                    {/* Glass Panes - Realistic */}
                    <div className="absolute inset-1 grid grid-cols-2 gap-0.5">
                      <div className="bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 border border-gray-500 relative overflow-hidden">
                        {/* Glass reflection */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-30"></div>
                        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-white to-transparent opacity-20"></div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 border border-gray-500 relative overflow-hidden">
                        {/* Glass reflection */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-30"></div>
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white to-transparent opacity-20"></div>
                      </div>
                    </div>
                    {/* Window divider */}
                    <div className="absolute top-1 bottom-1 left-1/2 transform -translate-x-1/2 w-1 bg-gray-700"></div>
                    {/* Window sill */}
                    <div className="absolute -bottom-1 left-0 right-0 h-2 bg-gradient-to-b from-gray-600 to-gray-800 border-2 border-gray-900 rounded-b-sm shadow-lg"></div>
                  </div>
                </div>
                
                {/* 3D Window Side */}
                <div className="absolute top-0 right-0 h-full bg-gradient-to-l from-gray-700 to-gray-800 border-2 border-gray-900" style={{ transform: 'rotateY(90deg)', transformOrigin: 'right center', width: '6px' }}></div>
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-gray-700 to-gray-800 border-2 border-gray-900" style={{ transform: 'rotateX(-90deg)', transformOrigin: 'bottom center', height: '6px' }}></div>
                
                {/* Shadow */}
                <div className="absolute inset-0 bg-black opacity-20 blur-md" style={{ transform: 'translateZ(-2px) translateY(3px)' }}></div>
              </>
            ) : (
              <>
                {/* 2D Window */}
                <div className="absolute inset-0 border-2 border-gray-700">
                  <div className="absolute inset-0.5 grid grid-cols-2 gap-0.5">
                    <div className="bg-blue-200 border border-blue-400"></div>
                    <div className="bg-blue-200 border border-blue-400"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600"></div>
                </div>
              </>
            )}
            
            {/* Delete Button */}
            <DeleteButton />
          </div>
        );
      case 'nurse_call':
        return (
          <div key={element.id} style={{...baseStyle, borderRadius: '50%'}} className="bg-red-500" onClick={(e) => handleElementClick(element.id, e)} onMouseDown={(e) => handleElementDrag(e, element.id)}>
            {/* Nurse Call Button */}
            <div className="absolute inset-0 rounded-full border-2 border-red-700 bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full shadow-inner"></div>
            </div>
            {/* Label */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-[7px] font-bold text-red-700 whitespace-nowrap">CALL</div>
            
            {/* Delete Button */}
            <DeleteButton />
          </div>
        );
      case 'iv_stand':
        return (
          <div key={element.id} style={baseStyle} className="bg-transparent" onClick={(e) => handleElementClick(element.id, e)} onMouseDown={(e) => handleElementDrag(e, element.id)}>
            {/* IV Stand Pole */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-700"></div>
            {/* IV Stand Base */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-0.5 bg-gray-700"></div>
            {/* IV Bag */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-3 bg-blue-300 border border-blue-500 rounded-t-sm"></div>
            {/* Hook */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-1 bg-gray-700"></div>
            
            {/* Delete Button */}
            <DeleteButton />
          </div>
        );
      case 'monitor':
        return (
          <div key={element.id} style={baseStyle} className="bg-gray-900" onClick={(e) => handleElementClick(element.id, e)} onMouseDown={(e) => handleElementDrag(e, element.id)}>
            {/* Monitor Screen */}
            <div className="absolute inset-0.5 bg-black border border-gray-600 rounded-sm overflow-hidden">
              {/* Screen Content */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                {/* ECG Line */}
                <div className="w-full h-2 bg-transparent relative">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-green-500 transform -translate-y-1/2"></div>
                  <div className="absolute top-1/2 left-1/4 w-1 h-3 bg-green-500 transform -translate-y-1/2 -translate-x-1/2"></div>
                </div>
              </div>
              {/* Monitor Label */}
              <div className="absolute bottom-0.5 left-0.5 text-[6px] text-green-400 font-bold">MON</div>
            </div>
            {/* Monitor Stand */}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-gray-700"></div>
            
            {/* Delete Button */}
            <DeleteButton />
          </div>
        );
      case 'sofa':
        return (
          <div key={element.id} style={baseStyle} className="bg-gradient-to-br from-purple-100 to-purple-200" onClick={(e) => handleElementClick(element.id, e)} onMouseDown={(e) => handleElementDrag(e, element.id)}>
            {/* Sofa Back */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-purple-400 border-b border-purple-600"></div>
            {/* Sofa Seat */}
            <div className="absolute top-2 left-0.5 right-0.5 bottom-0.5 bg-purple-200 border border-purple-400 rounded-sm">
              {/* Cushions */}
              <div className="absolute inset-1 grid grid-cols-2 gap-0.5">
                <div className="bg-purple-100 border border-purple-300 rounded-sm"></div>
                <div className="bg-purple-100 border border-purple-300 rounded-sm"></div>
              </div>
            </div>
            
            {/* Delete Button */}
            <DeleteButton />
          </div>
        );
      case 'tv':
        return (
          <div key={element.id} style={baseStyle} className="bg-gray-900" onClick={(e) => handleElementClick(element.id, e)} onMouseDown={(e) => handleElementDrag(e, element.id)}>
            {/* TV Screen */}
            <div className="absolute inset-0.5 bg-black border border-gray-700 rounded-sm">
              {/* Screen Reflection */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-80"></div>
              {/* TV Label */}
              <div className="absolute bottom-0.5 right-0.5 text-[6px] text-gray-400">TV</div>
            </div>
            
            {/* Delete Button */}
            <DeleteButton />
          </div>
        );
      case 'wardrobe':
        return (
          <div key={element.id} style={baseStyle} className="bg-gradient-to-br from-amber-100 to-amber-200" onClick={(e) => handleElementClick(element.id, e)} onMouseDown={(e) => handleElementDrag(e, element.id)}>
            {/* Wardrobe Doors */}
            <div className="absolute inset-0 border-2 border-amber-700 grid grid-cols-2 gap-0.5 p-0.5">
              <div className="bg-amber-100 border border-amber-600 rounded-sm relative">
                <div className="absolute top-1/2 right-0.5 w-0.5 h-2 bg-amber-800 transform -translate-y-1/2"></div>
              </div>
              <div className="bg-amber-100 border border-amber-600 rounded-sm relative">
                <div className="absolute top-1/2 left-0.5 w-0.5 h-2 bg-amber-800 transform -translate-y-1/2"></div>
              </div>
            </div>
            
            {/* Delete Button */}
            <DeleteButton />
          </div>
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
          onClick={() => setActiveTab('editor')}
          className={`px-4 py-2 font-medium text-sm transition ${activeTab === 'editor' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-800'}`}
        >
          <i className="fas fa-edit mr-2"></i>Editor Denah
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2 font-medium text-sm transition ${activeTab === 'saved' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-800'}`}
        >
          <i className="fas fa-save mr-2"></i>Layout Tersimpan ({savedLayouts.length})
        </button>
      </div>

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
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg mb-2">
                    <p className="text-xs text-blue-700 font-medium">
                      <i className="fas fa-check-circle mr-1"></i>
                      Elemen terpilih
                    </p>
                  </div>
                  <button
                    onClick={handleRotateElement}
                    className="w-full px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                    title="Shortcut: R"
                  >
                    <i className="fas fa-rotate-right mr-2"></i>Rotasi 90°
                    <span className="ml-2 text-xs opacity-60">(R)</span>
                  </button>
                  <button
                    onClick={() => handleDeleteElement()}
                    className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                    title="Shortcut: Delete"
                  >
                    <i className="fas fa-trash mr-2"></i>Hapus
                    <span className="ml-2 text-xs opacity-60">(Del)</span>
                  </button>
                </div>
              ) : (
                <div className="text-xs text-gray-500 space-y-1">
                  <p><i className="fas fa-info-circle mr-1 text-indigo-500"></i>Klik elemen untuk memilih</p>
                  <p className="text-[10px] text-gray-400 mt-2">
                    <strong>Shortcuts:</strong><br/>
                    • Delete/Backspace: Hapus elemen<br/>
                    • R: Rotasi 90°<br/>
                    • Esc: Batal pilih
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-3 space-y-3">
            <div className="bg-white rounded-xl border-2 border-gray-300 shadow-lg">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-3 border-b-2 border-gray-300 flex items-center justify-between">
                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                  <i className="fas fa-drafting-compass text-indigo-600"></i>
                  Canvas Denah Kamar
                </h4>
                <div className="flex gap-2 items-center">
                  {/* 3D View Toggle */}
                  <button
                    onClick={() => setIs3DView(!is3DView)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                      is3DView 
                        ? 'bg-purple-600 text-white shadow-md' 
                        : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-purple-400'
                    }`}
                    title="Toggle 3D View"
                  >
                    <i className={`fas ${is3DView ? 'fa-cube' : 'fa-square'} mr-2`}></i>
                    {is3DView ? '3D' : '2D'}
                  </button>
                  
                  <input
                    type="text"
                    placeholder="Nama Layout"
                    value={layoutName}
                    onChange={(e) => {
                      e.stopPropagation();
                      setLayoutName(e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm font-medium focus:border-indigo-500 focus:outline-none cursor-text"
                  />
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm font-medium focus:border-indigo-500 focus:outline-none"
                  >
                    <option>Reguler</option>
                    <option>VIP</option>
                    <option>ICU</option>
                    <option>NICU</option>
                    <option>HCU</option>
                  </select>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleSaveLayout();
                    }}
                    className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 shadow-md cursor-pointer transition-all active:scale-95 z-50 relative"
                  >
                    <i className="fas fa-save mr-2"></i>Simpan
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div
                  className="relative w-full h-[500px] bg-white border-4 border-gray-800 rounded-lg overflow-hidden shadow-xl"
                  onDrop={handleCanvasDrop}
                  onDragOver={handleDragOver}
                  onClick={handleCanvasClick}
                  style={{
                    perspective: is3DView ? '1000px' : 'none',
                    perspectiveOrigin: 'center center',
                    backgroundImage: `
                      linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px),
                      linear-gradient(to right, rgba(0,0,0,0.15) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(0,0,0,0.15) 1px, transparent 1px)
                    `,
                    backgroundSize: '10px 10px, 10px 10px, 50px 50px, 50px 50px'
                  }}
                >
                {/* Scale Indicator */}
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded shadow text-[10px] font-bold text-gray-700 border border-gray-400 z-10">
                  Skala 1:50 • Grid 10px
                </div>

                {/* Dimension Lines - Top */}
                <div className="absolute top-0 left-0 right-0 h-6 flex items-center justify-center pointer-events-none">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-0.5 bg-gray-600"></div>
                    <div className="flex-1 h-0.5 bg-gray-600 relative">
                      <div className="absolute left-0 top-0 w-0.5 h-2 bg-gray-600 -translate-y-1"></div>
                      <div className="absolute right-0 top-0 w-0.5 h-2 bg-gray-600 -translate-y-1"></div>
                    </div>
                    <div className="w-2 h-0.5 bg-gray-600"></div>
                    <span className="text-[9px] font-bold text-gray-700 bg-white px-1">4.0m</span>
                  </div>
                </div>

                {/* Dimension Lines - Left */}
                <div className="absolute top-0 left-0 bottom-0 w-6 flex items-center justify-center pointer-events-none">
                  <div className="flex flex-col items-center gap-1 h-full justify-center">
                    <div className="h-2 w-0.5 bg-gray-600"></div>
                    <div className="flex-1 w-0.5 bg-gray-600 relative">
                      <div className="absolute top-0 left-0 h-0.5 w-2 bg-gray-600 -translate-x-1"></div>
                      <div className="absolute bottom-0 left-0 h-0.5 w-2 bg-gray-600 -translate-x-1"></div>
                    </div>
                    <div className="h-2 w-0.5 bg-gray-600"></div>
                    <span className="text-[9px] font-bold text-gray-700 bg-white px-1 -rotate-90">3.5m</span>
                  </div>
                </div>

                {/* Elements */}
                {editorLayout.elements.map(element => renderElement(element, selectedElement === element.id))}

                {/* Empty State */}
                {editorLayout.elements.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
                    <div className="text-center">
                      <i className="fas fa-mouse-pointer text-4xl mb-2"></i>
                      <p className="text-sm">Drag elemen dari toolbox ke sini</p>
                    </div>
                  </div>
                )}
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 border-t-2 border-gray-300">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <i className="fas fa-info-circle text-indigo-500"></i>
                      <span>Drag elemen dari toolbox atau aktifkan "Mode Klik" untuk tempatkan dengan klik</span>
                    </span>
                    {is3DView && (
                      <span className="flex items-center gap-1 text-purple-600 font-medium">
                        <i className="fas fa-cube"></i>
                        <span>Mode 3D Aktif</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 border border-gray-600 bg-white"></div>
                      <span>Bed</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 border border-blue-400 bg-blue-50"></div>
                      <span>KM</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 border border-amber-700 bg-amber-50"></div>
                      <span>Pintu</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Layouts Tab */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          {/* 3D Toggle for Saved Layouts */}
          <div className="flex items-center justify-between bg-white rounded-lg border-2 border-gray-200 p-3">
            <div className="flex items-center gap-2">
              <i className="fas fa-cube text-purple-600"></i>
              <span className="text-sm font-medium text-gray-700">Tampilan 3D untuk Bed</span>
            </div>
            <button
              onClick={() => setIs3DView(!is3DView)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                is3DView 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <i className={`fas ${is3DView ? 'fa-cube' : 'fa-square'} mr-2`}></i>
              {is3DView ? '3D View' : '2D View'}
            </button>
          </div>

          {savedLayouts.length === 0 ? (
            <div className="bg-white rounded-xl border p-12 text-center">
              <i className="fas fa-folder-open text-4xl text-gray-300 mb-3"></i>
              <p className="text-gray-500">Belum ada layout yang disimpan</p>
              <p className="text-sm text-gray-400 mt-1">Buat layout baru di tab "Drag & Drop Editor"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedLayouts.map(layout => {
                // Calculate optimal scale based on content
                const bedCount = layout.elements.filter(e => e.type === 'bed').length;
                const hasBathroom = layout.elements.some(e => e.type === 'bathroom');
                
                // Calculate bounds
                const maxX = Math.max(...layout.elements.map(e => e.x + e.width));
                const maxY = Math.max(...layout.elements.map(e => e.y + e.height));
                
                // Preview container size
                const previewWidth = 280;
                const previewHeight = 180;
                
                // Calculate scale to fit content with padding
                const scaleX = (previewWidth - 20) / maxX;
                const scaleY = (previewHeight - 20) / maxY;
                const scale = Math.min(scaleX, scaleY, 0.6);

                return (
                  <div key={layout.id} className="bg-white rounded-xl border-2 border-gray-200 p-4 hover:border-indigo-300 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-800">{layout.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        layout.roomType === 'ICU' ? 'bg-red-100 text-red-700' :
                        layout.roomType === 'VIP' ? 'bg-purple-100 text-purple-700' :
                        layout.roomType === 'HCU' ? 'bg-orange-100 text-orange-700' :
                        layout.roomType === 'NICU' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {layout.roomType}
                      </span>
                    </div>
                    
                    {/* Mini Preview - Architectural Style */}
                    <div className="mb-3">
                      {renderArchitecturalPreview(layout.elements, previewWidth, previewHeight, scale)}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <i className="fas fa-bed text-gray-500"></i>
                          <span className="font-medium">{bedCount} Bed</span>
                        </span>
                        {hasBathroom && (
                          <span className="flex items-center gap-1">
                            <i className="fas fa-bath text-blue-500"></i>
                            <span className="font-medium">KM</span>
                          </span>
                        )}
                        {layout.elements.some(e => e.type === 'monitor') && (
                          <span className="flex items-center gap-1">
                            <i className="fas fa-tv text-gray-500"></i>
                            <span className="font-medium">Monitor</span>
                          </span>
                        )}
                      </div>
                      <span className="text-gray-500">{new Date(layout.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditorLayout(layout);
                          setLayoutName(layout.name);
                          setRoomType(layout.roomType);
                          setActiveTab('editor');
                        }}
                        className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-200 transition-colors"
                      >
                        <i className="fas fa-edit mr-1"></i>Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Hapus layout ini?')) {
                            setSavedLayouts(savedLayouts.filter(l => l.id !== layout.id));
                          }
                        }}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
