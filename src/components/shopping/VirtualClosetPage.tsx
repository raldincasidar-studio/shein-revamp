import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Plus, Search, Trash2, Share2, Download, Filter, Loader2, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { User } from 'firebase/auth';
import { Product } from './ShoppingPage';
import { getProducts } from '../../services/productService';
import { getClosetItems, ClosetItem as FirestoreClosetItem } from '../../services/closetService';

interface VirtualClosetPageProps {
  onBack: () => void;
  onAddToCart?: (products: Product[]) => void;
  user?: User | null;
}

interface ClosetItem extends Product {
  categoryType: 'Tops' | 'Bottoms' | 'Dresses' | 'Shoes' | 'Other';
}

interface CanvasItem {
  id: string;
  product: ClosetItem;
  x: number;
  y: number;
  zIndex: number;
}

function inferCategoryType(category?: string): ClosetItem['categoryType'] {
  if (!category) return 'Other';
  const c = category.toLowerCase();
  if (c.includes('top') || c.includes('shirt') || c.includes('blouse') || c.includes('sweater') || c.includes('jacket') || c.includes('coat') || c.includes('hoodie') || c.includes('outerwear')) return 'Tops';
  if (c.includes('bottom') || c.includes('pant') || c.includes('jean') || c.includes('skirt') || c.includes('short') || c.includes('denim')) return 'Bottoms';
  if (c.includes('dress') || c.includes('gown') || c.includes('jumpsuit') || c.includes('romper')) return 'Dresses';
  if (c.includes('shoe') || c.includes('sneaker') || c.includes('boot') || c.includes('heel') || c.includes('sandal') || c.includes('footwear')) return 'Shoes';
  return 'Other';
}

