import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import ProductCard from './ProductCard';
import { getProductsByCategories } from '../../services/productService';

export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  sold: number;
  imageUrl: string;
  category?: string;
  description?: string;
  sizes?: string[];
  colors?: string[];
}

const generateProducts = (category: string, count: number): Product[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `${category}-${i}`,
    name: `${category} Collection Item ${i + 1}`,
    price: 411,
    rating: 5,
    reviews: 527,
    sold: 21600,
    imageUrl: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=600&auto=format&fit=crop'
  }));
};

interface ShoppingPageProps {
  category: string;
  searchQuery?: string;
  setCategory: (category: string) => void;
  onProductClick?: (product: Product) => void;
}

export default function ShoppingPage({ category, searchQuery, setCategory, onProductClick }: ShoppingPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({
    Category: true,
    Size: true,
    Material: false,
    'Pattern Type': false,
    Style: false,
    Color: false,
    'Price Range': true
  });
  
  const toggleFilter = (filterName: string) => {
    setOpenFilters(prev => ({ ...prev, [filterName]: !prev[filterName] }));
  };

  const categoriesOptions = ['Tops', 'Dresses', 'Bottoms', 'Activewear', 'Swimwear', 'Lingerie', 'Outerwear', 'Loungewear', 'Denim', 'Sleepwear'];
  const [selectedCategoriesList, setSelectedCategoriesList] = useState<string[]>([]);
  const toggleCategoryCheck = (cat: string) => setSelectedCategoriesList(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);

  const sizeOptions = ['one-size', 'XS', 'XXS', 'S', 'M', 'L'];
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const toggleSize = (s: string) => setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const minAllowed = 50;
  const maxAllowed = 29440;
  const [priceRange, setPriceRange] = useState<[number, number]>([minAllowed, maxAllowed]);

  const handleMinPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), priceRange[1] - 1);
    setPriceRange([value, priceRange[1]]);
  }

  const handleMaxPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), priceRange[0] + 1);
    setPriceRange([priceRange[0], value]);
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        let categoriesToFetch: string[] = [];
        if (selectedCategoriesList.length > 0) {
          categoriesToFetch = selectedCategoriesList;
        } else if (category && category !== 'Home') {
          categoriesToFetch = [category];
        }
        let fetched = await getProductsByCategories(categoriesToFetch);
        if (searchQuery) {
          fetched = fetched.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        setProducts(fetched.length > 0 ? fetched : generateProducts(searchQuery || category, 12));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [category, searchQuery, selectedCategoriesList]);

  return (
    <div className="w-full bg-white font-sans text-gray-900 pb-16">
      {/* Title Area */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-6">
        {searchQuery ? (
          <h2 className="text-xl md:text-2xl font-light text-gray-600">
            Search results for "{searchQuery}"
          </h2>
        ) : (
          <div className="flex items-center text-sm text-gray-600 mb-6">
            <span className="hover:text-black cursor-pointer" onClick={() => setCategory('Home')}>Home</span>
            <span className="mx-2">/</span>
            <span className="font-medium text-black">{category} Clothing</span>
          </div>
        )}

        <div className="flex justify-end mb-4">
          <div className="flex items-center space-x-2 border border-gray-300 rounded px-3 py-1.5 text-sm cursor-pointer hover:border-gray-400">
             <span className="text-gray-600">Sort By</span>
             <span className="font-semibold">Recommended</span>
             <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0 space-y-6">
            <div>
               <h3 className="text-lg font-bold mb-4">Filter</h3>
            </div>

            {/* Category Filter */}
            <div className="border-t border-gray-100 pt-4">
              <div 
                className="flex justify-between items-center mb-3 cursor-pointer"
                onClick={() => toggleFilter('Category')}
              >
                <h4 className="font-bold text-[15px]">Category</h4>
                <span className="text-xl leading-none">{openFilters['Category'] ? '-' : '+'}</span>
              </div>
              {openFilters['Category'] && (
                <div className="space-y-2.5">
                  {categoriesOptions.map(cat => (
                    <label key={cat} className="flex items-center space-x-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleCategoryCheck(cat); }}>
                       <div className={`w-4 h-4 border rounded-sm flex items-center justify-center ${selectedCategoriesList.includes(cat) ? 'border-black bg-black' : 'border-gray-300 group-hover:border-black'}`}>
                         {selectedCategoriesList.includes(cat) && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                       </div>
                       <span className="text-[14px] text-gray-700 group-hover:text-black">{cat}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Size */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between items-center mb-3 cursor-pointer" onClick={() => toggleFilter('Size')}>
                <h4 className="font-bold text-[15px]">Size</h4>
                <span className="text-xl leading-none">{openFilters['Size'] ? '-' : '+'}</span>
              </div>
              {openFilters['Size'] && (
                <div className="grid grid-cols-2 gap-2.5">
                   {sizeOptions.map(size => (
                      <label key={size} className="flex items-center space-x-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleSize(size); }}>
                         <div className={`w-4 h-4 border rounded-sm flex items-center justify-center ${selectedSizes.includes(size) ? 'border-black bg-black' : 'border-gray-300 group-hover:border-black'}`}>
                            {selectedSizes.includes(size) && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                         </div>
                         <span className="text-[14px] text-gray-700 group-hover:text-black">{size}</span>
                      </label>
                   ))}
                </div>
              )}
            </div>

            {/* Material */}
            {['Material', 'Pattern Type', 'Style', 'Color'].map(filter => (
               <div key={filter} className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleFilter(filter)}>
                    <h4 className="font-bold text-[15px]">{filter}</h4>
                    <span className="text-xl leading-none">{openFilters[filter] ? '-' : '+'}</span>
                  </div>
                  {openFilters[filter] && (
                    <div className="pt-3 text-sm text-gray-500">
                      Options for {filter}
                    </div>
                  )}
               </div>
            ))}

            {/* Price Range */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between items-center mb-3 cursor-pointer" onClick={() => toggleFilter('Price Range')}>
                <h4 className="font-bold text-[15px]">Price Range (PHP)</h4>
                <span className="text-xl leading-none">{openFilters['Price Range'] ? '-' : '+'}</span>
              </div>
              {openFilters['Price Range'] && (
                <div className="px-2 pt-2 pb-4">
                   <div className="flex justify-between text-xs text-gray-600 mb-2">
                      <span>₱{priceRange[0]}</span>
                      <span>₱{priceRange[1]}</span>
                   </div>
                   <div className="relative w-full h-1 bg-gray-200 mt-2">
                      <div 
                        className="absolute top-0 h-full bg-black"
                        style={{
                          left: `${((priceRange[0] - minAllowed) / (maxAllowed - minAllowed)) * 100}%`,
                          right: `${100 - ((priceRange[1] - minAllowed) / (maxAllowed - minAllowed)) * 100}%`
                        }}
                      ></div>
                      
                      <input 
                        type="range" 
                        min={minAllowed} 
                        max={maxAllowed} 
                        value={priceRange[0]} 
                        onChange={handleMinPrice}
                        className="absolute top-1/2 -mt-1.5 w-full h-3 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:rounded-full"
                        style={{ zIndex: priceRange[0] > maxAllowed - 100 ? 5 : 3 }}
                      />
                      <input 
                        type="range" 
                        min={minAllowed} 
                        max={maxAllowed} 
                        value={priceRange[1]} 
                        onChange={handleMaxPrice}
                        className="absolute top-1/2 -mt-1.5 w-full h-3 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:rounded-full"
                        style={{ zIndex: 4 }}
                      />
                   </div>
                </div>
              )}
            </div>

          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-x-6 md:gap-y-10 w-full pb-10">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded aspect-[3/4] w-full mb-3" />
                    <div className="bg-gray-200 rounded h-3 w-3/4 mb-2" />
                    <div className="bg-gray-200 rounded h-3 w-1/2 mb-2" />
                    <div className="bg-gray-200 rounded h-4 w-1/3" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-x-6 md:gap-y-10 w-full pb-10">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} category={category} onClick={() => onProductClick?.(product)} />
                  ))}
                </div>
                <div className="flex justify-center mt-10 w-full">
                  <button className="border border-gray-300 text-black px-12 py-3 text-sm font-semibold hover:border-black transition-colors rounded-sm">
                    Load More Products
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
