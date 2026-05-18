import { useState } from 'react';
import { ChevronRight, Heart, Minus, Plus, Share2, Star } from 'lucide-react';
import ProductCard from './ProductCard';
import { Product } from './ShoppingPage'; // Note: I should be careful if ShoppingPage exports it. Just use the one imported here.

interface ProductPageProps {
  product: Product;
  onBack: () => void;
  onProductClick: (product: Product) => void;
  onTryOnClick?: () => void;
}

export default function ProductPage({ product, onBack, onProductClick, onTryOnClick }: ProductPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);

  // Use product colors if available, otherwise mock
  const colors = product.colors && product.colors.length > 0
    ? product.colors.map((c, i) => ({ name: c, image: product.imageUrl, hot: i === 0 }))
    : [
        { name: 'Black', image: product.imageUrl, hot: true },
        { name: 'Burgundy', image: product.imageUrl, hot: true },
        { name: 'Mocha', image: product.imageUrl, hot: false },
        { name: 'Red', image: product.imageUrl, hot: false },
      ];
      
  const sizes = product.sizes && product.sizes.length > 0 
    ? product.sizes 
    : ['XS', 'S', 'M', 'L'];

  const thumbnails = [
    product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl
  ];

  return (
    <div className="w-full bg-white font-sans text-gray-900 pb-16">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-6">
        
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center text-[13px] text-gray-500 mb-6 gap-1 md:gap-2">
          <button onClick={onBack} className="hover:underline">Home</button>
          <span>/</span>
          <button onClick={onBack} className="hover:underline">Women Apparel</button>
          <span>/</span>
          <button onClick={onBack} className="hover:underline">Women Clothing</button>
          <span>/</span>
          <button onClick={onBack} className="hover:underline">Women Tops</button>
          <span>/</span>
          <button onClick={onBack} className="hover:underline">Women Tank Tops & Camis</button>
          <span>/</span>
          <span className="text-gray-900 truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
        </div>

        {/* Main Product Area */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 w-full mb-12">
          
          {/* Images */}
          <div className="md:w-1/2 flex gap-4">
             <div className="w-16 hidden sm:flex flex-col gap-3 shrink-0">
                {thumbnails.map((img, i) => (
                  <div key={i} className={`w-16 h-[85px] border cursor-pointer ${i === 0 ? 'border-black' : 'border-transparent hover:border-gray-300'}`}>
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </div>
                ))}
             </div>
             <div className="flex-1 bg-gray-100 aspect-[3/4] relative">
               <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
               <button className="absolute top-4 right-4 bg-white/80 backdrop-blur rounded-full p-2 text-gray-600 hover:text-black shadow-sm">
                 <Share2 className="w-5 h-5" />
               </button>
             </div>
          </div>

          {/* Details */}
          <div className="md:w-1/2 flex flex-col pt-2">
            <h1 className="text-xl md:text-2xl font-normal text-gray-900 mb-2 leading-tight">
              {product.name}
            </h1>
            {product.description && (
              <p className="text-sm text-gray-700 mb-4">{product.description}</p>
            )}
            <p className="text-sm text-gray-500 mb-4">SKU: sz2411181028155675</p>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className={`w-4 h-4 ${i <= 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} />
                ))}
              </div>
              <a href="#reviews" className="text-sm text-gray-600 hover:underline">({product.reviews} reviews)</a>
            </div>

            <div className="text-3xl font-bold mb-6">
              ₱{product.price}
            </div>

            {/* Colors */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                 <span className="font-bold mr-2 text-sm">Color:</span>
                 <span className="text-sm">{colors[selectedColor].name}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {colors.map((c, i) => (
                  <div 
                    key={i} 
                    onClick={() => setSelectedColor(i)}
                    className={`relative w-12 h-16 cursor-pointer border ${selectedColor === i ? 'border-black' : 'border-transparent hover:border-gray-300'}`}
                  >
                    <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                    {c.hot && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[9px] font-bold px-1.5 rounded-sm">
                        HOT
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                 <div>
                   <span className="font-bold mr-2 text-sm">Size:</span>
                   <span className="text-sm">{sizes[selectedSize]}</span>
                 </div>
                 <button className="text-xs text-gray-500 underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {sizes.map((s, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedSize(i)}
                    className={`min-w-[3rem] px-3 py-1.5 text-sm font-semibold border rounded-sm transition-colors ${selectedSize === i ? 'border-black bg-black text-white' : 'border-gray-300 text-gray-700 hover:border-black'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8 flex items-center gap-4">
               <span className="font-bold text-sm">Qty:</span>
               <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                 <button 
                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
                   className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600"
                 >
                   <Minus className="w-4 h-4" />
                 </button>
                 <div className="px-4 py-1 text-sm font-semibold border-x border-gray-300 text-center min-w-[3rem]">
                   {quantity}
                 </div>
                 <button 
                   onClick={() => setQuantity(quantity + 1)}
                   className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600"
                 >
                   <Plus className="w-4 h-4" />
                 </button>
               </div>
            </div>

            {/* Buttons */}
            <div className="mb-6">
               <button 
                 onClick={onTryOnClick}
                 className="border border-[#7D29A8] text-[#7D29A8] rounded-full px-5 py-2 text-sm font-bold flex items-center gap-2 hover:bg-[#7D29A8]/5 transition-colors mb-4 shadow-sm border-[1.5px]"
               >
                  <span className="relative flex h-[9px] w-[9px]">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-[9px] w-[9px] bg-[#7D29A8]"></span>
                  </span>
                  Try-On
               </button>

               <div className="flex items-stretch gap-3 h-12">
                 <button className="flex-1 bg-[#902cae] hover:bg-[#7D29A8] text-white font-bold rounded flex items-center justify-center transition-colors">
                   ADD TO MY CLOSET
                 </button>
                 <button className="flex-1 bg-black hover:bg-gray-800 text-white font-bold rounded flex items-center justify-center transition-colors">
                   ADD TO CART
                 </button>
                 <button className="w-12 border border-gray-300 rounded flex items-center justify-center hover:border-black transition-colors shrink-0">
                   <Heart className="w-5 h-5 text-gray-700" />
                 </button>
               </div>
            </div>
            
          </div>
        </div>

        {/* Info & Reviews Section */}
        <div className="flex flex-col lg:flex-row gap-8 w-full border-t border-gray-200 pt-10">
          
          {/* Left: Reviews */}
          <div id="reviews" className="flex-[2] pr-0 xl:pr-10">
             <div className="flex justify-between items-end mb-6">
               <h2 className="text-xl font-bold">Customer Reviews (1,649)</h2>
               <button className="text-sm text-gray-600 hover:text-black flex items-center">
                 View All <ChevronRight className="w-4 h-4" />
               </button>
             </div>
             
             <div className="bg-gray-50/50 border border-gray-100 p-6 rounded mb-8">
               <div className="text-5xl font-bold mb-2">4.85<span className="text-lg text-gray-400 font-normal ml-2">out of 5</span></div>
               <div className="flex items-center space-x-1 mb-6">
                 {[1, 2, 3, 4, 5].map(i => (
                   <Star key={i} className={`w-5 h-5 ${i <= 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} />
                 ))}
               </div>

               <div className="space-y-4 text-sm max-w-sm mb-6">
                  <div className="flex items-center justify-between">
                     <span className="text-gray-500 w-24">Overall Fit:</span>
                     <div className="flex-1 flex gap-2 w-full mx-4">
                       <div className="h-1.5 w-1/4 bg-gray-200 rounded-full shrink-0"></div>
                       <div className="h-1.5 flex-1 bg-black rounded-full relative">
                         <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold whitespace-nowrap">True to Size (81%)</div>
                       </div>
                       <div className="h-1.5 w-[15%] bg-gray-200 rounded-full shrink-0"></div>
                     </div>
                  </div>
               </div>

               <div className="flex flex-wrap gap-2 text-xs mb-4">
                  {['Will Repurchase (6)', 'Fast Logistics (19)', 'Full Cup Size (18)', 'Sexy (25)', 'Gorgeous (36)', 'Costume (12)'].map(tag => (
                    <span key={tag} className="bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full">
                      {tag}
                    </span>
                  ))}
               </div>
             </div>
             
             {/* Sample Reviews */}
             <div className="space-y-6">
                {[1, 2].map((review) => (
                  <div key={review} className="border-b border-gray-100 pb-6">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">t***x <span className="ml-2">31 Aug, 2025</span></span>
                    </div>
                    <div className="flex items-center space-x-1 mb-2">
                       {[1, 2, 3, 4, 5].map(i => (
                         <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                       ))}
                    </div>
                    <div className="text-[11px] text-gray-500 mb-3 flex flex-wrap gap-4">
                       <span>Overall Fit: <b className="font-medium text-gray-700">True to Size</b></span>
                       <span>Body Shape: <b className="font-medium text-gray-700">Hourglass</b></span>
                       <span>Color: <b className="font-medium text-gray-700">Burgundy</b></span>
                       <span>Size: <b className="font-medium text-gray-700">XS</b></span>
                    </div>
                    <p className="text-sm text-gray-800 mb-3">
                      I love this dress. The material is amazing, it has boning in the waist so you don't need to worry about accidentally flashing anyone.
                    </p>
                    <div className="flex gap-2">
                       <img src={product.imageUrl} className="w-16 h-16 object-cover bg-gray-100" />
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Right: Info Panels */}
          <div className="flex-1 space-y-6">
             <div className="border border-gray-200 rounded">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                   <h3 className="font-bold text-sm">Shipping to <span className="font-normal text-gray-600">Philippines</span></h3>
                </div>
                <div className="p-4 space-y-4 text-sm">
                   <div className="flex items-start gap-3">
                      <div className="font-bold text-green-700 w-5">🚚</div>
                      <div>
                        <div className="font-bold">Free Shipping</div>
                        <div className="text-gray-500 text-xs mt-0.5">Est. Delivery: 4-6 Business Days</div>
                      </div>
                   </div>
                   <div className="flex items-start gap-3">
                      <div className="font-bold text-green-700 w-5">💵</div>
                      <div className="font-bold">COD Policy</div>
                   </div>
                   <div className="flex items-start gap-3">
                      <div className="font-bold text-green-700 w-5">📦</div>
                      <div className="font-bold">Return Policy</div>
                   </div>
                   <div className="flex items-start gap-3">
                      <div className="font-bold text-green-700 w-5">🛡️</div>
                      <div>
                        <div className="font-bold">Shopping Security</div>
                        <div className="text-gray-500 text-xs mt-0.5 flex gap-2"><span>✓ Safe Payments</span> <span>✓ Privacy Protection</span></div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="border border-gray-200 rounded divide-y divide-gray-200">
                <div className="flex justify-between items-center px-4 py-3 font-bold text-sm cursor-pointer hover:bg-gray-50">
                  <span>Description</span>
                  <span>+</span>
                </div>
                <div className="flex justify-between items-center px-4 py-3 font-bold text-sm cursor-pointer hover:bg-gray-50">
                  <span>Size & Fit</span>
                  <span>+</span>
                </div>
                <div className="px-4 py-3 flex flex-col gap-3 hover:bg-gray-50">
                  <div className="flex justify-between items-center font-bold text-sm cursor-pointer">
                    <span>About Store</span>
                    <span>-</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-gray-200 shadow-inner p-1 rounded">
                       <div className="w-full h-full bg-white text-[8px] font-bold text-center leading-tight flex items-center justify-center">SHEIN ICON</div>
                     </div>
                     <div>
                       <div className="font-bold text-sm">SHEIN ICON</div>
                       <div className="text-[11px] text-gray-500">999K+ Sold | 999K+ Followers</div>
                     </div>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="mt-16 w-full">
           <h3 className="text-xl font-bold mb-6">Customers Also Viewed</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
             {/* Mocking generic products by reusing the Product component API */}
             {Array.from({length: 5}).map((_, i) => (
                <ProductCard 
                  key={i} 
                  product={{...product, id: `related-${i}`}} 
                  category="Related" 
                  onClick={() => onProductClick(product)} 
                />
             ))}
           </div>
        </div>

      </div>
    </div>
  );
}
