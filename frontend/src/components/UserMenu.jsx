import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useOutsideClick } from "../hooks/useOutsideClick";

export default function UserMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();

  useOutsideClick(menuRef, () => setIsOpen(false));

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
      >
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className="hidden md:block text-left">
          <div className="font-semibold">{user.username}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <Link
            // to="/profile"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Profile
            <span className="ml-2 bg-gray-100 text-xs font-semibold px-2 py-0.5 rounded-full">
              WIP
            </span>
          </Link>
          <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
