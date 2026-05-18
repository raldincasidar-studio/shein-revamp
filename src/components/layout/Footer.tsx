import { Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react';

interface FooterProps {
  onAdminClick?: () => void;
}

export default function Footer({ onAdminClick }: FooterProps) {
  return (
    <footer className="bg-black text-white w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Column 1 */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-6">COMPANY INFO</h3>
            <ul className="space-y-4 text-xs text-gray-400 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">About SHEIN</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>
          
          {/* Column 2 */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-6">HELP & SUPPORT</h3>
            <ul className="space-y-4 text-xs text-gray-400 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Refund</a></li>
              <li><a href="#" className="hover:text-white transition-colors">How To Order</a></li>
              <li><a href="#" className="hover:text-white transition-colors">How To Track</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
            </ul>
          </div>
          
          {/* Column 3 */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-6">CUSTOMER CARE</h3>
            <ul className="space-y-4 text-xs text-gray-400 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Payment Method</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          {/* Column 4 */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-6">FOLLOW US</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Youtube className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-500 font-medium">
            ©2009-2026 SHEIN All Rights{' '}
            <button type="button" onClick={onAdminClick} className="hover:text-gray-300 focus:outline-none">
              Reserved
            </button>
          </p>
        </div>
      </div>
    </footer>
  );
}
