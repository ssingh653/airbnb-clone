import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
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

const Properties = () => {
  const [places, setPlace] = useState([]);
  const { search } = useLocation();

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get("/allplaces" + search);
        setPlace(data);
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    }
    fetchData();
  }, [search]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-4 p-4">
      {places && places.length > 0 ? (
        places.map((place) => (
          <Link
            key={place._id}
            to={"/placeinfo/" + place._id}
            className="cursor-pointer bg-white dark:bg-gray-800 rounded-3xl p-3 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between"
          >
            <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-48 w-full overflow-hidden">
              {place.photos && place.photos.length > 0 && (
                <img
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                  src={getPhotoUrl(place.photos[0])}
                  alt="property"
                />
              )}
            </div>
            <div className="mt-3">
              <h2 className="font-bold text-sm tracking-tight truncate text-gray-800 dark:text-gray-200">{place.title}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">{place.description}</p>
            </div>
          </Link>
        ))
      ) : (
        <div className="col-span-full text-center py-12 text-gray-500 font-semibold text-lg">
          No accommodations found matching your search.
        </div>
      )}
    </div>
  );
};

export default Properties;
