import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, User, Upload as UploadIcon, Trophy, LogOut, Menu, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-gray-900">Clean Campus</span>
          </Link>

          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-800">
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/upload" className="nav-link flex items-center space-x-1">
                  <UploadIcon className="h-5 w-5" />
                  <span>Upload</span>
                </Link>
                <Link to="/leaderboard" className="nav-link flex items-center space-x-1">
                  <Trophy className="h-5 w-5" />
                  <span>Leaderboard</span>
                </Link>
                <Link to="/profile" className="nav-link flex items-center space-x-1">
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <button onClick={handleLogout} className="nav-link flex items-center space-x-1 text-red-600">
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link bg-green-600 text-white px-4 py-2 rounded-md">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pt-4 pb-6 space-y-4 bg-white shadow-md">
          {user ? (
            <>
              <Link to="/upload" className="block nav-link" onClick={() => setMenuOpen(false)}>Upload</Link>
              <Link to="/leaderboard" className="block nav-link" onClick={() => setMenuOpen(false)}>Leaderboard</Link>
              <Link to="/profile" className="block nav-link" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button onClick={handleLogout} className="block text-red-600 nav-link">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="block nav-link bg-green-600 text-white px-4 py-2 rounded-md" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
