import React, { useContext, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import AuthContext from '../context/auth-context';
import { HiMenu, HiX } from 'react-icons/hi'; 

export default function MainNavigation() {
  const value = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isLoginPage = location.pathname === '/login';
  const isPostsPage = location.pathname === '/';

  const handleLinkClick = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-blue-50 mb-4 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Brand */}
        <NavLink to="/" className="text-2xl font-bold text-blue-600">
          photo share
        </NavLink>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          <ul className="flex space-x-4 items-center">
            {value.token && (
              <li>
                <NavLink
                  to="/userPage"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-500 font-semibold"
                      : "text-gray-700 hover:text-blue-500"
                  }
                >
                  My Posts
                </NavLink>
              </li>
            )}
            {!value.token && (
            <>
                {isLoginPage && (
                  <li>
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        isActive
                          ? 'text-blue-500 font-semibold'
                          : 'text-gray-700 hover:text-blue-500'
                      }
                    >
                      Posts
                    </NavLink>
                  </li>
                )}
                {isPostsPage && (
                  <li>
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        isActive
                          ? 'text-blue-500 font-semibold'
                          : 'text-gray-700 hover:text-blue-500'
                      }
                    >
                      Login
                    </NavLink>
                  </li>
                )}
              </>
            )}
          </ul>

          {value.token && (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  value.logout();
                  handleLinkClick();
                }}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
              {/* <span className="text-gray-700 font-medium">{value.username}</span> */}
            </div>
          )}
        </div>

        {/* Mobile Hamburger Icon */}
        <button
          className="md:hidden text-2xl text-gray-700"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pb-4">
          <ul className="flex flex-col space-y-3">
            {value.token && (
              <>
              <li>
                <NavLink
                  to="/userPage"
                  onClick={handleLinkClick}
                  className="block text-gray-700 hover:text-blue-500"
                >
                My Posts
                </NavLink>
              </li>
                    <li>
                <NavLink
                  to="/newPost"
                  onClick={handleLinkClick}
                  className="block text-gray-700 hover:text-blue-500"
                >
                new post
                </NavLink>
              </li>
              </>

            )}
            {!value.token && (
         <>
                {isLoginPage && (
                  <li>
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        isActive
                          ? 'text-blue-500 font-semibold'
                          : 'text-gray-700 hover:text-blue-500'
                      }
                    >
                      Posts
                    </NavLink>
                  </li>
                )}
                {isPostsPage && (
                  <li>
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        isActive
                          ? 'text-blue-500 font-semibold border'
                          : 'text-gray-700 hover:text-blue-500'
                      }
                    >
                      Login
                    </NavLink>
                  </li>
                )}
              </>
            )}

            {value.token && (
              <>
                <li>
                  <button
                    onClick={() => {
                      value.logout();
                      handleLinkClick();
                    }}
                    className="w-auto text-left bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </li>
                {/* <li className="text-gray-700 font-medium">{value.username}</li> */}
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
