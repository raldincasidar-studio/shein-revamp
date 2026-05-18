import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Heart, Shirt, Loader2 } from 'lucide-react';
import ProductCard from '../shopping/ProductCard';
import { Product } from '../shopping/ShoppingPage';
import { getTrendingProducts } from '../../services/productService';

interface DashboardProps {
  onProductClick?: (product: Product) => void;
  onTryOnClick?: (product: Product) => void;
}

export default function Dashboard({ onProductClick, onTryOnClick }: DashboardProps) {
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      setIsLoadingTrending(true);
      try {
        const products = await getTrendingProducts(4);
        setTrendingProducts(products);
      } catch (error) {
        console.error('Failed to fetch trending products', error);
      } finally {
        setIsLoadingTrending(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full bg-white font-sans text-gray-900">
      
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] min-h-[500px]">
        <img 
          src="https://images.unsplash.com/photo-1512413914596-f0ca85bf63e8?q=80&w=1920&auto=format&fit=crop" 
          alt="Summer Fashion" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/20" /> {/* Slight overlay */}
        <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-8 md:px-16 lg:px-24">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-white mb-4 drop-shadow-md pb-4 pt-10 px-4" style={{ fontFamily: 'Georgia, serif' }}>
              Roll on summer
            </h2>
            <p className="text-lg md:text-xl text-white mb-8 drop-shadow-sm pl-4" style={{ fontFamily: 'Georgia, serif' }}>
              Everything you need for a stylish escape
            </p>
            <div className="pl-4">
               <button className="bg-white text-black px-10 py-3 font-semibold text-sm hover:bg-gray-100 transition-colors uppercase tracking-wider">
                 Shop Now
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* New In Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:w-1/3 flex flex-col items-start pr-8">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">67 NEW ITEMS</p>
            <h2 className="text-4xl md:text-5xl mb-6 text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>New In</h2>
            <p className="text-gray-600 mb-8 leading-relaxed font-serif">
              New arrivals, now dropping five days a week – discover the latest launches onsite from Monday to Friday
            </p>
            <button className="bg-black text-white px-8 py-3.5 font-bold text-[13px] uppercase tracking-widest hover:bg-gray-900 transition-colors">
              Shop New In
            </button>
          </div>

          {/* Right Images */}
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div className="flex flex-col text-center">
              <img src="https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=600&auto=format&fit=crop" alt="SOLEIA" className="w-full aspect-square object-cover mb-4 bg-gray-100" />
              <h3 className="text-lg font-medium text-gray-900">SOLEIA</h3>
            </div>
            <div className="flex flex-col text-center">
              <img src="https://images.unsplash.com/photo-1582236528766-267f818cc68a?q=80&w=600&auto=format&fit=crop" alt="Lumalex" className="w-full aspect-square object-cover mb-4 bg-gray-100" />
              <h3 className="text-lg font-medium text-gray-900">Lumalex</h3>
            </div>
            <div className="flex flex-col text-center">
              <img src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=600&auto=format&fit=crop" alt="AKNOTIC" className="w-full aspect-square object-cover mb-4 bg-gray-100" />
              <h3 className="text-lg font-medium text-gray-900">AKNOTIC</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Now Section */}
      <section className="bg-gray-50/50 py-16 w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl text-gray-900 font-medium">Trending Now</h2>
          </div>

          {isLoadingTrending ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : trendingProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {trendingProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  category="Trending"
                  onClick={() => onProductClick?.(product)}
                  onTryOnClick={() => onTryOnClick?.(product)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No trending products found.
            </div>
          )}
        </div>
      </section>

      {/* Summer Sale Banner */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full">
        <div className="relative w-full h-[600px] rounded-[40px] overflow-hidden group">
          <img 
            src="https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=1920&auto=format&fit=crop" 
            alt="Summer Sale" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-x-0 bottom-0 p-12 md:p-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <h3 className="text-white text-3xl md:text-5xl font-light mb-2 font-serif italic drop-shadow-md">Summer Sale</h3>
            <h2 className="text-white text-5xl md:text-7xl font-black uppercase tracking-widest drop-shadow-lg mb-4" style={{ fontFamily: "monospace" }}>DEFINING DETAILS</h2>
            <p className="text-white text-xl md:text-2xl font-serif mb-8 drop-shadow-md">Up to 60% off</p>
            <button className="bg-white text-black px-10 py-3.5 font-semibold text-sm hover:bg-gray-100 transition-colors uppercase tracking-wider rounded-lg shadow-lg">
              Shop Now
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
