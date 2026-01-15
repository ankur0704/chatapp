import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const Profile: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setProfilePicture(user.profilePicture);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await updateProfile({
        username,
        profilePicture
      });
      setSuccess('Profile updated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Layout showSidebar={false}>
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-1 mr-2 text-gray-500 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt={username}
                  className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl border-4 border-white shadow-md">
                  {username.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute bottom-0 right-0 bg-gray-100 rounded-full p-2 shadow-sm">
                <Camera size={16} className="text-gray-600" />
              </div>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">{user?.username}</h2>
            <p className="text-gray-500">{user?.email}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 mb-1">
                Profile Picture URL
              </label>
              <input
                id="profilePicture"
                type="text"
                value={profilePicture}
                onChange={(e) => setProfilePicture(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter a URL to an image (e.g., from Pexels, Unsplash, etc.)
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;