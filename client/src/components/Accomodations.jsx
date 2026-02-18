import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Accomodations = () => {
  const [places, setPlace] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get("/places");
      console.log("data", data);
      setPlace(data);
    }
    fetchData();
  }, []);

  return (
    <div className="my-2">
      {places.length > 0 &&
        places.map((place) => (
          <Link
            to={"/account/places/" + place._id}
            className="my-2 p-2 cursor-pointer bg-gray-200 rounded-md flex "
          >
            <div className="bg-gray-300 rounded-md mx-2 w-48">
              {place.photos.length > 0 && (
                // <img
                //   src={
                //     process.env.NODE_ENV === "production"
                //       ? "https://airbnb-clone-app-r59g.onrender.com"
                //       : "http://localhost:4000/uploads/" + place.photos[0]
                //   }
                //   alt="property"
                // />
                <img src={place.photos[0]} alt="property" />
              )}
            </div>
            <div className="grow-0 shrink">
              <h1>{place.title}</h1>

              <p>{place.description}</p>
            </div>
          </Link>
        ))}
    </div>
  );
};

export default Accomodations;
