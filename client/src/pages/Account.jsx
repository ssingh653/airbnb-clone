import React, { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import Bookings from "./Bookings";
import Places from "./Places";

const Account = () => {
  const { ready, user, setUser } = useContext(UserContext);
  const [redirect, setRedirect] = useState(null);
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }

  if (!ready) {
    return "Loading...";
  }
  if (ready && !user && !redirect) {
    return <Navigate to="/login" />;
  }

  const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
    setRedirect("/");
    await axios.delete("/logout");
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  function LinkClasses(type = null) {
    let classes = "px-6 md:px-8 py-2.5 rounded-full inline-flex items-center gap-2 font-bold text-sm tracking-tight transition-all duration-200 border border-transparent";
    if (type === subpage) {
      classes += " bg-white dark:bg-gray-700 text-rose-500 dark:text-rose-400 shadow-md border-gray-100 dark:border-gray-700";
    } else {
      classes += " text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 bg-transparent";
    }
    return classes;
  }

  return (
    <div>
      <nav className="w-full flex justify-center p-4 mb-4">
        <div className="flex bg-gray-100 dark:bg-gray-900 p-1.5 rounded-full border border-gray-200 dark:border-gray-800 shadow-inner gap-1">
          <Link className={LinkClasses("profile")} to="/account/profile">
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
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
            My Profile
          </Link>
          <Link className={LinkClasses("bookings")} to="/account/bookings">
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
                d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            My Bookings
          </Link>
          <Link className={LinkClasses("places")} to="/account/places">
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
                d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"
              />
            </svg>
            My Accommodations
          </Link>
        </div>
      </nav>
      {subpage === "profile" && (
        <div className="max-w-md mx-auto mt-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
            {/* Header banner */}
            <div className="h-24 bg-gradient-to-r from-rose-500 to-pink-600"></div>
            
            {/* Body */}
            <div className="p-8 text-center -mt-12 relative">
              {/* Initials Avatar */}
              <div className="w-24 h-24 bg-indigo-600 border-4 border-white dark:border-gray-800 rounded-full mx-auto shadow-md flex items-center justify-center text-white text-3xl font-extrabold mb-4">
                {user.name.split("")[0].toUpperCase()}
              </div>
              
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">{user.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{user.email}</p>
              
              {/* Account Stats Grid */}
              <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-100 dark:border-gray-700 py-4 mb-6 text-left">
                <div className="text-center border-r border-gray-100 dark:border-gray-700">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Tier</span>
                  <span className="text-sm font-bold text-rose-500">Premium Owner</span>
                </div>
                <div className="text-center">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Status</span>
                  <span className="text-sm font-bold text-green-500">Verified</span>
                </div>
              </div>

              <button
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition duration-200"
                onClick={logout}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {subpage === "bookings" && (
        <div className="max-w-4xl mx-auto py-4">
          <Bookings />
        </div>
      )}

      {subpage === "places" && (
        <div className="">
          <Places />
        </div>
      )}
    </div>
  );
};

export default Account;
