import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, ChevronDown, Heart, Trash2, ShoppingBag, CheckCircle2, Loader2 } from 'lucide-react';
import { User } from 'firebase/auth';
import ProductCard from './ProductCard';
import { Product } from './ShoppingPage';
import {
  CartItem as FirestoreCartItem,
  getCartItems,
  removeFromCart,
  updateCartItemQuantity,
  clearCartItems
} from '../../services/cartService';
import { saveOrder } from '../../services/orderService';

interface CartPageProps {
  onProductClick?: (product: Product) => void;
  user?: User | null;
  onCartUpdated?: () => void;
}

type ViewState = 'cart' | 'checkout-success';

export default function CartPage({ onProductClick, user, onCartUpdated }: CartPageProps) {
  const [items, setItems] = useState<(FirestoreCartItem & { selected: boolean })[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [viewState, setViewState] = useState<ViewState>('cart');
  const [orderId, setOrderId] = useState<string>('');
  const [openVariantDropdown, setOpenVariantDropdown] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const cartItems = await getCartItems(user.uid);
      setItems(cartItems.map(item => ({ ...item, selected: true })));
    } catch (err) {
      console.error('Failed to fetch cart', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  React.useEffect(() => {
    const handleClickOutside = () => setOpenVariantDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleItemSelect = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, selected: !i.selected } : i));
  };

  const toggleAllItems = () => {
    const allSelected = items.length > 0 && items.every(i => i.selected);
    setItems(prev => prev.map(i => ({ ...i, selected: !allSelected })));
  };

  const handleRemoveItem = async (cartItemId: string) => {
    if (!user) return;
    try {
      await removeFromCart(user.uid, cartItemId);
      setItems(prev => prev.filter(i => i.id !== cartItemId));
      if (onCartUpdated) onCartUpdated();
    } catch (err) {
      console.error('Remove error', err);
    }
  };

  const handleUpdateQuantity = async (cartItemId: string, qty: number) => {
    if (!user) return;
    try {
      await updateCartItemQuantity(user.uid, cartItemId, qty);
      setItems(prev => prev.map(i => i.id === cartItemId ? { ...i, quantity: qty } : i));
    } catch (err) {
      console.error('Update qty error', err);
    }
  };

  const handleCheckout = async () => {
    if (!user) return;
    const selectedItems = items.filter(i => i.selected);
    if (selectedItems.length === 0) return;

    setCheckoutLoading(true);
    try {
      const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const id = await saveOrder(
        user.uid,
        user.email || '',
        selectedItems.map(item => ({
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          price: item.price,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          quantity: item.quantity,
          category: item.category
        })),
        subtotal
      );
      const selectedIds = selectedItems.map(i => i.id);
      await clearCartItems(user.uid, selectedIds);
      setItems(prev => prev.filter(i => !selectedIds.includes(i.id)));
      if (onCartUpdated) onCartUpdated();
      setOrderId(id);
      setViewState('checkout-success');
    } catch (err) {
      console.error('Checkout error', err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const selectedItems = items.filter(i => i.selected);
  const totalRetailPrice = selectedItems.reduce((acc, item) => acc + item.price * item.quantity * 1.79, 0);
  const totalEstimatedPrice = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalSavings = totalRetailPrice - totalEstimatedPrice;
  const isAllSelected = items.length > 0 && items.every(i => i.selected);

  if (viewState === 'checkout-success') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order Placed!</h2>
          <p className="text-gray-500 mb-1">Your order has been saved successfully.</p>
          <p className="text-xs text-gray-400 mb-6 break-all">Order ID: <span className="font-mono font-bold text-gray-700">{orderId}</span></p>
          <button
            onClick={() => setViewState('cart')}
            className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 font-sans text-gray-900 min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 pt-6 pb-24">
        
        <div className="flex justify-center text-sm md:text-base font-medium text-gray-800 mb-8 border-b border-gray-200 pb-4">
           <span className="font-bold">Cart</span> 
           <span className="mx-2 text-gray-400">&gt;</span> 
           <span className="text-gray-400 font-light">Place Order</span>
           <span className="mx-2 text-gray-400">&gt;</span> 
           <span className="text-gray-400 font-light">Pay</span>
           <span className="mx-2 text-gray-400">&gt;</span> 
           <span className="text-gray-400 font-light">Order Complete</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
            <p className="text-gray-500 font-medium">Loading your cart...</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 mb-16">
            <div className="flex-1 space-y-4">
              
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

              {items.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 p-4 shadow-sm relative group transition-all">
                  <div className="flex items-center mb-4">
                    <input 
                      type="checkbox" 
                      checked={item.selected}
                      onChange={() => toggleItemSelect(item.id)}
                      className="w-5 h-5 mr-3 border-gray-300 rounded-sm text-black focus:ring-black accent-black shrink-0"
                    />
                    <div className="flex items-center font-bold text-[15px] cursor-pointer hover:underline underline-offset-2">
                      🛍️ <span className="mx-2">{item.category || 'SHEIN'}</span> <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex ml-8">
                    <div className="relative w-24 h-32 shrink-0 border border-gray-100 mr-4 cursor-pointer">
                      <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between pt-1">
                      <div>
                        <h4 className="text-[13px] text-gray-800 leading-tight mb-2 hover:text-black hover:underline cursor-pointer line-clamp-2">
                          {item.productName}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 mb-2 relative">
                           <div 
                             onClick={(e) => { e.stopPropagation(); setOpenVariantDropdown(openVariantDropdown === item.id ? null : item.id); }}
                             className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded inline-flex items-center cursor-pointer hover:bg-gray-200"
                           >
                             <div className="w-3 h-3 rounded-full bg-blue-200 mr-1.5 shadow-inner"></div>
                             {item.selectedColor} / {item.selectedSize} <ChevronDown className="w-3.5 h-3.5 ml-1 text-gray-500" />
                           </div>
                           {openVariantDropdown === item.id && (
                             <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 shadow-xl rounded-sm z-50 py-2">
                               <div className="px-3 py-1.5 text-xs text-gray-500 border-b border-gray-100">Selected Variant</div>
                               <div className="px-3 py-2 text-xs font-medium bg-gray-50 flex items-center">
                                 <div className="w-3 h-3 rounded-full bg-blue-200 mr-2 shadow-inner"></div>
                                 {item.selectedColor} / {item.selectedSize}
                               </div>
                             </div>
                           )}
                        </div>
                      </div>

                      <div className="flex justify-between items-end mt-4">
                        <div>
                          <div className="flex items-baseline mb-1">
                            <span className="text-xl font-bold text-red-600 mr-2">₱{item.price}</span>
                            <span className="text-gray-400 line-through text-sm">₱{Math.round(item.price * 1.79)}</span>
                          </div>
                          <div className="flex items-center text-[10px] space-x-2">
                            <span className="text-red-600 bg-red-50 border border-red-100 px-1 font-semibold rounded-sm">Estimated -44%</span>
                          </div>
                        </div>

                        <div className="flex items-center">
                           <div className="flex items-center mr-4 border border-gray-300 rounded overflow-hidden">
                             <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 border-r border-gray-200">Qty:</span>
                             <select 
                               value={item.quantity} 
                               onChange={(e) => handleUpdateQuantity(item.id, Number(e.target.value))}
                               className="pl-2 pr-6 py-1 text-sm bg-white outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_8px_center] bg-[length:8px_8px]"
                             >
                               {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                             </select>
                           </div>
                           <div className="flex space-x-3 text-gray-400">
                             <button className="hover:text-black transition-colors"><Heart className="w-5 h-5" /></button>
                             <button onClick={() => handleRemoveItem(item.id)} className="hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                           </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="bg-white p-12 text-center border border-gray-200">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4 font-medium">Your cart is empty.</p>
                  <p className="text-gray-400 text-sm mb-6">Add products to your cart to see them here.</p>
                </div>
              )}
            </div>

            <div className="lg:w-[380px] shrink-0 mt-8 lg:mt-0 relative">
               <div className="bg-white border border-gray-200 p-6 sticky top-24 shadow-sm">
                  <h2 className="text-xl font-bold mb-1">Order Summary</h2>
                  <p className="text-[11px] text-gray-500 mb-6">Proceed to apply discounts and account assets then confirm the final price.</p>
                  
                  {selectedItems.length > 0 && (
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
                      {selectedItems.map(item => (
                        <div key={item.id} className="w-[60px] h-20 relative shrink-0 border border-gray-200">
                           <img src={item.productImage} className="w-full h-full object-cover" alt={item.productName} />
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
                      <span>₱{Math.round(totalRetailPrice)}</span>
                    </div>
                    {totalSavings > 0 && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Promotions:</span>
                          <span className="text-red-500 font-medium">-₱{Math.round(totalSavings * 0.9)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Coupon: <span className="text-orange-500 ml-1">Last 8 hours</span></span>
                          <span className="text-red-500 font-medium">-₱{Math.round(totalSavings * 0.1)}</span>
                        </div>
                      </>
                    )}
                    
                    <div className="flex justify-between items-end pt-2">
                      <span className="font-bold text-gray-900 text-base">Estimated Price:</span>
                      <div className="text-right">
                         <span className="font-bold text-3xl text-red-600 block leading-none">₱{Math.round(totalEstimatedPrice)}</span>
                         {totalSavings > 0 && <span className="text-[11px] text-red-500 mt-1 block">Saved ₱{Math.round(totalSavings)}</span>}
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
                    onClick={handleCheckout}
                    disabled={selectedItems.length === 0 || checkoutLoading}
                    className="w-full py-4 px-4 bg-black text-white font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(0,0,0,0.2)] rounded-sm flex items-center justify-center gap-2"
                  >
                    {checkoutLoading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Placing Order...</>
                    ) : (
                      <>Checkout Now ({selectedItems.length})</>
                    )}
                    {!checkoutLoading && selectedItems.length > 0 && <div className="text-[11px] text-red-400 font-medium mt-1 uppercase tracking-wide hidden">⏳ Almost sold out!</div>}
                  </button>
                  {!checkoutLoading && selectedItems.length > 0 && (
                    <p className="text-[11px] text-red-400 font-medium mt-2 text-center uppercase tracking-wide">⏳ Almost sold out!</p>
                  )}
                  <p className="text-[11px] text-gray-500 mt-3 text-center">
                    Apply a <b className="text-gray-700 font-bold">Coupon Code, SHEIN Points</b> on the next step.
                  </p>

                  <div className="mt-10 pt-6 border-t border-gray-100">
                    <h3 className="font-bold text-lg mb-4 text-gray-800">We Accept</h3>
                    <div className="flex flex-wrap gap-2">
                       <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center font-bold text-[#00A76F] text-[10px]">CASH</div>
                       <div className="w-12 h-8 bg-blue-900 border border-gray-200 rounded flex items-center justify-center font-bold text-white text-[10px] italic">PayPal</div>
                       <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center font-black text-[#1A1F71] text-[12px] italic">VISA</div>
                       <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center relative overflow-hidden">
                         <div className="absolute w-5 h-5 rounded-full bg-red-500 -ml-2 mix-blend-multiply opacity-90"></div>
                         <div className="absolute w-5 h-5 rounded-full bg-yellow-400 -mr-2 mix-blend-multiply opacity-90"></div>
                       </div>
                       <div className="w-12 h-8 bg-blue-500 border border-gray-200 rounded flex items-center justify-center font-bold text-white text-[10px] italic">GCash</div>
                       <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center font-bold text-green-600 text-[10px]">GrabPay</div>
                    </div>
                  </div>

               </div>
            </div>
          </div>
        )}

        {!loading && (
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
                   user={user}
                   onClick={onProductClick ? () => onProductClick({
                     id: `sample-${i}`,
                     name: `Swim Mod Women's Summer Bea...`,
                     price: 411,
                     rating: 5,
                     reviews: 527,
                     sold: 21600,
                     imageUrl: 'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?q=80&w=600&auto=format&fit=crop'
                   }) : undefined}
                   onAddToCart={onCartUpdated}
                 />
               ))}
             </div>
             
             <button className="border border-black text-black px-12 py-3.5 rounded hover:bg-black hover:text-white transition-colors font-bold tracking-wide uppercase text-sm">
               Load More Products
             </button>
          </div>
        )}

      </div>
    </div>
  );
}
