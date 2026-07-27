import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";

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

const PlaceInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const { user } = useContext(UserContext);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    if (outDate > inDate) {
      const diffTime = Math.abs(outDate - inDate);
      numberOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  }
  const basePricePerNight = 150;
  const totalPrice = numberOfNights * basePricePerNight;

  const handleBooking = async () => {
    if (!user) {
      alert("Please login first to book accommodations.");
      navigate("/login");
      return;
    }
    if (!checkIn || !checkOut || !name || !phone) {
      alert("Please fill in all booking details.");
      return;
    }
    try {
      await axios.post("/bookings", {
        place: place._id,
        checkIn,
        checkOut,
        numberOfGuests,
        name,
        phone,
        price: totalPrice,
      });
      alert("Booking successful!");
      setRedirect("/account/bookings");
    } catch (error) {
      console.error(error);
      alert("Booking failed. Please try again.");
    }
  };

  useEffect(() => {
    if (!id) return;
    axios.get(`/places/${id}`).then((response) => {
      setPlace(response.data);
    });
  }, [id]);

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  if (!place) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-semibold text-gray-600">
        Loading details...
      </div>
    );
  }

  // Icons for Perks mapping
  const getPerkIcon = (perk) => {
    switch (perk.toLowerCase()) {
      case "wifi":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.284 16.284A3 3 0 0012 17a3 3 0 003.716-.716m-7.432-7.432A9 9 0 0012 21a9 9 0 007.432-12.148M6.162 6.162A14.862 14.862 0 0112 3c3.197 0 6.164 1.005 8.59 2.716M4.038 4.038A20.863 20.863 0 0112 1.5c4.78 0 9.176 1.636 12.69 4.382" />
          </svg>
        );
      case "parking":
      case "free parking":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.19-3.007a2.25 2.25 0 00-2.24-2.119H16.13l-.127-2.552A2.25 2.25 0 0013.76 5.25H9.75a2.25 2.25 0 00-2.24 2.05L7.382 9.75H4.12l-.123 2.457A2.25 2.25 0 006.236 14.25h9.894" />
          </svg>
        );
      case "tv":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h14.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        );
      case "pets":
      case "pets allowed":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm5.25 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  if (showAllPhotos) {
    return (
      <div className="absolute inset-0 bg-black text-white min-h-screen z-50 p-8 flex flex-col items-center">
        <div className="max-w-3xl w-full flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Photos of {place.title}</h2>
          <button
            onClick={() => setShowAllPhotos(false)}
            className="fixed right-12 top-8 flex gap-1 py-2 px-4 rounded-2xl shadow shadow-black bg-white text-black hover:bg-gray-200 transition font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Close
          </button>
        </div>
        <div className="grid gap-4 max-w-3xl w-full">
          {place.photos?.map((photo, index) => (
            <div key={index} className="overflow-hidden rounded-xl bg-gray-900 flex justify-center">
              <img className="max-h-[85vh] object-contain w-full" src={getPhotoUrl(photo)} alt="" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-6 md:px-8 py-6 max-w-6xl mx-auto rounded-3xl transition-colors duration-300">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex gap-1 items-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 transition text-gray-800 px-4 py-2 rounded-full font-semibold shadow-sm mb-6 border border-gray-300 dark:border-gray-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back
      </button>

      {/* Title */}
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-200">{place.title}</h1>
      
      {/* Address / Location link */}
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`https://maps.google.com/?q=${encodeURIComponent(place.address)}`}
        className="my-3 flex gap-1 items-center font-semibold underline text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
        </svg>
        {place.address}
      </a>

      {/* Photo Gallery (Airbnb Grid Style) */}
      <div className="relative mt-4">
        <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden shadow-lg">
          <div className="h-[400px] overflow-hidden">
            {place.photos?.[0] && (
              <img
                onClick={() => setShowAllPhotos(true)}
                className="cursor-pointer object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                src={getPhotoUrl(place.photos[0])}
                alt=""
              />
            )}
          </div>
          <div className="grid gap-2 h-[400px]">
            <div className="overflow-hidden h-[196px]">
              {place.photos?.[1] && (
                <img
                  onClick={() => setShowAllPhotos(true)}
                  className="cursor-pointer object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                  src={getPhotoUrl(place.photos[1])}
                  alt=""
                />
              )}
            </div>
            <div className="overflow-hidden h-[196px] relative">
              {place.photos?.[2] && (
                <img
                  onClick={() => setShowAllPhotos(true)}
                  className="cursor-pointer object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                  src={getPhotoUrl(place.photos[2])}
                  alt=""
                />
              )}
            </div>
          </div>
        </div>
        {place.photos && place.photos.length > 3 && (
          <button
            onClick={() => setShowAllPhotos(true)}
            className="absolute bottom-4 right-4 flex gap-1 py-2 px-4 bg-white rounded-2xl shadow-md border border-gray-300 hover:bg-gray-150 transition font-semibold text-gray-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            Show all photos
          </button>
        )}
      </div>

      {/* Main Details and Booking Card grid layout */}
      <div className="mt-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        
        {/* Left Side: Description, Times, Perks */}
        <div className="flex flex-col gap-6">
          
          {/* Description */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-200">About this place</h2>
            <p className="text-gray-650 dark:text-gray-300 leading-relaxed whitespace-pre-line">{place.description}</p>
          </div>

          {/* Timings */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Check-in & Check-out</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/45 rounded-2xl border border-indigo-100 dark:border-indigo-900">
                <span className="block text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">Check-in after</span>
                <span className="text-lg font-bold text-gray-800 dark:text-gray-200">{place.checkIn}</span>
              </div>
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/45 rounded-2xl border border-indigo-100 dark:border-indigo-900">
                <span className="block text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">Check-out before</span>
                <span className="text-lg font-bold text-gray-800 dark:text-gray-200">{place.checkOut}</span>
              </div>
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/45 rounded-2xl border border-indigo-100 dark:border-indigo-900">
                <span className="block text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">Max Guests</span>
                <span className="text-lg font-bold text-gray-800 dark:text-gray-200">{place.maxGuests}</span>
              </div>
            </div>
          </div>

          {/* Perks */}
          {place.perks && place.perks.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">What this place offers</h2>
              <div className="grid grid-cols-2 gap-4">
                {place.perks.map((perk, index) => (
                  <div key={index} className="flex gap-2 items-center text-gray-700 dark:text-gray-305 font-medium">
                    <span className="text-indigo-500 dark:text-indigo-400 p-1 bg-indigo-50 dark:bg-indigo-950 rounded-lg">{getPerkIcon(perk)}</span>
                    <span className="capitalize">{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extra Info */}
          {place.extraInfo && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-200">Important Information</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed whitespace-pre-line">{place.extraInfo}</p>
            </div>
          )}

        </div>

        {/* Right Side: Sticky Booking Widget */}
        <div className="h-fit sticky top-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-gray-200">
              ₹150 <span className="text-base font-normal text-gray-500 dark:text-gray-400">/ night</span>
            </div>
            
            {/* Form */}
            <div className="border border-gray-300 dark:border-gray-700 rounded-2xl overflow-hidden mb-4 bg-gray-50 dark:bg-gray-900">
              <div className="grid grid-cols-2 border-b border-gray-300 dark:border-gray-700">
                <div className="p-3">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Check-in</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(ev) => setCheckIn(ev.target.value)}
                    className="w-full text-sm font-semibold text-gray-800 dark:text-gray-200 bg-transparent border-none p-0 focus:ring-0"
                  />
                </div>
                <div className="p-3 border-l border-gray-300 dark:border-gray-700">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Check-out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(ev) => setCheckOut(ev.target.value)}
                    className="w-full text-sm font-semibold text-gray-800 dark:text-gray-200 bg-transparent border-none p-0 focus:ring-0"
                  />
                </div>
              </div>
              <div className="p-3">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Number of guests</label>
                <select
                  value={numberOfGuests}
                  onChange={(ev) => setNumberOfGuests(Number(ev.target.value))}
                  className="w-full text-sm font-semibold text-gray-800 dark:text-gray-200 bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
                >
                  {[...Array(place.maxGuests || 1).keys()].map((n) => (
                    <option key={n} value={n + 1} className="dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                      {n + 1} {n === 0 ? "guest" : "guests"}
                    </option>
                  ))}
                </select>
              </div>
              {numberOfNights > 0 && (
                <>
                  <div className="p-3 border-t border-gray-300 dark:border-gray-700">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(ev) => setName(ev.target.value)}
                      className="w-full text-sm font-semibold text-gray-800 dark:text-gray-250 bg-transparent border-none p-0 focus:ring-0"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="p-3 border-t border-gray-300 dark:border-gray-700">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(ev) => setPhone(ev.target.value)}
                      className="w-full text-sm font-semibold text-gray-800 dark:text-gray-255 bg-transparent border-none p-0 focus:ring-0"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </>
              )}
            </div>

            {numberOfNights > 0 && (
              <div className="my-4 pt-3 border-t border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-755 dark:text-gray-300 space-y-2">
                <div className="flex justify-between">
                  <span>₹150 x {numberOfNights} nights</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 dark:border-gray-700 pt-2 text-base font-bold text-gray-900 dark:text-white">
                  <span>Total price</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>
            )}

            {/* CTA Button */}
            <button
              onClick={handleBooking}
              className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold rounded-2xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200"
            >
              Book this place {numberOfNights > 0 && `(₹${totalPrice})`}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlaceInfo;
