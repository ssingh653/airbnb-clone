import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "./Loading";

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

const Accomodations = () => {
  const [places, setPlace] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get("/places");
        if (Array.isArray(data)) {
          setPlace(data);
        }
      } catch (error) {
        console.error("Error fetching places:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="my-2">
      {places && places.length > 0 ? (
        places.map((place) => (
          <Link
            key={place._id}
            to={"/account/places/" + place._id}
            className="my-3 p-4 cursor-pointer bg-white dark:bg-gray-800 rounded-2xl flex gap-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
          >
            <div className="bg-gray-200 dark:bg-gray-700 rounded-xl w-48 h-32 overflow-hidden flex items-center justify-center shrink-0">
              {place.photos && place.photos.length > 0 && (
                <img className="object-cover w-full h-full" src={getPhotoUrl(place.photos[0])} alt="property" />
              )}
            </div>
            <div className="grow-0 shrink min-w-0">
              <h2 className="text-xl font-bold tracking-tight text-gray-800 dark:text-gray-200 truncate">{place.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-3 leading-relaxed">{place.description}</p>
            </div>
          </Link>
        ))
      ) : (
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
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No accommodations found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto leading-relaxed">
            You haven't listed any accommodations yet. Share your space with travelers and start earning!
          </p>
          <Link
            to="/account/places/new"
            className="inline-flex py-3 px-6 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-2xl shadow-md hover:from-rose-600 hover:to-pink-700 transition"
          >
            Add your first accommodation
          </Link>
        </div>
      )}
    </div>
  );
};

export default Accomodations;
