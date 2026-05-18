import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Heart, Search, Trash2 } from 'lucide-react';
import ProductCard from './ProductCard';
import { Product } from './ShoppingPage';

interface CartItem {
  id: string;
  store: string;
  name: string;
  variant: string;
  price: number;
  originalPrice: number;
  quantity: number;
  imageUrl: string;
  stockStatus?: string;
  selected: boolean;
  storeUrl?: string;
  soldCount?: string;
}

export default function CartPage({ onProductClick }: { onProductClick?: (product: Product) => void }) {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: 'item-1',
      store: 'Malolo',
      name: "Men's Casual Solid Color Button Polo Shirt, Summer Men's Polo Shirt",
      variant: 'Baby Blue / S',
      price: 81,
      originalPrice: 386,
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=400&h=400&auto=format&fit=crop',
      stockStatus: '5 Left',
      selected: true,
      soldCount: '100+ sold'
    },
    {
      id: 'item-2',
      store: 'SHEIN MOD',
      name: 'SHEIN MOD Tube Top With Side Drawstrings, Asymmetrical Hem, Retro Printed Tube Top, Autumn Top, Top...',
      variant: 'Rusty Rose / XS',
      price: 41,
      originalPrice: 196,
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1434389673909-775b81a70519?q=80&w=400&h=400&auto=format&fit=crop',
      stockStatus: 'Almost Sold Out',
      selected: false,
      soldCount: '700+ sold'
    }
  ]);
  
  const selectedItems = items.filter(i => i.selected);
  const totalRetailPrice = selectedItems.reduce((acc, item) => acc + (item.originalPrice * item.quantity), 0);
  const totalEstimatedPrice = selectedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalSavings = totalRetailPrice - totalEstimatedPrice;
  const isAllSelected = items.length > 0 && selectedItems.length === items.length;

  const toggleItemSelect = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, selected: !i.selected } : i));
  };

  const toggleAllItems = () => {
    setItems(items.map(i => ({ ...i, selected: !isAllSelected })));
  };

  const updateQuantity = (id: string, qty: number) => {
    setItems(items.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const [openVariantDropdown, setOpenVariantDropdown] = useState<string | null>(null);

  const toggleVariantDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenVariantDropdown(openVariantDropdown === id ? null : id);
  };

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = () => setOpenVariantDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-gray-50 font-sans text-gray-900 min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 pt-6 pb-24">
        
        {/* Breadcrumb / Top Steps */}
        <div className="flex justify-center text-sm md:text-base font-medium text-gray-800 mb-8 border-b border-gray-200 pb-4">
           <span className="font-bold">Cart</span> 
           <span className="mx-2 text-gray-400">&gt;</span> 
           <span className="text-gray-400 font-light">Place Order</span>
           <span className="mx-2 text-gray-400">&gt;</span> 
           <span className="text-gray-400 font-light">Pay</span>
           <span className="mx-2 text-gray-400">&gt;</span> 
           <span className="text-gray-400 font-light">Order Complete</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-16">
          {/* Left Column - Cart Items */}
          <div className="flex-1 space-y-4">
            
            {/* Banner area */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="bg-white px-4 py-3 border border-gray-200 text-[13px] flex items-center justify-between flex-1 relative overflow-hidden">
                <div className="flex items-center text-gray-700">
                  <span className="text-green-600 mr-2 font-bold text-sm">✓</span> Enjoy Free Shipping! Checkout now!
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent" />
              </div>
              <div className="bg-orange-50 px-4 py-3 border border-orange-100 text-[13px] flex items-center justify-between flex-1">
                <div className="flex items-center text-gray-700">
                  <span className="text-orange-500 mr-2 font-bold text-sm">✓</span> Eligible for extra <b className="text-orange-600 mx-1">18% OFF</b> after ordering
                </div>
              </div>
            </div>

            {/* Select All Bar */}
            <div className="bg-white p-4 border border-gray-200 flex items-center justify-between shadow-sm">
               <div className="flex items-center">
                 <input 
                   type="checkbox" 
                   checked={isAllSelected} 
                   onChange={toggleAllItems}
                   className="w-5 h-5 mr-3 border-gray-300 rounded-sm text-black focus:ring-black accent-black"
                 />
                 <span className="font-black text-lg tracking-wide uppercase">ALL ITEMS ({items.length})</span>
                 <span className="ml-3 border border-green-500 text-green-600 text-[11px] px-2 py-0.5 rounded-full font-bold bg-green-50/50 hidden sm:inline-block">
                    ✓ Free shipping on all items
                 </span>
               </div>
               <button className="text-sm font-bold text-gray-700 hover:text-black flex items-center">
                  Select <ChevronRight className="w-4 h-4 ml-1" />
               </button>
            </div>

            {/* Cart Items List */}
            {items.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 p-4 shadow-sm relative group transition-all">
                {/* Store Header */}
                <div className="flex items-center mb-4">
                  <input 
                    type="checkbox" 
                    checked={item.selected}
                    onChange={() => toggleItemSelect(item.id)}
                    className="w-5 h-5 mr-3 border-gray-300 rounded-sm text-black focus:ring-black accent-black shrink-0"
                  />
                  <div className="flex items-center font-bold text-[15px] cursor-pointer hover:underline underline-offset-2">
                    🛍️ <span className="mx-2">{item.store}</span> <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                  {item.store === 'SHEIN MOD' && <span className="ml-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] px-1.5 rounded-sm font-bold italic tracking-wider">trends &gt;</span>}
                </div>

                {/* Item Details */}
                <div className="flex ml-8">
                  {/* Image */}
                  <div className="relative w-24 h-32 shrink-0 border border-gray-100 mr-4 cursor-pointer">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    {item.stockStatus && (
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm text-white text-center text-[10px] py-1 font-bold truncate">
                        {item.stockStatus}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between pt-1">
                    <div>
                      <h4 className="text-[13px] text-gray-800 leading-tight mb-2 hover:text-black hover:underline cursor-pointer line-clamp-2">
                        {item.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mb-2 relative">
                         <div 
                           onClick={(e) => toggleVariantDropdown(item.id, e)}
                           className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded inline-flex items-center cursor-pointer hover:bg-gray-200"
                         >
                           <div className="w-3 h-3 rounded-full bg-blue-200 mr-1.5 shadow-inner"></div>
                           {item.variant} <ChevronDown className="w-3.5 h-3.5 ml-1 text-gray-500" />
                         </div>
                         {openVariantDropdown === item.id && (
                           <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 shadow-xl rounded-sm z-50 py-2">
                             <div className="px-3 py-1.5 text-xs text-gray-500 border-b border-gray-100">Select Variant</div>
                             <div 
                               className="px-3 py-2 text-xs font-medium bg-gray-50 hover:bg-gray-100 cursor-pointer flex items-center"
                               onClick={(e) => { e.stopPropagation(); setOpenVariantDropdown(null); }}
                             >
                               <div className="w-3 h-3 rounded-full bg-blue-200 mr-2 shadow-inner"></div>
                               {item.variant}
                             </div>
                             <div 
                               className="px-3 py-2 text-xs font-medium hover:bg-gray-100 cursor-pointer flex items-center"
                               onClick={(e) => { e.stopPropagation(); setOpenVariantDropdown(null); }}
                             >
                               <div className="w-3 h-3 rounded-full bg-red-200 mr-2 shadow-inner"></div>
                               {item.variant.split('/')[0].includes('Blue') ? 'Rose / S' : 'Blue / XS'}
                             </div>
                           </div>
                         )}
                         {item.soldCount && <div className="text-[11px] text-orange-600 flex items-center bg-orange-50 px-1.5 py-0.5 rounded font-medium"><span className="text-orange-500 mr-1">🔥</span> {item.soldCount}</div>}
                      </div>
                    </div>

                    <div className="flex justify-between items-end mt-4">
                      {/* Price area */}
                      <div>
                        {item.selected ? (
                           <div className="flex items-baseline mb-1">
                             <span className="text-xl font-bold text-red-600 mr-2">₱{item.price}</span>
                             <span className="text-gray-400 line-through text-sm">₱{item.originalPrice}</span>
                           </div>
                        ) : (
                           <div className="flex items-baseline mb-1">
                             <span className="text-lg font-bold text-gray-900 mr-2">₱{item.originalPrice}</span>
                           </div>
                        )}
                        <div className="flex items-center text-[10px] space-x-2">
                          {item.selected && <span className="text-red-600 bg-red-50 border border-red-100 px-1 font-semibold rounded-sm">Estimated -79%</span>}
                          {item.selected && <span className="text-orange-500 font-medium cursor-pointer">Last 8 hours <ChevronDown className="inline w-3 h-3" /></span>}
                        </div>
                      </div>

                      {/* Actions & Quantity */}
                      <div className="flex items-center">
                         <div className="flex items-center mr-4 border border-gray-300 rounded overflow-hidden">
                           <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 border-r border-gray-200">Qty:</span>
                           <select 
                             value={item.quantity} 
                             onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                             className="pl-2 pr-6 py-1 text-sm bg-white outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_8px_center] bg-[length:8px_8px]"
                           >
                             {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                           </select>
                         </div>
                         <div className="flex space-x-3 text-gray-400">
                           <button className="hover:text-black transition-colors"><Search className="w-5 h-5" /></button>
                           <button className="hover:text-black transition-colors"><Heart className="w-5 h-5" /></button>
                           <button onClick={() => removeItem(item.id)} className="hover:text-black transition-colors"><Trash2 className="w-5 h-5" /></button>
                         </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="bg-white p-12 text-center border border-gray-200">
                <p className="text-gray-500 mb-4">Your cart is empty.</p>
                <button className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 font-bold tracking-wide">CONTINUE SHOPPING</button>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-[380px] shrink-0 mt-8 lg:mt-0 relative">
             <div className="bg-white border border-gray-200 p-6 sticky top-24 shadow-sm">
                <h2 className="text-xl font-bold mb-1">Order Summary</h2>
                <p className="text-[11px] text-gray-500 mb-6">Proceed to apply discounts and account assets then confirm the final price.</p>
                
                {selectedItems.length > 0 && (
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
                    {selectedItems.map(item => (
                      <div key={item.id} className="w-[60px] h-20 relative shrink-0 border border-gray-200">
                         <img src={item.imageUrl} className="w-full h-full object-cover" />
                         {item.stockStatus && (
                            <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] py-0.5 text-center font-bold truncate">
                              {item.stockStatus}
                            </div>
                         )}
                         <div className="absolute top-0 right-0 bg-white/80 rounded-bl-sm">
                           <span className="text-green-600 text-[10px] leading-none p-0.5 inline-block">✓</span>
                         </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-4 mb-6 border-b border-gray-100 pb-6 text-sm">
                  <div className="flex justify-between items-center text-gray-700 font-medium">
                    <span>Retail Price:</span>
                    <span>₱{totalRetailPrice}</span>
                  </div>
                  {totalSavings > 0 && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Promotions:</span>
                        <span className="text-red-500 font-medium">-₱{totalSavings - (totalSavings * 0.1)} <ChevronDown className="inline w-3 h-3 text-gray-400" /></span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Coupon: <span className="text-orange-500 ml-1">Last 8 hours</span></span>
                        <span className="text-red-500 font-medium">-₱{totalRetailPrice * 0.1} <ChevronDown className="inline w-3 h-3 text-gray-400" /></span>
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-between items-end pt-2">
                    <span className="font-bold text-gray-900 text-base">Estimated Price:</span>
                    <div className="text-right">
                       <span className="font-bold text-3xl text-red-600 block leading-none">₱{totalEstimatedPrice}</span>
                       {totalSavings > 0 && <span className="text-[11px] text-red-500 mt-1 block">Saved ₱{totalSavings}</span>}
                    </div>
                  </div>
                  <div className="text-right tracking-tight text-gray-700 flex justify-end items-center text-[13px] pt-1 pb-1">
                     Reward <span className="font-bold mx-1 text-black">1</span> SHEIN Points <span className="inline-flex items-center justify-center w-3 h-3 border border-gray-400 rounded-full text-[8px] ml-1 text-gray-500">?</span>
                  </div>
                </div>

                <div className="w-full flex justify-end mb-1 mt-[-10px]">
                   <span className="bg-[#24a061] text-white text-[11px] font-bold px-2 py-0.5 rounded-t-sm inline-flex items-center tracking-wide">
                     🛒 Free Shipping
                   </span>
                </div>
                <button 
                  disabled={selectedItems.length === 0}
                  className="w-full py-4 px-4 bg-black text-white font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(0,0,0,0.2)] rounded-sm"
                >
                  Checkout Now ({selectedItems.length})
                  {selectedItems.length > 0 && <div className="text-[11px] text-red-400 font-medium mt-1 uppercase tracking-wide">⏳ Almost sold out!</div>}
                </button>
                <p className="text-[11px] text-gray-500 mt-3 text-center">
                  Apply a <b className="text-gray-700 font-bold">Coupon Code, SHEIN Points</b> on the next step.
                </p>

                {/* We Accept */}
                <div className="mt-10 pt-6 border-t border-gray-100">
                  <h3 className="font-bold text-lg mb-4 text-gray-800">We Accept</h3>
                  <div className="flex flex-wrap gap-2">
                     {/* Simplified payment icons using divs/spans instead of actual SVGs to save space, styled to look like cards */}
                     <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center font-bold text-[#00A76F] text-[10px]">CASH</div>
                     <div className="w-12 h-8 bg-blue-900 border border-gray-200 rounded flex items-center justify-center font-bold text-white text-[10px] italic">PayPal</div>
                     <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center font-black text-[#1A1F71] text-[12px] italic">VISA</div>
                     <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center relative overflow-hidden">
                       <div className="absolute w-5 h-5 rounded-full bg-red-500 -ml-2 mix-blend-multiply opacity-90"></div>
                       <div className="absolute w-5 h-5 rounded-full bg-yellow-400 -mr-2 mix-blend-multiply opacity-90"></div>
                     </div>
                     <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center relative overflow-hidden">
                       <div className="absolute w-5 h-5 rounded-full bg-red-500 -ml-2 mix-blend-multiply opacity-90"></div>
                       <div className="absolute w-5 h-5 rounded-full bg-blue-500 -mr-2 mix-blend-multiply opacity-90"></div>
                     </div>
                     <div className="w-12 h-8 bg-blue-500 border border-gray-200 rounded flex items-center justify-center font-bold text-white text-[9px] text-center leading-tight">AMERICAN<br/>EXPRESS</div>
                     <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center font-semibold text-gray-400 text-[8px] text-center uppercase">Diners Club</div>
                     <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center font-bold text-green-700 text-[10px]">JCB</div>
                     <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center bg-gradient-to-tr from-red-600 via-white to-blue-700 text-white text-[8px] font-bold italic border-b-2 border-red-500">UnionPay</div>
                     <div className="w-12 h-8 bg-blue-500 border border-gray-200 rounded flex items-center justify-center font-bold text-white text-[10px] italic">GCash</div>
                     <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center font-bold text-green-600 text-[10px]">GrabPay</div>
                     <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center font-bold text-gray-800 text-[10px]">G Pay</div>
                  </div>
                </div>

             </div>
          </div>
        </div>

        {/* You Might Like To Fill It With Section */}
        <div className="mt-12 w-full flex flex-col items-center">
           <h2 className="text-3xl font-bold mb-10 tracking-tight text-center">You Might Like To Fill It With</h2>
           
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 w-full mb-12">
             {Array.from({length: 10}).map((_, i) => (
               <ProductCard
                 key={`fill-${i}`}
                 product={{
                   id: `sample-${i}`,
                   name: `Swim Mod Women's Summer Bea...`,
                   price: 411,
                   rating: 5,
                   reviews: 527,
                   sold: 21600,
                   imageUrl: 'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?q=80&w=600&auto=format&fit=crop'
                 }}
                 category="Swim Mod"
                 onClick={onProductClick ? () => onProductClick({
                   id: `sample-${i}`,
                   name: `Swim Mod Women's Summer Bea...`,
                   price: 411,
                   rating: 5,
                   reviews: 527,
                   sold: 21600,
                   imageUrl: 'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?q=80&w=600&auto=format&fit=crop'
                 }) : undefined}
               />
             ))}
           </div>
           
           <button className="border border-black text-black px-12 py-3.5 rounded hover:bg-black hover:text-white transition-colors font-bold tracking-wide uppercase text-sm">
             Load More Products
           </button>
        </div>

      </div>
    </div>
  );
}
