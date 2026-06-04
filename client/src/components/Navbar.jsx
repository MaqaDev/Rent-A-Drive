import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { FiLogOut, FiUser, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <nav className='bg-primary text-white shadow-lg'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          <Link
            to='/'
            className='text-2xl font-bold text-secondary'>
            Rent-A-Drive 🚗
          </Link>

          {/* Desktop Menu */}
          <div className='hidden md:flex items-center gap-8'>
            <Link
              to='/cars'
              className='hover:text-secondary transition'>
              Browse Cars
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to='/dashboard'
                  className='hover:text-secondary transition'>
                  My Bookings
                </Link>
                {user?.role === "admin" && (
                  <Link
                    to='/admin'
                    className='hover:text-secondary transition'>
                    Admin Panel
                  </Link>
                )}
                <div className='flex items-center gap-3'>
                  <FiUser className='text-lg' />
                  <span className='text-sm'>{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className='flex items-center gap-2 bg-secondary text-primary px-4 py-2 rounded-lg hover:bg-accent transition'>
                  <FiLogOut />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to='/login'
                  className='hover:text-secondary transition'>
                  Login
                </Link>
                <Link
                  to='/register'
                  className='bg-secondary text-primary px-4 py-2 rounded-lg hover:bg-accent transition'>
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className='md:hidden'
            onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className='md:hidden pb-4 border-t border-gray-700'>
            <Link
              to='/cars'
              className='block py-2 hover:text-secondary transition'>
              Browse Cars
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to='/dashboard'
                  className='block py-2 hover:text-secondary transition'>
                  My Bookings
                </Link>
                {user?.role === "admin" && (
                  <Link
                    to='/admin'
                    className='block py-2 hover:text-secondary transition'>
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className='block w-full text-left py-2 text-secondary hover:text-accent transition'>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to='/login'
                  className='block py-2 hover:text-secondary transition'>
                  Login
                </Link>
                <Link
                  to='/register'
                  className='block py-2 text-secondary transition'>
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
