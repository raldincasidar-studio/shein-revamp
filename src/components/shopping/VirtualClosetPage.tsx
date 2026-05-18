import React, { useState, useRef } from 'react';
import { ArrowLeft, Plus, Search, Trash2, Share2, Download, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from './ShoppingPage';

interface VirtualClosetPageProps {
  onBack: () => void;
  onAddToCart?: (products: Product[]) => void;
}

interface ClosetItem extends Product {
  categoryType: 'Tops' | 'Bottoms' | 'Dresses' | 'Shoes';
}

interface CanvasItem {
  id: string; // unique instance id
  product: ClosetItem;
  x: number;
  y: number;
  zIndex: number;
}

export default function VirtualClosetPage({ onBack, onAddToCart }: VirtualClosetPageProps) {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Tops' | 'Bottoms' | 'Dresses' | 'Shoes'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Default');
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sample closet items
  const closetItems: ClosetItem[] = [
    {
      id: 'c1',
      name: 'KRYTIVO Duck Pattern Top',
      price: 250,
      rating: 4.8,
      reviews: 120,
      sold: 500,
      imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=400&h=400&auto=format&fit=crop',
      categoryType: 'Tops'
    },
    {
      id: 'c2',
      name: 'Men Stripe Print Casual',
      price: 320,
      rating: 4.5,
      reviews: 80,
      sold: 300,
      imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=400&h=400&auto=format&fit=crop',
      categoryType: 'Tops'
    },
    {
      id: 'c3',
      name: 'NEOREFINED Men Suit',
      price: 450,
      rating: 4.9,
      reviews: 200,
      sold: 1000,
      imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=400&h=400&auto=format&fit=crop',
      categoryType: 'Tops'
    },
    {
      id: 'c4',
      name: 'AKNOTIC Men Casual Pants',
      price: 550,
      rating: 4.6,
      reviews: 150,
      sold: 600,
      imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=400&h=400&auto=format&fit=crop',
      categoryType: 'Bottoms'
    },
    {
      id: 'c5',
      name: 'MOLCRASH 1pc Pants',
      price: 600,
      rating: 4.7,
      reviews: 90,
      sold: 400,
      imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=400&h=400&auto=format&fit=crop',
      categoryType: 'Bottoms'
    },
    {
      id: 'c6',
      name: 'Stylish White Sneakers',
      price: 800,
      rating: 4.8,
      reviews: 300,
      sold: 1200,
      imageUrl: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=400&h=400&auto=format&fit=crop',
      categoryType: 'Shoes'
    }
  ];

  const filteredItems = closetItems.filter(item => {
    if (activeCategory !== 'All' && item.categoryType !== activeCategory) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    return 0;
  });

  const handleDragStart = (e: React.DragEvent, item: ClosetItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (data) {
      const item = JSON.parse(data) as ClosetItem;
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        // Calculate drop position relative to the container
        const x = e.clientX - rect.left - 50; // offset center roughly
        const y = e.clientY - rect.top - 50;
        
        setMaxZIndex(prev => {
          const nextZ = prev + 1;
          const newItem: CanvasItem = {
            id: `instance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            product: item,
            x,
            y,
            zIndex: nextZ
          };
          setCanvasItems(prevItems => [...prevItems, newItem]);
          return nextZ;
        });
      }
    }
  };

  const clearCanvas = () => {
    setCanvasItems([]);
  };

  const removeCanvasItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCanvasItems(canvasItems.filter(item => item.id !== id));
  };

  const updateItemZIndex = (id: string) => {
    setCanvasItems(items => items.map(item => {
      if (item.id === id) {
        setMaxZIndex(maxZIndex + 1);
        return { ...item, zIndex: maxZIndex + 1 };
      }
      return item;
    }));
  };

  const handleCheckoutAll = () => {
    if (onAddToCart) {
      // Get unique products
      const products = Array.from(new Set(canvasItems.map(i => i.product.id)))
        .map(id => canvasItems.find(i => i.product.id === id)!.product);
      onAddToCart(products);
    }
  };

  return (
    <div className="flex-1 flex flex-col font-sans w-full bg-gray-50 xl:h-full xl:overflow-hidden">
      {/* Header */}
      <header className="bg-black h-16 px-4 flex items-center justify-between shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2 text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
            </svg>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold tracking-tight">Virtual Mix & Match Closet</h1>
              <p className="text-[10px] text-gray-400 font-medium tracking-wide">Mix & Match Your Style</p>
            </div>
          </div>
        </div>
        <div className="text-2xl font-black tracking-widest uppercase text-white">
          SHEIN
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col xl:flex-row w-full xl:h-full xl:min-h-0 xl:overflow-hidden">
        
        {/* Left Sidebar - My Closet */}
        <div className="w-full xl:w-[350px] bg-white border-b xl:border-b-0 xl:border-r border-gray-200 flex flex-col shrink-0 h-[300px] xl:h-full z-20">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">My Closet</h2>
            <button className="bg-black text-white px-3 py-1.5 rounded text-sm font-bold flex items-center gap-1 hover:bg-gray-800">
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>
          
          <div className="p-4 border-b border-gray-100 space-y-4 shadow-sm relative z-10">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search Your Closet" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-full text-sm outline-none focus:border-black"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 scrollbar-none">
              {(['All', 'Tops', 'Bottoms', 'Dresses', 'Shoes'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
                    activeCategory === cat 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
              <span>{filteredItems.length} items</span>
              <div className="relative">
                <select 
                  className="appearance-none bg-white border border-gray-300 hover:border-gray-400 pl-2 pr-6 py-1 rounded shadow-sm text-xs font-semibold text-gray-700 outline-none cursor-pointer"
                  onChange={(e) => setSortBy(e.target.value)}
                  value={sortBy}
                >
                  <option value="Default">Default</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                </select>
                <Filter className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 relative">
            <div className="grid grid-cols-2 gap-3 pb-8">
              {filteredItems.map(item => (
                <div 
                  key={item.id} 
                  className="group relative cursor-grab active:cursor-grabbing border-2 border-transparent hover:border-gray-200 rounded-lg p-1 transition-colors"
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onClick={() => {
                    // Click-to-add for mobile or quick adding
                    const newItem: CanvasItem = {
                      id: `instance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                      product: item,
                      x: 100 + Math.random() * 50,
                      y: 100 + Math.random() * 50,
                      zIndex: maxZIndex + 1
                    };
                    setMaxZIndex(maxZIndex + 1);
                    setCanvasItems([...canvasItems, newItem]);
                  }}
                >
                  <div className="aspect-square bg-gray-100 rounded overflow-hidden relative shadow-sm">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" draggable={false} />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2 pt-6">
                      <p className="text-white text-[9px] font-medium truncate">{item.name}</p>
                    </div>
                  </div>
                </div>
              ))}
              {filteredItems.length === 0 && (
                <div className="col-span-2 text-center text-gray-500 py-10 text-sm">
                  No items found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center - Mix & Match Studio (Canvas) */}
        <div className="flex-1 flex flex-col relative min-h-[500px] xl:h-full overflow-hidden bg-[#fafafa]">
          {/* Toolbar */}
          <div className="h-14 bg-white border-b border-gray-200 flex justify-between items-center px-4 shrink-0 shadow-sm z-10 relative">
            <h2 className="text-lg font-bold text-gray-800">Mix & Match Studio</h2>
            <div className="flex items-center gap-2">
              <button onClick={clearCanvas} className="text-xs font-bold border border-gray-300 bg-white text-gray-700 px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-gray-50 transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
              <button className="text-xs font-bold border border-gray-300 bg-white text-gray-700 px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-gray-50 transition-colors">
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
              <button className="text-xs font-bold border border-gray-300 bg-white text-gray-700 px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-gray-50 transition-colors">
                <Download className="w-3.5 h-3.5" /> Export
              </button>
            </div>
          </div>

          {/* Canvas Area */}
          <div 
            ref={containerRef}
            className="flex-1 relative overflow-hidden"
            onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
            onDrop={handleDrop}
          >
              {canvasItems.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 select-none pointer-events-none p-4 text-center">
                <p className="text-lg font-medium">Drag or tap items to create your outfit</p>
                <p className="text-sm">Mix and match from your closet</p>
              </div>
            )}
            
            {canvasItems.map(item => (
              <motion.div
                key={item.id}
                drag
                dragMomentum={false}
                dragConstraints={containerRef}
                onMouseDown={() => updateItemZIndex(item.id)}
                onTouchStart={() => updateItemZIndex(item.id)}
                initial={{ x: item.x, y: item.y, scale: 0 }}
                animate={{ scale: 1 }}
                style={{ zIndex: item.zIndex }}
                className="absolute w-32 h-32 cursor-move group hover:ring-2 ring-[#7D29A8] ring-offset-2 rounded shadow-lg bg-transparent"
              >
                <img 
                  src={item.product.imageUrl} 
                  alt={item.product.name} 
                  className="w-full h-full object-contain drop-shadow-xl pointer-events-none" 
                />
                
                {/* Delete button (visible on hover) */}
                <button 
                  onClick={(e) => removeCanvasItem(item.id, e)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                >
                  <span className="sr-only">Remove</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </motion.div>
            ))}
            
            {/* Status footer inside canvas */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end select-none pointer-events-none">
              <div>
                <p className="font-bold text-gray-800">Items in outfit: {canvasItems.length}</p>
                <p className="text-xs text-gray-500">Click and drag items to reposition</p>
              </div>
              
              {canvasItems.length > 0 && (
                 <button 
                   className="pointer-events-auto bg-black text-white px-6 py-3 rounded shadow-xl font-bold uppercase tracking-wider text-sm hover:bg-gray-800 transition-colors"
                   onClick={handleCheckoutAll}
                 >
                   Checkout All Selection
                 </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Saved Outfits (Hidden on mobile, or could be a drawer) */}
        <div className="w-full xl:w-[280px] bg-white xl:border-l border-t xl:border-t-0 border-gray-200 flex flex-col shrink-0 flex-1 xl:flex-none self-stretch">
          <div className="p-6 border-b border-gray-100 shrink-0">
            <h2 className="text-xl font-bold">Saved Outfits</h2>
            <p className="text-sm text-gray-500">0 outfit saved</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-400 min-h-[150px]">
            <p>No saved outfits yet</p>
            <p>Create and save your first outfit!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
