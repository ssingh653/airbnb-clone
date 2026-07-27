import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../UserContext";
import axios from "axios";

const Header = () => {
  const [clicked, setClick] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    setSearchQuery(params.get("search") || "");
  }, [search]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setClick(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const LoginMenu = () => {
    setClick(!clicked);
  };

  const handleSearch = () => {
    navigate(searchQuery ? `/?search=${encodeURIComponent(searchQuery)}` : "/");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const Logout = async () => {
    try {
      await axios.delete("/logout", { withCredentials: true });
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="px-6 md:px-16 py-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-200 dark:border-gray-800 dark:text-gray-100 relative">
      <Link to="/" className="flex items-center gap-1 text-rose-500 dark:text-rose-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="w-8 h-8 -rotate-90"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
          />
        </svg>
        <span className="font-bold text-2xl tracking-tight hidden sm:inline">airbnb</span>
      </Link>

      {/* Search Input Box */}
      <div className="flex gap-x-2 border border-gray-300 dark:border-gray-700 rounded-full px-2 py-1 shadow-sm items-center w-full md:w-auto bg-gray-50 dark:bg-gray-800 focus-within:ring-2 focus-within:ring-rose-500 transition-all">
        <input
          type="text"
          placeholder="Search places..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-4 border-none focus:outline-none bg-transparent text-sm w-full md:w-64 py-1.5 text-gray-800 dark:text-gray-100"
        />
        <button onClick={handleSearch} className="bg-rose-500 hover:bg-rose-600 text-white p-2.5 rounded-full transition-all">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
      </div>

      <div className="px-2 gap-4 flex items-center w-full md:w-auto justify-end">
        <Link className="font-semibold hidden lg:inline hover:text-rose-500 dark:hover:text-rose-400 transition">Airbnb your home</Link>
        
        {/* Theme Toggle Button */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-all duration-200"
        >
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M5.25 12H3m18 0h-2.25m-1.9-6.9a9 9 0 01-12.8 12.8m12.8-12.8L19.5 5.25M6.3 17.7L5.25 18.75m12.8-12.8L18.75 5.25M6.3 6.3L5.25 5.25m12.8 12.8l1.05 1.05" />
            </svg>
          )}
        </button>

        <div className="relative" ref={menuRef}>
          <Link
            className="gap-3 flex px-2 py-1.5 border border-gray-300 dark:border-gray-700 rounded-full items-center hover:shadow-md transition bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            onClick={LoginMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-5 h-5 pl-0.5 text-gray-500 dark:text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>

            {user ? (
              <div className="w-7 h-7 bg-indigo-500 border border-indigo-600 rounded-full text-center align-middle flex items-center justify-center">
                <div className="text-white text-xs font-bold">
                  {user.name.split("")[0].toUpperCase()}
                </div>
                {user && (
                  <div className="p-1 border border-white absolute -top-0.5 right-1 bg-green-500 rounded-full"></div>
                )}
              </div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-7 h-7 text-gray-500 dark:text-gray-400"
              >
                <path
                  fillRule="evenodd"
                  d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </Link>

          {clicked &&
            (user ? (
              <div
                className="py-2 absolute top-12 right-0 shadow-[0_4px_25px_rgba(0,0,0,0.15)] w-64 bg-white dark:bg-gray-800 dark:border dark:border-gray-700 dark:text-gray-100 flex flex-col rounded-2xl z-50 transition-colors"
                onClick={() => setClick(false)}
              >
                <div className="p-3 font-semibold text-sm border-b border-gray-100 dark:border-gray-700">
                  Welcome, {user.name.split(" ")[0]}
                </div>
                <Link to="/account" className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">
                  Account Settings
                </Link>
                <Link className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">
                  Airbnb your home
                </Link>
                <div className="border-b border-gray-100 dark:border-gray-700"></div>
                <Link
                  to="/login"
                  className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold text-rose-500 text-sm"
                  onClick={Logout}
                >
                  Log Out
                </Link>
              </div>
            ) : (
              <div
                className="py-2 absolute top-12 right-0 shadow-[0_4px_25px_rgba(0,0,0,0.15)] w-64 bg-white dark:bg-gray-800 dark:border dark:border-gray-700 dark:text-gray-100 flex flex-col rounded-2xl z-50 transition-colors"
                onClick={() => setClick(false)}
              >
                <Link to="/register" className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold text-sm">
                  Sign up
                </Link>
                <Link to="/login" className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">
                  Login
                </Link>
                <div className="border-b border-gray-100 dark:border-gray-700"></div>
                <Link className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">Airbnb your home</Link>
                <Link className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">Help</Link>
              </div>
            ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
