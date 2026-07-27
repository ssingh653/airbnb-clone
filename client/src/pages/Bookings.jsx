import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loading.jsx";

const getPhotoUrl = (photo) => {
  if (!photo) return "";
  if (photo.startsWith("http://") || photo.startsWith("https://")) {
    return photo;
  }
  const cleanPhoto = photo.replace(/\\/g, "/").replace(/^uploads\//, "");
  const isProd = process.env.NODE_ENV === "production";
  const baseUrl = isProd ? "https://airbnb-clone-app-r59g.onrender.com" : "http://localhost:4000";
  return `${baseUrl}/uploads/${cleanPhoto}`;
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/bookings")
      .then((response) => {
        setBookings(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    if (outDate > inDate) {
      const diffTime = Math.abs(outDate - inDate);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full">
      {bookings.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-md max-w-lg mx-auto mt-6">
          <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No bookings found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto leading-relaxed">
            You haven't booked any accommodations yet. Explore our beautiful properties and plan your next stay!
          </p>
          <Link
            to="/"
            className="inline-flex py-3 px-6 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-2xl shadow-md hover:from-rose-600 hover:to-pink-700 transition"
          >
            Explore Properties
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white pl-2 mb-2 text-left">Your Bookings</h2>
          {bookings.map((booking) => {
            const nights = calculateNights(booking.checkIn, booking.checkOut);
            return (
              <div
                key={booking._id}
                className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-md hover:shadow-lg transition flex flex-col sm:flex-row gap-4"
              >
                {/* Left side Thumbnail */}
                <div className="w-full sm:w-48 h-40 bg-gray-150 dark:bg-gray-700 shrink-0 overflow-hidden">
                  {booking.place?.photos?.[0] ? (
                    <img
                      className="w-full h-full object-cover"
                      src={getPhotoUrl(booking.place.photos[0])}
                      alt={booking.place.title}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                      No Photo
                    </div>
                  )}
                </div>

                {/* Right side Metadata */}
                <div className="p-4 flex flex-col justify-between grow min-w-0 text-left">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                      {booking.place?.title || "Property Details"}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                      {booking.place?.address}
                    </p>

                    {/* Stay details */}
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-1.5 py-1 px-2.5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 text-rose-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008z"
                          />
                        </svg>
                        <span>
                          {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 py-1 px-2.5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 text-rose-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                          />
                        </svg>
                        <span>
                          {nights} {nights === 1 ? "night" : "nights"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Details link */}
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Paid:</span>
                      <span className="text-lg font-extrabold text-gray-900 dark:text-white">
                        ₹{booking.price || 0}
                      </span>
                    </div>
                    
                    {booking.place?._id && (
                      <Link
                        to={`/placeinfo/${booking.place._id}`}
                        className="text-xs font-bold text-rose-500 dark:text-rose-400 hover:text-rose-600 flex items-center gap-1 hover:underline"
                      >
                        View Property
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-3.5 h-3.5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Bookings;