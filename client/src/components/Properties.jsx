import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const Properties = () => {
  const [places, setPlace] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get("/allplaces");
      console.log("data", data);
      setPlace(data);
    }
    fetchData();
  }, []);
  return (
    <div className="grid grid-cols-4 gap-4 m-4 p-4 ">
      {places &&
        places.map((place) => (
          <Link
            to={"/placeinfo/" + place._id}
            className="m-2 p-2 cursor-pointer bg-gray-200 rounded-md "
          >
            <div className="bg-gray-300 rounded-md h-60 w-full ">
              {place.photos.length > 0 && (
                // <img
                // className="object-cover w-full h-full rounded-xl"
                //   src={
                //     process.env.NODE_ENV === "production"
                //       ? "https://airbnb-clone-app-r59g.onrender.com/uploads/" +
                //         place.photos[0]
                //       : "http://localhost:4000/uploads/" + place.photos[0]
                //   }
                //   alt="property"
                // />
                <img
                  className="object-cover w-full h-full rounded-xl"
                  src={place.photos[0]}
                  alt="property"
                />
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

export default Properties;
