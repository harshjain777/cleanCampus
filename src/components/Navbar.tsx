import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, User, Upload, Trophy, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gray-900">Clean Campus</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/upload" className="nav-link">
                  <Upload className="h-5 w-5" />
                  <span>Upload</span>
                </Link>
                <Link to="/leaderboard" className="nav-link">
                  <Trophy className="h-5 w-5" />
                  <span>Leaderboard</span>
                </Link>
                <Link to="/profile" className="nav-link">
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <button onClick={handleLogout} className="nav-link text-red-600">
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link bg-green-600 text-white px-4 py-2 rounded-md">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;