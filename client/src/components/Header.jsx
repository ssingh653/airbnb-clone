import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import axios from "axios";

const Header = () => {
  const [clicked, setClick] = useState(false);
  const { user, setUser } = useContext(UserContext);

  const LoginMenu = () => {
    setClick(!clicked);
  };
  const Logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
    await axios.delete("/logout");
    window.location = "/login";
  };

  return (
    <header className="px-16 pb-4 flex justify-between">
      <Link to="/" className="flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 -rotate-90"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
          />
        </svg>
        <span className="font-bold text-xl text-black">airbnb</span>
      </Link>
      <div className="flex gap-x-2 border border-gray-300 rounded-full px-2 py-2 shadow-sm shadow-gray-300">
        <div className=" pl-4 font-bold self-center">Anywhere</div>
        <div className="border-l-2 border-black-500"></div>
        <div className="font-bold self-center">Any week</div>
        <div className="border-l-2 border-black-500"></div>
        <div className="self-center">Add guests</div>
        <button className="bg-blue-600 text-white p-2 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
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
      <div className="px-2 gap-4 flex items-center">
        <Link className="font-bold ">Airbnb your home</Link>
        <div>
          <div className="p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
              />
            </svg>
          </div>
        </div>

        <Link
          className="gap-3 flex px-1 py-1 border border-gray-300 rounded-full items-center hover:shadow-md transition-shadow"
          onClick={LoginMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7 pl-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>

          {user ? (
            <div className="w-8 h-8 bg-black border rounded-full text-center align-middle">
              <div className="text-white mt-0.5">
                {user.name.split("")[0].toUpperCase()}
              </div>
            </div>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8"
            >
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </Link>
        {user && (
          <div className="p-1 border absolute top-4 right-24 bg-green-500 rounded-full"></div>
        )}
        {clicked &&
          (user ? (
            <div
              className="py-2 absolute top-20 right-20 shadow-[0_0_15px_rgba(0,0,0,0.10)] w-64 bg-white flex flex-col rounded-xl"
              onClick={(prev) => setClick(!prev)}
            >
              <div className="p-3 font-regular">
                Welcome, {user.name.split(" ")[0]}
              </div>
              <Link
                to="/logout"
                className="p-3 hover:bg-gray-100 font-bold"
                onClick={Logout}
              >
                Log Out
              </Link>
              <Link to="/account" className="p-3 hover:bg-gray-100">
                Account
              </Link>
              <div className="border-b my-2"></div>
              <Link className="p-3 hover:bg-gray-100">Airbnb your home</Link>
              <Link className="p-3 hover:bg-gray-100">Help</Link>
            </div>
          ) : (
            <div
              className="py-2 absolute top-20 right-20 shadow-[0_0_15px_rgba(0,0,0,0.10)] w-64 bg-white flex flex-col rounded-xl"
              onClick={(prev) => setClick(!prev)}
            >
              <Link to="/register" className="p-3 hover:bg-gray-100 font-bold">
                Sign up
              </Link>
              <Link to="/login" className="p-3 hover:bg-gray-100">
                Login
              </Link>
              <div className="border-b my-2"></div>
              <Link className="p-3 hover:bg-gray-100">Airbnb your home</Link>
              <Link className="p-3 hover:bg-gray-100">Help</Link>
            </div>
          ))}
      </div>
    </header>
  );
};

export default Header;
