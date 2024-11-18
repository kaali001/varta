import React from 'react';
import { Link } from "react-router-dom";
import { UserCount } from './UserCount';

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 h-16 border-b border-gray-300 flex items-center justify-between px-6 bg-white overflow-hidden">
      <Link to="/" className="flex items-center">
        <img src="./android-icon-192x192.png" alt="Varta Logo" className="h-12 w-12" />
        <span
          className="ml-2 text-3xl font-bold"
          style={{
            fontFamily: "Cinzel, Quattrocento, Ultine Extended Demi",
            color: "#FA546B",
            textShadow: "2px 4px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          Varta
        </span>
      </Link>

      <div>
        <UserCount />
      </div>
    </nav>
  );
};
