import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  CodeBracketIcon, 
  UserIcon, 
  CogIcon, 
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

const Header = () => {
  const { user, admin, logoutUser, logoutAdmin, logoutAll, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (user) {
      logoutUser();
      navigate('/');
    } else if (admin) {
      logoutAdmin();
      navigate('/admin/login');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <CodeBracketIcon className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">CodeRepository</span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
            
            {isAuthenticated() && (
              <>
                {user && (
                  <>
                    <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
                    <Link to="/code" className="text-gray-600 hover:text-blue-600">My Code</Link>
                  </>
                )}
                {admin && (
                  <>
                    <Link to="/admin/dashboard" className="text-gray-600 hover:text-blue-600">Admin Dashboard</Link>
                    <Link to="/admin/users" className="text-gray-600 hover:text-blue-600">Users</Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {isAuthenticated() ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    {user?.username || admin?.username}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {user ? 'User' : admin?.role}
                  </span>
                </div>
                
                {user && (
                  <Link to="/profile" className="text-gray-600 hover:text-blue-600">
                    <CogIcon className="w-5 h-5" />
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-gray-600 hover:text-red-600"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600">Sign In</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Sign Up
                </Link>
                <Link to="/admin/login" className="text-gray-600 hover:text-blue-600 text-sm">
                  Admin Login
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;