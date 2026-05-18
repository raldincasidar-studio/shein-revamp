import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  sold: number;
  imageUrl: string;
}

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  category: string;
  onClick?: () => void;
  onTryOnClick?: (e: React.MouseEvent) => void;
}

export default function ProductCard({ product, category, onClick, onTryOnClick }: ProductCardProps) {
  return (
    <div className="group flex flex-col relative bg-white cursor-pointer" onClick={onClick}>
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 w-full mb-3">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute top-2 left-2 bg-gray-900/50 text-white text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wider backdrop-blur-sm">
          Swim Mod
        </div>
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <button className="p-1.5 bg-white rounded-full shadow-sm text-gray-500 hover:text-red-500 hover:bg-gray-50 transition-colors">
            <Heart className="w-4 h-4" />
          </button>
        </div>
        
        {/* Hover actions overlay */}
        <div className="absolute bottom-4 left-0 w-full flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <button className="bg-white/90 backdrop-blur text-black font-semibold text-xs px-6 py-2 rounded-full shadow-lg hover:bg-white flex items-center space-x-2">
             <ShoppingCart className="w-4 h-4"/>
             <span>Quick Add</span>
           </button>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none drop-shadow-lg text-white font-bold text-2xl uppercase tracking-widest leading-tight">
           <span>SAMPLE</span>
           <span>PRODUCT</span>
           <span>PIC</span>
        </div>
      </div>
      
      <div className="px-1 text-left space-y-1.5">
        <p className="text-xs text-gray-600 truncate">Swim Mod {category} Summer Be...</p>
        <div className="flex items-center text-[10px] space-x-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className={`w-3 h-3 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} />
          ))}
          <span className="text-gray-500 pl-1">({product.reviews})</span>
        </div>
        <div className="flex items-end justify-between pt-1">
          <div className="flex items-baseline space-x-2 flex-wrap">
            <span className="font-bold text-[16px] leading-none">₱{product.price}</span>
            <span className="text-[11px] text-gray-500">{(product.sold / 1000).toFixed(1)}k+ sold</span>
          </div>
          <div className="flex items-center gap-1.5 pb-1">
            <button 
              className="border border-indigo-400 text-indigo-500 bg-white rounded-sm text-[10px] px-2 py-0.5 font-semibold flex items-center gap-1 hover:bg-indigo-50 transition-colors z-10 relative"
              onClick={(e) => {
                if (onTryOnClick) {
                  e.stopPropagation();
                  onTryOnClick(e);
                }
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Try-On
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
