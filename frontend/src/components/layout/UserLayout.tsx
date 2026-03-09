import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Crown } from 'lucide-react';

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-[#ED1C24] font-bold text-xl tracking-tight">
                Royal Fades
              </Link>
            </div>
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#home" className="text-slate-800 hover:text-[#ED1C24] font-medium transition-colors">Home</a>
              <a href="#services" className="text-slate-800 hover:text-[#ED1C24] font-medium transition-colors">Services</a>
              <a href="#queue" className="text-slate-800 hover:text-[#ED1C24] font-medium transition-colors">Live Queue</a>
              <Link to="/book" className="bg-[#ED1C24] text-white px-5 py-2.5 rounded-md font-bold hover:bg-opacity-90 transition-all shadow-sm">
                Book Now
              </Link>
            </div>
            <div className="md:hidden flex items-center">
              <button type="button" className="text-[#ED1C24] p-2">
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400">© 2024 Royal Fades Barbershop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;