import React from "react";
import { User, Code, LogOut, Trophy, List, LayoutList } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import leetlabLogo from "../image/leetlab.png";

const Navbar = () => {
  const { authUser } = useAuthStore();

  return (
    <nav className="sticky top-0 z-50 w-full py-4">
      <div
        className="flex w-full justify-between items-center mx-auto max-w-6xl 
      bg-black/20 backdrop-blur-lg border border-gray-200/10 
      p-4 rounded-2xl shadow-lg"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={leetlabLogo}
            alt="LeetLab Logo"
            className="h-8 md:h-10 w-auto object-contain rounded-full"
          />
          <span className="text-xl font-bold text-white hidden md:block">
            LeetLab
          </span>
        </Link>

        {/* Center Links */}
        {authUser && (
          <div className="hidden md:flex items-center gap-8 text-white font-medium">
            <Link
              to="/problems"
              className="flex items-center gap-1 hover:text-primary transition"
            >
              <LayoutList size={18} />
              Problems
            </Link>

            <Link
              to="/playlists"
              className="flex items-center gap-1 hover:text-primary transition"
            >
              <List size={18} />
              Playlists
            </Link>

            <Link
              to="/leaderboard"
              className="flex items-center gap-1 hover:text-primary transition"
            >
              <Trophy size={18} />
              Leaderboard
            </Link>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {!authUser ? (
            <>
              <Link to="/login" className="btn btn-sm btn-outline text-white">
                Login
              </Link>
              <Link to="/signup" className="btn btn-sm btn-primary">
                Sign Up
              </Link>
            </>
          ) : (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-base font-bold leading-none">
                  {authUser?.name?.charAt(0).toUpperCase()}
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] 
                p-3 shadow bg-base-100 rounded-box w-52 space-y-2"
              >
                <li>
                  <p className="font-semibold">{authUser?.name}</p>
                  <hr />
                </li>

                <li>
                  <Link
                    to="/profile"
                    className="hover:bg-primary hover:text-white"
                  >
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </Link>
                </li>

                {authUser?.role === "ADMIN" && (
                  <li>
                    <Link
                      to="/add-problem"
                      className="hover:bg-primary hover:text-white"
                    >
                      <Code className="w-4 h-4 mr-2" />
                      Add Problem
                    </Link>
                  </li>
                )}

                <li>
                  <LogoutButton className="hover:bg-primary hover:text-white">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </LogoutButton>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
