import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { User } from 'firebase/auth';
import { Product } from './ShoppingPage';
import { addToCart } from '../../services/cartService';
import { addToCloset, removeFromCloset, isInCloset } from '../../services/closetService';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  category: string;
  onClick?: () => void;
  onTryOnClick?: (e: React.MouseEvent) => void;
  user?: User | null;
  onAddToCart?: () => void;
}

export default function ProductCard({ product, category, onClick, onTryOnClick, user, onAddToCart }: ProductCardProps) {
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    isInCloset(user.uid, product.id).then(setIsFav).catch(() => {});
  }, [user, product.id]);

  const handleFav = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    setFavLoading(true);
    try {
      if (isFav) {
        await removeFromCloset(user.uid, product.id);
        setIsFav(false);
      } else {
        await addToCloset(user.uid, {
          productId: product.id,
          productName: product.name,
          productImage: product.imageUrl,
          price: product.price,
          category: product.category || category
        });
        setIsFav(true);
      }
    } catch (err) {
      console.error('Closet error', err);
    } finally {
      setFavLoading(false);
    }
  };

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    setCartLoading(true);
    try {
      const defaultSize = product.sizes?.[0] || 'M';
      const defaultColor = product.colors?.[0] || 'Default';
      await addToCart(user.uid, {
        productId: product.id,
        productName: product.name,
        productImage: product.imageUrl,
        price: product.price,
        selectedSize: defaultSize,
        selectedColor: defaultColor,
        quantity: 1,
        category: product.category || category
      });
      if (onAddToCart) onAddToCart();
    } catch (err) {
      console.error('Add to cart error', err);
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <div className="group flex flex-col relative bg-white cursor-pointer" onClick={onClick}>
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 w-full mb-3">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        {product.category && (
          <div className="absolute top-2 left-2 bg-gray-900/50 text-white text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wider backdrop-blur-sm">
            {product.category}
          </div>
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <button
            onClick={handleFav}
            disabled={favLoading}
            className={`p-1.5 rounded-full shadow-sm transition-colors ${isFav ? 'bg-red-500 text-white' : 'bg-white text-gray-500 hover:text-red-500 hover:bg-gray-50'}`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
          </button>
        </div>
        
        <div className="absolute bottom-4 left-0 w-full flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleQuickAdd}
            disabled={cartLoading || !user}
            className="bg-white/90 backdrop-blur text-black font-semibold text-xs px-6 py-2 rounded-full shadow-lg hover:bg-white flex items-center space-x-2 disabled:opacity-60"
          >
            {cartLoading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
            <span>{cartLoading ? 'Adding...' : 'Quick Add'}</span>
          </button>
        </div>
      </div>
      
      <div className="px-1 text-left space-y-1.5">
        <p className="text-xs text-gray-900 truncate font-medium">{product.name}</p>
        <div className="flex items-center text-[10px] space-x-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className={`w-3 h-3 ${star <= Math.round(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} />
          ))}
          <span className="text-gray-500 pl-1">({product.reviews || 0})</span>
        </div>
        <div className="flex items-end justify-between pt-1">
          <div className="flex items-baseline space-x-2 flex-wrap">
            <span className="font-bold text-[16px] leading-none">₱{product.price}</span>
            <span className="text-[11px] text-gray-500">{product.sold >= 1000 ? (product.sold / 1000).toFixed(1) + 'k+' : product.sold} sold</span>
          </div>
          <div className="flex items-center gap-1.5 pb-1">
            <button 
              className="border border-indigo-400 text-indigo-500 bg-white rounded-sm text-[10px] px-2 py-0.5 font-semibold flex items-center gap-1 hover:bg-indigo-50 transition-colors z-10 relative"
              onClick={(e) => {
                if (onTryOnClick) {
                  e.stopPropagation();
                  e.preventDefault();
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