export default function VirtualClosetPage({ onBack, onAddToCart, user }: VirtualClosetPageProps) {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Tops' | 'Bottoms' | 'Dresses' | 'Shoes' | 'Other'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Default');
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const [allProducts, setAllProducts] = useState<ClosetItem[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [savedItems, setSavedItems] = useState<FirestoreClosetItem[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

  useEffect(() => {
    getProducts()
      .then(products => {
        setAllProducts(
          products
            .filter(p => p.id && p.name && p.imageUrl)
            .map(p => ({
              ...p,
              categoryType: inferCategoryType(p.category)
            }))
        );
      })
      .catch(err => console.error('Failed to load products', err))
      .finally(() => setLoadingProducts(false));
  }, []);

  useEffect(() => {
    if (!user) {
      setLoadingSaved(false);
      return;
    }
    getClosetItems(user.uid)
      .then(setSavedItems)
      .catch(err => console.error('Failed to load closet items', err))
      .finally(() => setLoadingSaved(false));
  }, [user]);

  const filteredItems = allProducts.filter(item => {
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
        const x = e.clientX - rect.left - 50;
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

  const addToCanvas = (item: ClosetItem) => {
    const newZ = maxZIndex + 1;
    const newItem: CanvasItem = {
      id: `instance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      product: item,
      x: 80 + Math.random() * 60,
      y: 80 + Math.random() * 60,
      zIndex: newZ
    };
    setMaxZIndex(newZ);
    setCanvasItems(prev => [...prev, newItem]);
  };

  const clearCanvas = () => setCanvasItems([]);

  const removeCanvasItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCanvasItems(prev => prev.filter(item => item.id !== id));
  };

  const updateItemZIndex = (id: string) => {
    const newZ = maxZIndex + 1;
    setMaxZIndex(newZ);
    setCanvasItems(items => items.map(item =>
      item.id === id ? { ...item, zIndex: newZ } : item
    ));
  };

  const handleCheckoutAll = () => {
    if (onAddToCart) {
      const products = Array.from(new Set(canvasItems.map(i => i.product.id)))
        .map(id => canvasItems.find(i => i.product.id === id)!.product);
      onAddToCart(products);
    }
  };

  const categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Shoes', 'Other'] as const;

  return (
    <div className="flex-1 flex flex-col font-sans w-full bg-gray-50 xl:h-[calc(100vh-120px)] xl:overflow-hidden">
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

        {/* Left Sidebar - All Products as Closet */}
        <div className="w-full xl:w-[350px] bg-white border-b xl:border-b-0 xl:border-r border-gray-200 flex flex-col shrink-0 h-[360px] xl:h-full z-20">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              My Closet
              {!loadingProducts && (
                <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{allProducts.length}</span>
              )}
            </h2>
            <button className="bg-black text-white px-3 py-1.5 rounded text-sm font-bold flex items-center gap-1 hover:bg-gray-800">
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>

          <div className="p-4 border-b border-gray-100 space-y-3 shadow-sm relative z-10">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search closet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-full text-sm outline-none focus:border-black"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
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
              <span>{loadingProducts ? '...' : `${filteredItems.length} items`}</span>
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
            {loadingProducts ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 py-12">
                <Loader2 className="w-7 h-7 animate-spin text-gray-400" />
                <p className="text-sm text-gray-400 font-medium">Loading items...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pb-8">
                {filteredItems.map(item => (
                  <div
                    key={item.id}
                    className="group relative cursor-grab active:cursor-grabbing border-2 border-transparent hover:border-gray-300 rounded-lg p-1 transition-colors"
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    onClick={() => addToCanvas(item)}
                  >
                    <div className="aspect-square bg-gray-100 rounded overflow-hidden relative shadow-sm">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        draggable={false}
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-6">
                        <p className="text-white text-[9px] font-medium truncate">{item.name}</p>
                        <p className="text-white/70 text-[8px]">₱{item.price}</p>
                      </div>
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/90 text-[8px] font-bold text-gray-700 px-1.5 py-0.5 rounded-full shadow">
                          + Add
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredItems.length === 0 && !loadingProducts && (
                  <div className="col-span-2 text-center text-gray-400 py-10 text-sm">
                    No items found.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Center - Mix & Match Studio */}
        <div className="flex-1 flex flex-col relative min-h-[500px] xl:h-full overflow-hidden bg-[#fafafa]">
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

          <div
            ref={containerRef}
            className="flex-1 relative overflow-hidden"
            onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
            onDrop={handleDrop}
          >
            {canvasItems.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 select-none pointer-events-none p-4 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-gray-300">
                    <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
                  </svg>
                </div>
                <p className="text-lg font-medium">Drag or tap items to create your outfit</p>
                <p className="text-sm mt-1">Mix and match from your closet on the left</p>
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
                <button
                  onClick={(e) => removeCanvasItem(item.id, e)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                >
                  <span className="sr-only">Remove</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </motion.div>
            ))}

            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end select-none pointer-events-none">
              <div>
                <p className="font-bold text-gray-800">Items in outfit: {canvasItems.length}</p>
                <p className="text-xs text-gray-500">Click items or drag them to reposition</p>
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

        {/* Right Sidebar - Saved Outfits (hearted/closet items) */}
        <div className="w-full xl:w-[280px] bg-white xl:border-l border-t xl:border-t-0 border-gray-200 flex flex-col shrink-0 flex-1 xl:flex-none self-stretch min-h-[500px] xl:min-h-0">
          <div className="p-6 border-b border-gray-100 shrink-0 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                Saved Items
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {loadingSaved ? 'Loading...' : `${savedItems.length} item${savedItems.length !== 1 ? 's' : ''} saved`}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {loadingSaved ? (
              <div className="flex flex-col items-center justify-center h-40 gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                <p className="text-sm text-gray-400">Loading saved items...</p>
              </div>
            ) : savedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center text-gray-400 px-4">
                <Heart className="w-10 h-10 text-gray-200 mb-3" />
                <p className="font-medium text-sm">No saved items yet</p>
                <p className="text-xs mt-1">Heart products to save them here</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {savedItems.map(item => (
                  <div
                    key={item.productId}
                    className="group relative cursor-pointer border-2 border-transparent hover:border-red-200 rounded-lg p-1 transition-colors"
                    onClick={() => {
                      const closetItem: ClosetItem = {
                        id: item.productId,
                        name: item.productName,
                        price: item.price,
                        rating: 0,
                        reviews: 0,
                        sold: 0,
                        imageUrl: item.productImage,
                        category: item.category,
                        categoryType: inferCategoryType(item.category)
                      };
                      addToCanvas(closetItem);
                    }}
                  >
                    <div className="aspect-square bg-gray-100 rounded overflow-hidden relative shadow-sm">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-1 left-1">
                        <Heart className="w-3 h-3 fill-red-500 text-red-500 drop-shadow" />
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-5">
                        <p className="text-white text-[9px] font-medium truncate">{item.productName}</p>
                        <p className="text-white/70 text-[8px]">₱{item.price}</p>
                      </div>
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/90 text-[8px] font-bold text-gray-700 px-1.5 py-0.5 rounded-full shadow">
                          + Mix
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
