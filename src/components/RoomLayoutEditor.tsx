import { useState, useEffect } from 'react';

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

// Preset Layouts - Standar Rumah Sakit Indonesia
const presetLayouts: RoomLayout[] = [
  // ===== KELAS 1 (VIP) =====
  {
    id: 'preset-vip-1bed',
    name: 'Kelas 1 - VIP 1 Bed',
    roomType: 'VIP',
    isPreset: true,
    createdAt: '2026-01-01',
    elements: [
      { id: 'bed-1', type: 'bed', x: 40, y: 60, width: 80, height: 120, label: 'A' },
      { id: 'sofa-1', type: 'sofa', x: 160, y: 60, width: 70, height: 35 },
      { id: 'tv-1', type: 'tv', x: 180, y: 20, width: 50, height: 10 },
      { id: 'bathroom-1', type: 'bathroom', x: 210, y: 220, width: 70, height: 70 },
      { id: 'wardrobe-1', type: 'wardrobe', x: 210, y: 120, width: 30, height: 80 },
      { id: 'door-1', type: 'door', x: 130, y: 320, width: 60, height: 15 },
      { id: 'window-1', type: 'window', x: 10, y: 100, width: 15, height: 90 },
      { id: 'nurse-call-1', type: 'nurse_call', x: 90, y: 45, width: 15, height: 15 },
    ]
  },
  
  // ===== KELAS 2 (UTAMA) =====
  {
    id: 'preset-class2-1bed',
    name: 'Kelas 2 - Utama 1 Bed',
    roomType: 'Reguler',
    isPreset: true,
    createdAt: '2026-01-01',
    elements: [
      { id: 'bed-1', type: 'bed', x: 40, y: 60, width: 75, height: 115, label: 'A' },
      { id: 'bathroom-1', type: 'bathroom', x: 210, y: 40, width: 70, height: 70 },
      { id: 'wardrobe-1', type: 'wardrobe', x: 210, y: 130, width: 30, height: 70 },
      { id: 'door-1', type: 'door', x: 130, y: 320, width: 60, height: 15 },
      { id: 'window-1', type: 'window', x: 10, y: 110, width: 15, height: 80 },
      { id: 'nurse-call-1', type: 'nurse_call', x: 85, y: 45, width: 15, height: 15 },
    ]
  },
  
  // ===== KELAS 3 (STANDAR) =====
  {
    id: 'preset-class3-2bed',
    name: 'Kelas 3 - Standar 2 Bed',
    roomType: 'Reguler',
    isPreset: true,
    createdAt: '2026-01-01',
    elements: [
      { id: 'bed-1', type: 'bed', x: 30, y: 60, width: 70, height: 110, label: 'A' },
      { id: 'bed-2', type: 'bed', x: 120, y: 60, width: 70, height: 110, label: 'B' },
      { id: 'bathroom-1', type: 'bathroom', x: 210, y: 40, width: 70, height: 70 },
      { id: 'door-1', type: 'door', x: 130, y: 320, width: 60, height: 15 },
      { id: 'window-1', type: 'window', x: 10, y: 120, width: 15, height: 70 },
      { id: 'nurse-call-1', type: 'nurse_call', x: 70, y: 45, width: 15, height: 15 },
      { id: 'nurse-call-2', type: 'nurse_call', x: 160, y: 45, width: 15, height: 15 },
    ]
  },
  
  {
    id: 'preset-class3-3bed',
    name: 'Kelas 3 - Standar 3 Bed',
    roomType: 'Reguler',
    isPreset: true,
    createdAt: '2026-01-01',
    elements: [
      { id: 'bed-1', type: 'bed', x: 20, y: 60, width: 65, height: 105, label: 'A' },
      { id: 'bed-2', type: 'bed', x: 100, y: 60, width: 65, height: 105, label: 'B' },
      { id: 'bed-3', type: 'bed', x: 180, y: 60, width: 65, height: 105, label: 'C' },
      { id: 'bathroom-1', type: 'bathroom', x: 210, y: 220, width: 70, height: 70 },
      { id: 'door-1', type: 'door', x: 130, y: 320, width: 60, height: 15 },
      { id: 'window-1', type: 'window', x: 10, y: 120, width: 15, height: 70 },
      { id: 'nurse-call-1', type: 'nurse_call', x: 55, y: 45, width: 15, height: 15 },
      { id: 'nurse-call-2', type: 'nurse_call', x: 135, y: 45, width: 15, height: 15 },
      { id: 'nurse-call-3', type: 'nurse_call', x: 215, y: 45, width: 15, height: 15 },
    ]
  },
  
  {
    id: 'preset-class3-4bed',
    name: 'Kelas 3 - Standar 4 Bed',
    roomType: 'Reguler',
    isPreset: true,
    createdAt: '2026-01-01',
    elements: [
      { id: 'bed-1', type: 'bed', x: 20, y: 50, width: 60, height: 100, label: 'A' },
      { id: 'bed-2', type: 'bed', x: 95, y: 50, width: 60, height: 100, label: 'B' },
      { id: 'bed-3', type: 'bed', x: 20, y: 170, width: 60, height: 100, label: 'C' },
      { id: 'bed-4', type: 'bed', x: 95, y: 170, width: 60, height: 100, label: 'D' },
      { id: 'bathroom-1', type: 'bathroom', x: 210, y: 40, width: 70, height: 70 },
      { id: 'door-1', type: 'door', x: 130, y: 320, width: 60, height: 15 },
      { id: 'window-1', type: 'window', x: 10, y: 120, width: 15, height: 70 },
      { id: 'nurse-call-1', type: 'nurse_call', x: 50, y: 35, width: 15, height: 15 },
      { id: 'nurse-call-2', type: 'nurse_call', x: 125, y: 35, width: 15, height: 15 },
      { id: 'nurse-call-3', type: 'nurse_call', x: 50, y: 155, width: 15, height: 15 },
      { id: 'nurse-call-4', type: 'nurse_call', x: 125, y: 155, width: 15, height: 15 },
    ]
  },
  
  // ===== ICU =====
  {
    id: 'preset-icu-1bed',
    name: 'ICU - Critical Care 1 Bed',
    roomType: 'ICU',
    isPreset: true,
    createdAt: '2026-01-01',
    elements: [
      { id: 'bed-1', type: 'bed', x: 80, y: 80, width: 80, height: 120, label: 'A' },
      { id: 'monitor-1', type: 'monitor', x: 180, y: 90, width: 45, height: 55 },
      { id: 'iv-stand-1', type: 'iv_stand', x: 170, y: 70, width: 10, height: 40 },
      { id: 'iv-stand-2', type: 'iv_stand', x: 70, y: 70, width: 10, height: 40 },
      { id: 'bathroom-1', type: 'bathroom', x: 210, y: 220, width: 70, height: 70 },
      { id: 'door-1', type: 'door', x: 130, y: 320, width: 60, height: 15 },
      { id: 'window-1', type: 'window', x: 10, y: 100, width: 15, height: 90 },
      { id: 'nurse-call-1', type: 'nurse_call', x: 120, y: 65, width: 15, height: 15 },
    ]
  },
  
  // ===== NICU =====
  {
    id: 'preset-nicu-incubator',
    name: 'NICU - Neonatal Incubator',
    roomType: 'NICU',
    isPreset: true,
    createdAt: '2026-01-01',
    elements: [
      { id: 'bed-1', type: 'bed', x: 90, y: 100, width: 70, height: 90, label: 'A' },
      { id: 'monitor-1', type: 'monitor', x: 180, y: 100, width: 50, height: 60 },
      { id: 'iv-stand-1', type: 'iv_stand', x: 170, y: 80, width: 10, height: 40 },
      { id: 'iv-stand-2', type: 'iv_stand', x: 80, y: 80, width: 10, height: 40 },
      { id: 'door-1', type: 'door', x: 130, y: 320, width: 60, height: 15 },
      { id: 'window-1', type: 'window', x: 10, y: 120, width: 15, height: 80 },
      { id: 'nurse-call-1', type: 'nurse_call', x: 125, y: 85, width: 15, height: 15 },
    ]
  },
  
  // ===== HCU =====
  {
    id: 'preset-hcu-1bed',
    name: 'HCU - High Care Unit',
    roomType: 'HCU',
    isPreset: true,
    createdAt: '2026-01-01',
    elements: [
      { id: 'bed-1', type: 'bed', x: 80, y: 90, width: 75, height: 115, label: 'A' },
      { id: 'monitor-1', type: 'monitor', x: 175, y: 100, width: 45, height: 55 },
      { id: 'iv-stand-1', type: 'iv_stand', x: 165, y: 80, width: 10, height: 40 },
      { id: 'bathroom-1', type: 'bathroom', x: 210, y: 220, width: 70, height: 70 },
      { id: 'door-1', type: 'door', x: 130, y: 320, width: 60, height: 15 },
      { id: 'window-1', type: 'window', x: 10, y: 110, width: 15, height: 80 },
      { id: 'nurse-call-1', type: 'nurse_call', x: 115, y: 75, width: 15, height: 15 },
    ]
  },
  
  // ===== ISOLASI =====
  {
    id: 'preset-isolation-1bed',
    name: 'Kamar Isolasi - Negative Pressure',
    roomType: 'Reguler',
    isPreset: true,
    createdAt: '2026-01-01',
    elements: [
      { id: 'bed-1', type: 'bed', x: 80, y: 90, width: 75, height: 115, label: 'A' },
      { id: 'bathroom-1', type: 'bathroom', x: 210, y: 40, width: 70, height: 70 },
      { id: 'door-1', type: 'door', x: 130, y: 320, width: 60, height: 15 },
      { id: 'window-1', type: 'window', x: 10, y: 110, width: 15, height: 80 },
      { id: 'nurse-call-1', type: 'nurse_call', x: 115, y: 75, width: 15, height: 15 },
    ]
  },
  {
    id: 'preset-reguler-2',
    name: 'Reguler 2 Bed',
    roomType: 'Reguler',
    isPreset: true,
    createdAt: '2026-01-01',
    elements: [
      { id: 'bed-1', type: 'bed', x: 30, y: 50, width: 70, height: 110, label: 'A' },
      { id: 'bed-2', type: 'bed', x: 120, y: 50, width: 70, height: 110, label: 'B' },
      { id: 'bathroom-1', type: 'bathroom', x: 220, y: 30, width: 70, height: 70 },
      { id: 'door-1', type: 'door', x: 150, y: 320, width: 60, height: 15 },
      { id: 'window-1', type: 'window', x: 10, y: 120, width: 15, height: 70 },
      { id: 'nurse-call-1', type: 'nurse_call', x: 65, y: 40, width: 15, height: 15 },
      { id: 'nurse-call-2', type: 'nurse_call', x: 155, y: 40, width: 15, height: 15 },
    ]
  },
  {
    id: 'preset-icu',
    name: 'ICU Critical Care',
    roomType: 'ICU',
    isPreset: true,
    createdAt: '2026-01-01',
    elements: [
      { id: 'bed-1', type: 'bed', x: 80, y: 80, width: 80, height: 120, label: 'A' },
      { id: 'iv-stand-1', type: 'iv_stand', x: 170, y: 70, width: 10, height: 40 },
      { id: 'iv-stand-2', type: 'iv_stand', x: 70, y: 70, width: 10, height: 40 },
      { id: 'monitor-1', type: 'monitor', x: 190, y: 100, width: 50, height: 60 },
      { id: 'bathroom-1', type: 'bathroom', x: 220, y: 220, width: 70, height: 70 },
      { id: 'door-1', type: 'door', x: 150, y: 320, width: 60, height: 15 },
      { id: 'window-1', type: 'window', x: 10, y: 100, width: 15, height: 90 },
      { id: 'nurse-call-1', type: 'nurse_call', x: 120, y: 60, width: 15, height: 15 },
    ]
  },
  {
    id: 'preset-vip',
    name: 'VIP Suite Deluxe',
    roomType: 'VIP',
    isPreset: true,
    createdAt: '2026-01-01',
    elements: [
      { id: 'bed-1', type: 'bed', x: 50, y: 80, width: 90, height: 130, label: 'A' },
      { id: 'sofa-1', type: 'sofa', x: 180, y: 60, width: 80, height: 40 },
      { id: 'tv-1', type: 'tv', x: 200, y: 20, width: 60, height: 12 },
      { id: 'bathroom-1', type: 'bathroom', x: 220, y: 220, width: 70, height: 70 },
      { id: 'door-1', type: 'door', x: 150, y: 320, width: 60, height: 15 },
      { id: 'window-1', type: 'window', x: 10, y: 100, width: 15, height: 100 },
      { id: 'wardrobe-1', type: 'wardrobe', x: 220, y: 130, width: 35, height: 70 },
      { id: 'nurse-call-1', type: 'nurse_call', x: 100, y: 60, width: 15, height: 15 },
    ]
  },
  {
    id: 'preset-hcu',
    name: 'HCU High Care',
    roomType: 'HCU',
    isPreset: true,
    createdAt: '2026-01-01',
    elements: [
      { id: 'bed-1', type: 'bed', x: 90, y: 90, width: 80, height: 120, label: 'A' },
      { id: 'monitor-1', type: 'monitor', x: 190, y: 110, width: 50, height: 60 },
      { id: 'iv-stand-1', type: 'iv_stand', x: 180, y: 80, width: 10, height: 40 },
      { id: 'door-1', type: 'door', x: 150, y: 320, width: 60, height: 15 },
      { id: 'window-1', type: 'window', x: 10, y: 120, width: 15, height: 80 },
      { id: 'nurse-call-1', type: 'nurse_call', x: 130, y: 70, width: 15, height: 15 },
    ]
  },
  {
    id: 'preset-nicu',
    name: 'NICU Neonatal',
    roomType: 'NICU',
    isPreset: true,
    createdAt: '2026-01-01',
    elements: [
      { id: 'bed-1', type: 'bed', x: 100, y: 100, width: 70, height: 90, label: 'A' },
      { id: 'monitor-1', type: 'monitor', x: 190, y: 100, width: 50, height: 60 },
      { id: 'iv-stand-1', type: 'iv_stand', x: 180, y: 80, width: 10, height: 40 },
      { id: 'iv-stand-2', type: 'iv_stand', x: 90, y: 80, width: 10, height: 40 },
      { id: 'door-1', type: 'door', x: 150, y: 320, width: 60, height: 15 },
      { id: 'window-1', type: 'window', x: 10, y: 120, width: 15, height: 80 },
      { id: 'nurse-call-1', type: 'nurse_call', x: 135, y: 80, width: 15, height: 15 },
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
  const [is3DView, setIs3DView] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [imageOpacity, setImageOpacity] = useState(0.3);
  const [showImage, setShowImage] = useState(true);
  const [clickMode, setClickMode] = useState<string | null>(null); // Which element type to place on click
  const [clickCount, setClickCount] = useState(0); // For labeling beds A, B, C...

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

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If in click-to-place mode, add element at click position
    if (clickMode) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const item = toolboxItems.find(i => i.type === clickMode);
      if (!item) return;

      const GRID_SIZE = 10;
      const snappedX = Math.round((x - item.defaultWidth / 2) / GRID_SIZE) * GRID_SIZE;
      const snappedY = Math.round((y - item.defaultHeight / 2) / GRID_SIZE) * GRID_SIZE;

      let label: string | undefined;
      if (clickMode === 'bed') {
        const bedCount = editorLayout.elements.filter(e => e.type === 'bed').length;
        label = String.fromCharCode(65 + bedCount);
      }

      const newElement: LayoutElement = {
        id: `${clickMode}-${Date.now()}`,
        type: clickMode as any,
        x: Math.max(0, snappedX),
        y: Math.max(0, snappedY),
        width: item.defaultWidth,
        height: item.defaultHeight,
        label,
      };

      setEditorLayout({
        ...editorLayout,
        elements: [...editorLayout.elements, newElement],
      });
      return;
    }
    
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
  const handleDeleteElement = () => {
    if (!selectedElement) {
      alert('Silakan pilih elemen yang ingin dihapus terlebih dahulu');
      return;
    }

    const elementToDelete = editorLayout.elements.find(el => el.id === selectedElement);
    if (!elementToDelete) return;

    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus ${elementToDelete.type} ini?`
    );

    if (confirmDelete) {
      setEditorLayout({
        ...editorLayout,
        elements: editorLayout.elements.filter(el => el.id !== selectedElement),
      });
      setSelectedElement(null);
    }
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

  // Render architectural mini preview for saved/preset layouts
  const renderArchitecturalPreview = (elements: LayoutElement[], previewWidth: number, previewHeight: number, scale: number) => {
    return (
      <div 
        className="relative bg-white border-[3px] border-gray-800 rounded-sm overflow-hidden mx-auto"
        style={{ 
          width: `${previewWidth}px`, 
          height: `${previewHeight}px`,
        }}
      >
        {/* Floor pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(139,92,246,0.05) 8px, rgba(139,92,246,0.05) 9px)
            `
          }}
        ></div>

        {/* Windows on walls */}
        {elements.filter(e => e.type === 'window').map((element, idx) => (
          <div
            key={`win-${idx}`}
            className="absolute"
            style={{
              left: `${element.x * scale}px`,
              top: `${element.y * scale}px`,
              width: `${element.width * scale}px`,
              height: `${element.height * scale}px`,
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-cyan-200 to-blue-300 border-2 border-gray-700 relative">
              <div className="absolute inset-0 grid grid-cols-2 gap-px">
                <div className="bg-cyan-100 border border-cyan-400"></div>
                <div className="bg-cyan-100 border border-cyan-400"></div>
              </div>
              {/* Window sill */}
              <div className="absolute -bottom-0.5 left-0 right-0 h-1 bg-gray-600"></div>
            </div>
          </div>
        ))}

        {/* Bathroom with architectural details */}
        {elements.filter(e => e.type === 'bathroom').map((element, idx) => (
          <div
            key={`bath-${idx}`}
            className="absolute"
            style={{
              left: `${element.x * scale}px`,
              top: `${element.y * scale}px`,
              width: `${element.width * scale}px`,
              height: `${element.height * scale}px`,
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-gray-700 relative overflow-hidden">
              {/* Tile pattern */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `
                  linear-gradient(to right, #000 1px, transparent 1px),
                  linear-gradient(to bottom, #000 1px, transparent 1px)
                `,
                backgroundSize: '8px 8px'
              }}></div>
              
              {/* Toilet */}
              <div className="absolute top-1 left-1" style={{ width: `${element.width * scale * 0.3}px`, height: `${element.height * scale * 0.35}px` }}>
                <div className="w-full h-full bg-white border-2 border-gray-600 rounded-t-full relative">
                  <div className="absolute top-0.5 left-0.5 right-0.5 h-1.5 bg-blue-200 rounded-t-full"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300"></div>
                </div>
              </div>
              
              {/* Sink */}
              <div className="absolute top-1 right-1" style={{ width: `${element.width * scale * 0.25}px`, height: `${element.height * scale * 0.2}px` }}>
                <div className="w-full h-full bg-white border-2 border-gray-600 rounded-sm relative">
                  <div className="absolute top-0.5 left-1/2 w-0.5 h-1 bg-gray-500 transform -translate-x-1/2"></div>
                </div>
              </div>
              
              {/* Shower area */}
              <div className="absolute bottom-1 left-1 right-1" style={{ height: `${element.height * scale * 0.3}px` }}>
                <div className="w-full h-full bg-blue-100 border border-blue-400 rounded-sm relative">
                  <div className="absolute top-0.5 left-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full transform -translate-x-1/2"></div>
                </div>
              </div>
              
              {/* KM Label */}
              <div className="absolute bottom-0.5 right-0.5 text-[7px] font-black text-blue-800 bg-white px-0.5 rounded-sm border border-blue-300">
                KM
              </div>
            </div>
          </div>
        ))}

        {/* Beds with architectural details */}
        {elements.filter(e => e.type === 'bed').map((element, idx) => (
          <div
            key={`bed-${idx}`}
            className="absolute"
            style={{
              left: `${element.x * scale}px`,
              top: `${element.y * scale}px`,
              width: `${element.width * scale}px`,
              height: `${element.height * scale}px`,
              transform: `rotate(${element.rotation || 0}deg)`,
            }}
          >
            <div className="w-full h-full bg-white border-2 border-gray-800 relative shadow-md">
              {/* Headboard */}
              <div className="absolute top-0 left-0 right-0 h-[12%] bg-gradient-to-b from-amber-800 to-amber-900 border-b-2 border-amber-950"></div>
              
              {/* Pillow */}
              <div className="absolute left-[8%] right-[8%] top-[14%] h-[12%] bg-white border-2 border-gray-400 rounded-sm shadow-sm">
                <div className="absolute inset-0.5 bg-gradient-to-br from-white to-gray-50 rounded-sm"></div>
              </div>
              
              {/* Mattress */}
              <div className="absolute left-[5%] right-[5%] top-[28%] bottom-[12%] bg-gradient-to-br from-white to-gray-50 border border-gray-300 rounded-sm">
                {/* Sheet fold */}
                <div className="absolute top-0 left-0 right-0 h-[30%] bg-gradient-to-b from-blue-50 to-white border-b border-blue-100"></div>
              </div>
              
              {/* Blanket */}
              <div className="absolute left-[5%] right-[5%] bottom-[12%] h-[35%] bg-gradient-to-t from-indigo-100 to-indigo-50 border border-indigo-200 rounded-sm">
                <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-200"></div>
              </div>
              
              {/* Footboard */}
              <div className="absolute bottom-0 left-0 right-0 h-[8%] bg-gradient-to-t from-amber-800 to-amber-900 border-t-2 border-amber-950"></div>
              
              {/* Bed Label */}
              {element.label && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white px-1.5 py-0.5 rounded text-[8px] font-black text-gray-800 border-2 border-gray-700 shadow-sm z-10">
                  {element.label}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Doors with swing arc */}
        {elements.filter(e => e.type === 'door').map((element, idx) => (
          <div
            key={`door-${idx}`}
            className="absolute"
            style={{
              left: `${element.x * scale}px`,
              top: `${element.y * scale}px`,
              width: `${element.width * scale}px`,
              height: `${element.height * scale + 30}px`,
              transform: `rotate(${element.rotation || 0}deg)`,
            }}
          >
            {/* Door swing arc */}
            <div 
              className="absolute bottom-0 left-0 border-2 border-dashed border-gray-500 rounded-tl-full opacity-50"
              style={{ 
                width: `${element.width * scale}px`, 
                height: `${element.width * scale}px`,
              }}
            ></div>
            
            {/* Door frame */}
            <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-r from-amber-100 to-amber-200 border-2 border-gray-800">
              {/* Door panel */}
              <div className="absolute inset-0.5 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-600">
                {/* Door handle */}
                <div className="absolute top-1/2 right-1 w-1 h-1 bg-gray-800 rounded-full transform -translate-y-1/2"></div>
                {/* Panel lines */}
                <div className="absolute top-1 left-1 right-1 bottom-1 border border-amber-400 rounded-sm"></div>
              </div>
            </div>
          </div>
        ))}

        {/* Nurse call buttons */}
        {elements.filter(e => e.type === 'nurse_call').map((element, idx) => (
          <div
            key={`call-${idx}`}
            className="absolute"
            style={{
              left: `${element.x * scale}px`,
              top: `${element.y * scale}px`,
              width: `${element.width * scale}px`,
              height: `${element.height * scale}px`,
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-red-400 to-red-600 border-2 border-red-800 rounded-full shadow-lg relative">
              <div className="absolute inset-1 bg-gradient-to-br from-red-300 to-red-500 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        ))}

        {/* Monitors */}
        {elements.filter(e => e.type === 'monitor').map((element, idx) => (
          <div
            key={`mon-${idx}`}
            className="absolute"
            style={{
              left: `${element.x * scale}px`,
              top: `${element.y * scale}px`,
              width: `${element.width * scale}px`,
              height: `${element.height * scale}px`,
            }}
          >
            <div className="w-full h-full bg-gray-900 border-2 border-gray-800 rounded-sm shadow-lg relative overflow-hidden">
              {/* Screen */}
              <div className="absolute inset-0.5 bg-black rounded-sm">
                {/* ECG line */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                  <path d="M0,25 L20,25 L25,10 L30,40 L35,25 L100,25" stroke="#00ff00" strokeWidth="1" fill="none"/>
                </svg>
                {/* Vitals */}
                <div className="absolute top-0.5 right-0.5 text-[6px] text-green-400 font-bold">88</div>
                <div className="absolute bottom-0.5 left-0.5 text-[6px] text-cyan-400 font-bold">98%</div>
              </div>
              {/* Stand */}
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-gray-700"></div>
            </div>
          </div>
        ))}

        {/* IV Stands */}
        {elements.filter(e => e.type === 'iv_stand').map((element, idx) => (
          <div
            key={`iv-${idx}`}
            className="absolute"
            style={{
              left: `${element.x * scale}px`,
              top: `${element.y * scale}px`,
              width: `${element.width * scale}px`,
              height: `${element.height * scale}px`,
            }}
          >
            <div className="w-full h-full relative">
              {/* Pole */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-700"></div>
              {/* Base */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-0.5 bg-gray-700 rounded-full"></div>
              {/* IV Bag */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-3 bg-gradient-to-b from-blue-200 to-blue-400 border border-blue-500 rounded-t-sm">
                <div className="absolute top-0.5 left-0.5 right-0.5 h-0.5 bg-blue-300"></div>
              </div>
            </div>
          </div>
        ))}

        {/* Sofas */}
        {elements.filter(e => e.type === 'sofa').map((element, idx) => (
          <div
            key={`sofa-${idx}`}
            className="absolute"
            style={{
              left: `${element.x * scale}px`,
              top: `${element.y * scale}px`,
              width: `${element.width * scale}px`,
              height: `${element.height * scale}px`,
            }}
          >
            <div className="w-full h-full relative">
              {/* Back */}
              <div className="absolute top-0 left-0 right-0 h-[30%] bg-gradient-to-b from-purple-400 to-purple-500 border-2 border-purple-700 rounded-t-sm"></div>
              {/* Seat */}
              <div className="absolute top-[30%] left-0 right-0 bottom-0 bg-gradient-to-b from-purple-200 to-purple-300 border-2 border-purple-600 rounded-b-sm">
                {/* Cushions */}
                <div className="absolute inset-1 grid grid-cols-2 gap-0.5">
                  <div className="bg-purple-100 border border-purple-400 rounded-sm"></div>
                  <div className="bg-purple-100 border border-purple-400 rounded-sm"></div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* TVs */}
        {elements.filter(e => e.type === 'tv').map((element, idx) => (
          <div
            key={`tv-${idx}`}
            className="absolute"
            style={{
              left: `${element.x * scale}px`,
              top: `${element.y * scale}px`,
              width: `${element.width * scale}px`,
              height: `${element.height * scale}px`,
            }}
          >
            <div className="w-full h-full bg-black border-2 border-gray-900 rounded-sm shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-900/10 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700"></div>
            </div>
          </div>
        ))}

        {/* Wardrobes */}
        {elements.filter(e => e.type === 'wardrobe').map((element, idx) => (
          <div
            key={`ward-${idx}`}
            className="absolute"
            style={{
              left: `${element.x * scale}px`,
              top: `${element.y * scale}px`,
              width: `${element.width * scale}px`,
              height: `${element.height * scale}px`,
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-800 rounded-sm relative overflow-hidden grid grid-cols-2 gap-px p-0.5">
              <div className="bg-amber-50 border border-amber-600 rounded-sm relative">
                <div className="absolute top-1/2 right-0.5 w-0.5 h-2 bg-amber-900 transform -translate-y-1/2"></div>
              </div>
              <div className="bg-amber-50 border border-amber-600 rounded-sm relative">
                <div className="absolute top-1/2 left-0.5 w-0.5 h-2 bg-amber-900 transform -translate-y-1/2"></div>
              </div>
            </div>
          </div>
        ))}

        {/* Room number label */}
        <div className="absolute top-1 left-1 bg-white px-1.5 py-0.5 rounded-sm text-[9px] font-black text-gray-800 border-2 border-gray-700 shadow-sm z-20">
          {elements.find(e => e.type === 'bed')?.label || 'RM'}
        </div>
      </div>
    );
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target?.result as string);
        setShowImage(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear background image
  const clearBackgroundImage = () => {
    setBackgroundImage(null);
    setShowImage(true);
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

    // 3D style for bed
    const bed3DStyle = {
      ...baseStyle,
      transformStyle: 'preserve-3d' as const,
      transform: `rotate(${element.rotation || 0}deg) rotateX(${is3DView ? '60deg' : '0deg'})`,
      transition: 'transform 0.3s ease',
    };

    switch (element.type) {
      case 'bed':
        return (
          <div 
            key={element.id} 
            style={is3DView ? bed3DStyle : baseStyle} 
            className="bg-white" 
            onClick={(e) => handleElementClick(element.id, e)} 
            onMouseDown={(e) => handleElementDrag(e, element.id)}
          >
            {is3DView ? (
              <>
                {/* 3D Bed - Top Surface */}
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100 border-2 border-gray-700" style={{ transform: 'translateZ(8px)' }}>
                  {/* Headboard */}
                  <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-gray-600 to-gray-800 border-b-2 border-gray-900"></div>
                  {/* Pillow */}
                  <div className="absolute top-4 left-2 right-2 h-4 bg-white border-2 border-gray-400 rounded-sm shadow-md"></div>
                  {/* Mattress */}
                  <div className="absolute top-9 left-2 right-2 bottom-5 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-300 rounded-sm">
                    {/* Blanket */}
                    <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-blue-50 to-white border-t-2 border-blue-200"></div>
                  </div>
                  {/* Footboard */}
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-gray-700 to-gray-600 border-t-2 border-gray-800"></div>
                </div>
                
                {/* 3D Bed - Left Side */}
                <div 
                  className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-gray-300 to-gray-400 border-2 border-gray-700"
                  style={{ 
                    transform: 'rotateY(-90deg) translateZ(0px)',
                    transformOrigin: 'left center',
                    width: '8px'
                  }}
                ></div>
                
                {/* 3D Bed - Right Side */}
                <div 
                  className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-gray-300 to-gray-400 border-2 border-gray-700"
                  style={{ 
                    transform: 'rotateY(90deg) translateZ(0px)',
                    transformOrigin: 'right center',
                    width: '8px'
                  }}
                ></div>
                
                {/* 3D Bed - Front Side */}
                <div 
                  className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-gray-400 to-gray-300 border-2 border-gray-700"
                  style={{ 
                    transform: 'rotateX(-90deg) translateZ(0px)',
                    transformOrigin: 'bottom center',
                    height: '8px'
                  }}
                ></div>
                
                {/* 3D Bed - Back Side */}
                <div 
                  className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-400 to-gray-300 border-2 border-gray-700"
                  style={{ 
                    transform: 'rotateX(90deg) translateZ(0px)',
                    transformOrigin: 'top center',
                    height: '8px'
                  }}
                ></div>

                {/* Shadow */}
                <div 
                  className="absolute inset-0 bg-black opacity-20 blur-sm"
                  style={{ transform: 'translateZ(-1px) translateY(4px)' }}
                ></div>
              </>
            ) : (
              <>
                {/* 2D Bed Frame */}
                <div className="absolute inset-0 border-2 border-gray-700 bg-gradient-to-br from-gray-50 to-white">
                  {/* Headboard */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gray-700"></div>
                  {/* Pillow */}
                  <div className="absolute top-2 left-1 right-1 h-3 bg-white border border-gray-400 rounded-sm"></div>
                  {/* Mattress */}
                  <div className="absolute top-6 left-1 right-1 bottom-4 bg-white border border-gray-300 rounded-sm">
                    {/* Blanket fold */}
                    <div className="absolute bottom-0 left-0 right-0 h-4 bg-gray-100 border-t border-gray-300"></div>
                  </div>
                  {/* Footboard */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-700"></div>
                </div>
              </>
            )}
            
            {/* Bed Label */}
            {element.label && (
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-white px-1.5 py-0.5 rounded text-[9px] font-bold text-gray-800 border border-gray-400 shadow-sm z-10">
                {element.label}
              </div>
            )}
          </div>
        );
      case 'bathroom':
        return (
          <div key={element.id} style={baseStyle} className="bg-blue-50" onClick={(e) => handleElementClick(element.id, e)} onMouseDown={(e) => handleElementDrag(e, element.id)}>
            {/* Bathroom Interior */}
            <div className="absolute inset-0 border-2 border-gray-700 bg-gradient-to-br from-blue-50 to-blue-100">
              {/* Toilet */}
              <div className="absolute top-2 left-2 w-4 h-5 bg-white border-2 border-gray-600 rounded-full">
                <div className="absolute top-0.5 left-0.5 right-0.5 h-1.5 bg-blue-200 rounded-full"></div>
              </div>
              {/* Sink */}
              <div className="absolute top-2 right-2 w-3 h-3 bg-white border-2 border-gray-600 rounded-sm">
                <div className="absolute top-0.5 left-0.5 right-0.5 h-0.5 bg-blue-300 rounded-sm"></div>
              </div>
              {/* Shower */}
              <div className="absolute bottom-2 left-2 right-2 h-4 bg-blue-200 border border-blue-400 rounded-sm flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              </div>
              {/* Label */}
              <div className="absolute bottom-1 right-1 text-[7px] font-bold text-blue-700">KM</div>
            </div>
          </div>
        );
      case 'door':
        return (
          <div key={element.id} style={{...baseStyle, border: 'none'}} onClick={(e) => handleElementClick(element.id, e)} onMouseDown={(e) => handleElementDrag(e, element.id)}>
            {/* Door Frame */}
            <div className="absolute inset-0 border-2 border-gray-800 bg-amber-50">
              {/* Door Panel */}
              <div className="absolute inset-0.5 bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-700">
                {/* Door Handle */}
                <div className="absolute top-1/2 right-1 w-1 h-1 bg-gray-800 rounded-full transform -translate-y-1/2"></div>
              </div>
            </div>
            {/* Door Swing Arc */}
            <div className="absolute -top-12 left-0 w-12 h-12 border-l-2 border-t-2 border-gray-600 rounded-tl-full opacity-40 pointer-events-none"></div>
          </div>
        );
      case 'window':
        return (
          <div key={element.id} style={baseStyle} className="bg-gradient-to-br from-blue-100 to-blue-200" onClick={(e) => handleElementClick(element.id, e)} onMouseDown={(e) => handleElementDrag(e, element.id)}>
            {/* Window Frame */}
            <div className="absolute inset-0 border-2 border-gray-700">
              {/* Glass Panes */}
              <div className="absolute inset-0.5 grid grid-cols-2 gap-0.5">
                <div className="bg-blue-200 border border-blue-400"></div>
                <div className="bg-blue-200 border border-blue-400"></div>
              </div>
              {/* Window Sill */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600"></div>
            </div>
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
          {/* 3D Toggle for Preset */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {presetLayouts.map(preset => {
              // Calculate optimal scale based on content
              const bedCount = preset.elements.filter(e => e.type === 'bed').length;
              const hasBathroom = preset.elements.some(e => e.type === 'bathroom');
              
              // Calculate bounds
              const maxX = Math.max(...preset.elements.map(e => e.x + e.width));
              const maxY = Math.max(...preset.elements.map(e => e.y + e.height));
              
              // Preview container size
              const previewWidth = 280;
              const previewHeight = 160;
              
              // Calculate scale to fit content with padding
              const scaleX = (previewWidth - 20) / maxX;
              const scaleY = (previewHeight - 20) / maxY;
              const scale = Math.min(scaleX, scaleY, 0.6);

              return (
                <div
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset)}
                  className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition ${
                    selectedPreset?.id === preset.id ? 'border-indigo-500 shadow-lg' : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-800">{preset.name}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      preset.roomType === 'ICU' ? 'bg-red-100 text-red-700' :
                      preset.roomType === 'VIP' ? 'bg-purple-100 text-purple-700' :
                      preset.roomType === 'HCU' ? 'bg-orange-100 text-orange-700' :
                      preset.roomType === 'NICU' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {preset.roomType}
                    </span>
                  </div>
                  
                  {/* Mini Preview - Architectural Style */}
                  <div className="mb-3">
                    {renderArchitecturalPreview(preset.elements, previewWidth, previewHeight, scale)}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-600">
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
                      {preset.elements.some(e => e.type === 'monitor') && (
                        <span className="flex items-center gap-1">
                          <i className="fas fa-tv text-gray-500"></i>
                          <span className="font-medium">Monitor</span>
                        </span>
                      )}
                    </div>
                    <span className="text-gray-500">{preset.elements.length} elemen</span>
                  </div>
                </div>
              );
            })}
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

            {/* Click-to-Place Mode */}
            {backgroundImage && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <i className="fas fa-mouse-pointer text-green-600"></i>
                  Mode Klik
                </h4>
                <p className="text-[10px] text-gray-500 mb-2">
                  Pilih elemen, lalu klik di atas gambar untuk tempatkan
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {toolboxItems.map(item => (
                    <button
                      key={item.type}
                      onClick={() => setClickMode(clickMode === item.type ? null : item.type)}
                      className={`flex items-center gap-1 p-1.5 rounded text-xs font-medium transition ${
                        clickMode === item.type
                          ? 'bg-green-500 text-white shadow'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span className="truncate">{item.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
                {clickMode && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-300 rounded text-xs text-green-700">
                    <i className="fas fa-hand-pointer mr-1"></i>
                    Mode aktif: <strong>{toolboxItems.find(i => i.type === clickMode)?.label}</strong>
                    <br/>
                    <span className="text-[10px]">Klik di atas gambar untuk tempatkan</span>
                  </div>
                )}
                <button
                  onClick={() => setClickMode(null)}
                  className="mt-2 w-full px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300"
                >
                  <i className="fas fa-times mr-1"></i>Matikan Mode Klik
                </button>
              </div>
            )}

            {/* Background Image Controls */}
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <i className="fas fa-image text-purple-600"></i>
                Background Denah
              </h4>
              <div className="space-y-3">
                {/* Upload Button */}
                <label className="block w-full px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors cursor-pointer text-center">
                  <i className="fas fa-upload mr-2"></i>
                  {backgroundImage ? 'Ganti Gambar' : 'Upload Gambar'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {/* Image Controls (only show if image exists) */}
                {backgroundImage && (
                  <>
                    {/* Toggle Show/Hide */}
                    <button
                      onClick={() => setShowImage(!showImage)}
                      className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        showImage
                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <i className={`fas ${showImage ? 'fa-eye' : 'fa-eye-slash'} mr-2`}></i>
                      {showImage ? 'Sembunyikan' : 'Tampilkan'} Gambar
                    </button>

                    {/* Opacity Slider */}
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">
                        Opacity: {Math.round(imageOpacity * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={imageOpacity}
                        onChange={(e) => setImageOpacity(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                    </div>

                    {/* Clear Button */}
                    <button
                      onClick={clearBackgroundImage}
                      className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                    >
                      <i className="fas fa-times mr-2"></i>Hapus Gambar
                    </button>
                  </>
                )}

                {/* Help Text */}
                {!backgroundImage && (
                  <p className="text-[10px] text-gray-400 mt-2">
                    <i className="fas fa-info-circle mr-1"></i>
                    Upload denah asli sebagai background untuk trace
                  </p>
                )}
              </div>
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
                    onClick={handleDeleteElement}
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
                  className={`relative w-full h-[500px] bg-white border-4 border-gray-800 rounded-lg overflow-hidden shadow-xl ${clickMode ? 'cursor-crosshair' : ''}`}
                  onDrop={handleCanvasDrop}
                  onDragOver={handleDragOver}
                  onClick={handleCanvasClick}
                  style={{
                    perspective: is3DView ? '1000px' : 'none',
                    perspectiveOrigin: 'center center',
                    backgroundImage: backgroundImage && showImage
                      ? `url(${backgroundImage}),
                         linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                         linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px),
                         linear-gradient(to right, rgba(0,0,0,0.15) 1px, transparent 1px),
                         linear-gradient(to bottom, rgba(0,0,0,0.15) 1px, transparent 1px)`
                      : `
                         linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                         linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px),
                         linear-gradient(to right, rgba(0,0,0,0.15) 1px, transparent 1px),
                         linear-gradient(to bottom, rgba(0,0,0,0.15) 1px, transparent 1px)
                       `,
                    backgroundSize: backgroundImage && showImage
                      ? 'contain, 10px 10px, 10px 10px, 50px 50px, 50px 50px'
                      : '10px 10px, 10px 10px, 50px 50px, 50px 50px',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: backgroundImage && showImage ? imageOpacity : 1
                  }}
                >
                {/* Click Mode Indicator */}
                {clickMode && (
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-30 animate-pulse">
                    <i className="fas fa-hand-pointer mr-1"></i>
                    KLIK untuk tempatkan: {toolboxItems.find(i => i.type === clickMode)?.label}
                  </div>
                )}
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
                      {backgroundImage ? (
                        <>
                          <i className="fas fa-hand-pointer text-4xl mb-2 text-green-500"></i>
                          <p className="text-sm font-medium text-green-700">Aktifkan "Mode Klik" di toolbox</p>
                          <p className="text-xs mt-1">Lalu klik di atas gambar untuk tempatkan elemen</p>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-mouse-pointer text-4xl mb-2"></i>
                          <p className="text-sm">Drag elemen dari toolbox ke sini</p>
                          <p className="text-xs mt-1">atau upload gambar denah sebagai background</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 border-t-2 border-gray-300">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center gap-4">
                    {backgroundImage ? (
                      <span className="flex items-center gap-1">
                        <i className="fas fa-hand-pointer text-green-500"></i>
                        <span>Aktifkan <strong>"Mode Klik"</strong> di toolbox, lalu klik di atas gambar untuk tempatkan elemen</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <i className="fas fa-info-circle text-indigo-500"></i>
                        <span>Drag elemen dari toolbox, klik untuk memilih, drag untuk memindahkan</span>
                      </span>
                    )}
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
