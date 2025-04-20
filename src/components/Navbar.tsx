import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, User, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed w-full z-10 top-0 md:relative">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex items-center">
          <button
            type="button"
            className="md:hidden p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={24} />
          </button>
          <Link to="/" className="flex items-center ml-2 md:ml-0">
            <span className="self-center text-xl font-semibold whitespace-nowrap text-blue-600">ChatApp</span>
          </Link>
        </div>

        {user && (
          <div className="flex items-center">
            <div className="hidden md:flex md:items-center">
              <span className="text-sm font-medium text-gray-900 mr-4">
                {user.username}
              </span>
            </div>
            <div className="relative ml-3">
              <div>
                <button
                  type="button"
                  className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="user-menu"
                  aria-expanded="false"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {user.profilePicture ? (
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={user.profilePicture}
                      alt="User"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>
              </div>
              {isMenuOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={16} className="mr-2" />
                      Profile
                    </Link>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;