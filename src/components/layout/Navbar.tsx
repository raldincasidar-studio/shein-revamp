import { MapPin, Search, ShoppingCart, Heart, Shirt, User, ChevronDown, Menu, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface NavbarProps {
  onSignOut: () => void;
  setPage?: (page: 'dashboard' | 'shop' | 'cart' | 'tryon' | 'closet' | 'admin') => void;
  setCategory?: (category: string) => void;
  setSearchQuery?: (query: string) => void;
  cartCount?: number;
}

const LOCATIONS = ['Philippines', 'United States', 'United Kingdom', 'Canada', 'Australia'];
const COL1_CATEGORIES = [
  'Just for You', 'New In', 'Sale', 'Women Clothing', 'Beachwear', 
  'Kids', 'Curve', 'Men clothing', 'Shoes', 'Jewelry & Accessories', 
  'Underwear & Sleepwear'
];

const COL2_CATEGORIES = [
  'Baby & Maternity', 'Bags & Luggage', 'Home & Living', 'Beauty & Health', 
  'Sports & Outdoors', 'Home Textiles', 'Tools & Home Improvement', 'Pet Supplies'
];

export default function Navbar({ onSignOut, setPage, setCategory, setSearchQuery, cartCount = 0 }: NavbarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [location, setLocation] = useState('Philippines');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState(['summer vibes', 'cozy sweatshirt', 'hecker outfit']);
  const [searchInput, setSearchInput] = useState('');
  
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
        setShowLocationMenu(false);
        setShowCategoryMenu(false);
        setIsMobileMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const CartBadge = ({ className = '' }: { className?: string }) => (
    <div className={`relative ${className}`}>
      <ShoppingCart className="h-5 w-5" />
      {cartCount > 0 && (
        <span className="absolute -top-1.5 -right-2 bg-white text-black text-[10px] font-bold px-1 rounded-full border border-black min-w-[16px] text-center">
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}
    </div>
  );

  const CartBadgeLarge = () => (
    <div className="relative">
      <ShoppingCart className="h-6 w-6 mb-1 text-white" />
      {cartCount > 0 && (
        <span className="absolute -top-1.5 -right-2 bg-white text-black text-[10px] font-bold px-1 rounded-full border border-black min-w-[16px] text-center">
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}
    </div>
  );

  return (
    <nav ref={navRef} className="bg-black text-white w-full sticky top-0 z-50">
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex md:hidden mr-4">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="hover:text-gray-300">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <div className="hidden md:flex flex-1 items-center space-x-2 text-sm font-medium">
          <div className="relative">
            <button 
              onClick={() => { setShowLocationMenu(!showLocationMenu); setShowProfileMenu(false); setShowCategoryMenu(false); }}
              className="flex items-center hover:text-gray-300 transition-colors"
            >
              <MapPin className="h-4 w-4 mr-1" />
              <span>{location}</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </button>
            
            {showLocationMenu && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 rounded-md shadow-lg py-1 z-50">
                {LOCATIONS.map((loc) => (
                  <button 
                    key={loc}
                    onClick={() => { setLocation(loc); setShowLocationMenu(false); }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex justify-center md:justify-center justify-start shrink-0">
          <button 
             onClick={() => {
                if (setPage) setPage('dashboard');
                if (setSearchQuery) setSearchQuery('');
             }}
             className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-[0.25em]"
          >
             SHEIN
          </button>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4 sm:space-x-6">
          <button onClick={() => setIsSearchOpen(true)} className="hover:text-gray-300 transition-colors"><Search className="h-5 w-5" /></button>
          <button onClick={() => setPage && setPage('cart')} className="hover:text-gray-300 transition-colors hidden sm:block">
            <CartBadge />
          </button>
          <button className="hover:text-gray-300 transition-colors hidden md:block"><Heart className="h-5 w-5" /></button>
          <button onClick={() => setPage && setPage('closet')} className="hover:text-gray-300 transition-colors hidden md:block"><Shirt className="h-5 w-5" /></button>
          
          <div className="relative">
            <button 
              onClick={() => { setShowProfileMenu(!showProfileMenu); setShowLocationMenu(false); setShowCategoryMenu(false); }}
              className="hover:text-gray-300 transition-colors flex items-center"
            >
              <User className="h-5 w-5" />
            </button>
            
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-md shadow-lg py-1 z-50">
                <button 
                  onClick={onSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 font-bold"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hidden md:flex justify-center items-center space-x-8 pb-4 text-sm font-semibold tracking-wide relative">
        <div className="relative">
          <button 
             onClick={() => { setShowCategoryMenu(!showCategoryMenu); setShowProfileMenu(false); setShowLocationMenu(false); }}
             className="flex items-center hover:text-gray-300 transition-colors font-bold pb-1"
          >
            Categories <ChevronDown className="h-4 w-4 ml-1" />
          </button>
        </div>
        <button onClick={() => { setCategory && setCategory('Women'); setSearchQuery && setSearchQuery(''); setPage && setPage('shop'); }} className="hover:text-gray-300 transition-colors font-bold pb-1">Women</button>
        <button onClick={() => { setCategory && setCategory('Men'); setSearchQuery && setSearchQuery(''); setPage && setPage('shop'); }} className="hover:text-gray-300 transition-colors font-bold pb-1">Men</button>
        <button onClick={() => { setCategory && setCategory('Kids'); setSearchQuery && setSearchQuery(''); setPage && setPage('shop'); }} className="hover:text-gray-300 transition-colors font-bold pb-1">Kids</button>
        <button onClick={() => { setCategory && setCategory('Sale'); setSearchQuery && setSearchQuery(''); setPage && setPage('shop'); }} className="text-red-500 hover:text-red-400 transition-colors font-bold pb-1">Sale</button>
        <button onClick={() => { setCategory && setCategory('New'); setSearchQuery && setSearchQuery(''); setPage && setPage('shop'); }} className="text-red-500 hover:text-red-400 transition-colors font-bold pb-1">New In</button>
      </div>

      {showCategoryMenu && (
        <div className="hidden md:block absolute top-[100%] left-0 w-full bg-white shadow-xl border-t border-gray-100 z-50">
          <div className="max-w-7xl mx-auto px-6 py-10 flex gap-12">
            <div className="flex-1 flex flex-col gap-6">
              {COL1_CATEGORIES.map(cat => (
                <button 
                   key={cat} 
                   onClick={() => { 
                      setShowCategoryMenu(false); 
                      setCategory && setCategory(cat); 
                      setSearchQuery && setSearchQuery(''); 
                      setPage && setPage('shop'); 
                   }} 
                   className="text-left text-[15px] font-light text-gray-800 hover:text-black hover:font-normal transition-all"
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex-1 flex flex-col gap-6">
              {COL2_CATEGORIES.map(cat => (
                <button 
                   key={cat} 
                   onClick={() => { 
                      setShowCategoryMenu(false); 
                      setCategory && setCategory(cat); 
                      setSearchQuery && setSearchQuery(''); 
                      setPage && setPage('shop'); 
                   }} 
                   className="text-left text-[15px] font-light text-gray-800 hover:text-black hover:font-normal transition-all"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800 absolute w-full left-0 top-full shadow-2xl flex flex-col pt-2 pb-6 z-40">
           <div className="px-6 py-4 border-b border-gray-800">
             <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Settings</p>
             <div className="relative">
              <button 
                onClick={() => { setShowLocationMenu(!showLocationMenu); setShowCategoryMenu(false); }}
                className="flex items-center justify-between w-full hover:text-gray-300 transition-colors text-lg"
              >
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3" />
                  <span>{location}</span>
                </div>
                <ChevronDown className={`h-5 w-5 transition-transform ${showLocationMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {showLocationMenu && (
                <div className="mt-3 pl-8 flex flex-col space-y-3">
                  {LOCATIONS.filter(l => l !== location).map((loc) => (
                    <button 
                      key={loc}
                      onClick={() => { setLocation(loc); setShowLocationMenu(false); }}
                      className="text-left text-base text-gray-400 hover:text-white"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>
           </div>

           <div className="px-6 py-4 border-b border-gray-800">
             <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Shop</p>
             <div className="relative mb-3">
              <button 
                onClick={() => { setShowCategoryMenu(!showCategoryMenu); setShowLocationMenu(false); }}
                className="flex items-center justify-between w-full hover:text-gray-300 transition-colors text-lg font-bold"
              >
                <span>Categories</span>
                <ChevronDown className={`h-5 w-5 transition-transform ${showCategoryMenu ? 'rotate-180' : ''}`} />
              </button>
               {showCategoryMenu && (
                <div className="mt-3 pl-4 flex flex-col space-y-3">
                  {[...COL1_CATEGORIES, ...COL2_CATEGORIES].map((cat) => (
                    <button 
                      key={cat}
                      className="text-left text-base text-gray-300 hover:text-white"
                      onClick={() => {
                        setShowCategoryMenu(false);
                        setIsMobileMenuOpen(false);
                        if (setCategory) setCategory(cat);
                        if (setSearchQuery) setSearchQuery('');
                        if (setPage) setPage('shop');
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
             </div>
             
             <div className="flex flex-col space-y-4 pt-1">
               <button onClick={() => { setIsMobileMenuOpen(false); if(setCategory) setCategory('Women'); if(setSearchQuery) setSearchQuery(''); if(setPage) setPage('shop'); }} className="text-left text-lg font-bold hover:text-gray-300">Women</button>
               <button onClick={() => { setIsMobileMenuOpen(false); if(setCategory) setCategory('Men'); if(setSearchQuery) setSearchQuery(''); if(setPage) setPage('shop'); }} className="text-left text-lg font-bold hover:text-gray-300">Men</button>
               <button onClick={() => { setIsMobileMenuOpen(false); if(setCategory) setCategory('Kids'); if(setSearchQuery) setSearchQuery(''); if(setPage) setPage('shop'); }} className="text-left text-lg font-bold hover:text-gray-300">Kids</button>
               <button onClick={() => { setIsMobileMenuOpen(false); if(setCategory) setCategory('Sale'); if(setSearchQuery) setSearchQuery(''); if(setPage) setPage('shop'); }} className="text-left text-lg font-bold text-red-500 hover:text-red-400">Sale</button>
               <button onClick={() => { setIsMobileMenuOpen(false); if(setCategory) setCategory('New'); if(setSearchQuery) setSearchQuery(''); if(setPage) setPage('shop'); }} className="text-left text-lg font-bold text-red-500 hover:text-red-400">New In</button>
             </div>
           </div>

           <div className="px-6 py-5 flex items-center justify-around">
             <button onClick={() => { setIsMobileMenuOpen(false); setPage && setPage('cart'); }} className="flex flex-col items-center hover:text-gray-300 text-gray-400 relative">
                <CartBadgeLarge />
                <span className="text-xs font-semibold text-white">Cart</span>
             </button>
             <button className="flex flex-col items-center hover:text-gray-300 text-gray-400">
                <Heart className="h-6 w-6 mb-1 text-white" />
                <span className="text-xs font-semibold text-white">Saved</span>
             </button>
             <button onClick={() => { setIsMobileMenuOpen(false); setPage && setPage('closet'); }} className="flex flex-col items-center hover:text-gray-300 text-gray-400">
                <Shirt className="h-6 w-6 mb-1 text-white" />
                <span className="text-xs font-semibold text-white">Closet</span>
             </button>
           </div>
        </div>
      )}

      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/50">
          <div className="bg-black text-white w-full">
            <div className="flex items-center justify-between px-6 py-8 max-w-5xl mx-auto">
              <div className="flex items-center flex-1">
                <Search className="h-6 w-6 mr-4" />
                <input 
                  type="text" 
                  placeholder="Search SHEIN" 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchInput.trim() !== '') {
                      setIsSearchOpen(false);
                      if (setSearchQuery) setSearchQuery(searchInput.trim());
                      if (setPage) setPage('shop');
                      setSearchInput('');
                      if (!recentSearches.includes(searchInput.trim())) {
                        setRecentSearches([searchInput.trim(), ...recentSearches].slice(0, 5));
                      }
                    }
                  }}
                  className="bg-transparent text-white text-xl outline-none w-full placeholder:text-gray-400 font-light"
                  autoFocus
                />
              </div>
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="ml-6 text-white hover:text-gray-300 transition-colors"
               >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <div className="bg-white w-full shadow-2xl">
             <div className="max-w-5xl mx-auto px-6 py-10">
               <div className="flex justify-between items-center mb-8">
                 <h3 className="text-[15px] text-gray-800 font-light uppercase tracking-wide">RECENT SEARCHES</h3>
                 <button 
                   onClick={() => setRecentSearches([])}
                   className="text-[15px] text-gray-600 hover:text-gray-900 transition-colors font-light"
                 >
                   Clear All
                 </button>
               </div>
               
               {recentSearches.length > 0 ? (
                 <ul className="space-y-5">
                   {recentSearches.map((term, i) => (
                     <li 
                        key={i} 
                        onClick={() => {
                          setIsSearchOpen(false);
                          if (setSearchQuery) setSearchQuery(term);
                          if (setPage) setPage('shop');
                        }}
                        className="text-gray-800 text-[17px] font-light hover:text-black cursor-pointer transition-colors"
                     >
                       {term}
                     </li>
                   ))}
                 </ul>
               ) : (
                 <p className="text-gray-500 text-sm font-light">No recent searches</p>
               )}
             </div>
          </div>
          
          <div className="flex-1 cursor-pointer backdrop-blur-sm" onClick={() => setIsSearchOpen(false)} />
        </div>
      )}
    </nav>
  );
}
