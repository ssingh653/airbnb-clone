import { React, lazy, Suspense, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Perks from "../components/Perks";
import axios from "axios";
import Loading from "../components/Loading";
// import Accomodations from "../components/Accomodations";
const Accomodations = lazy(() => import("../components/Accomodations"));

const Places = () => {
  const [value, setValue] = useState({
    title: "",
    address: "",
    photos: [],
    description: "",
    perks: [],
    extraInfo: "",
    checkIn: "",
    checkOut: "",
    maxGuests: 1,
  });

  console.log("value", value);
  const { action, id } = useParams();

  async function formSubmit(ev) {
    ev.preventDefault();
    const places = {
      title: value.title,
      address: value.address,
      photos: value.photos,
      description: value.description,
      perks: value.perks,
      extraInfo: value.extraInfo,
      checkIn: value.checkIn,
      checkOut: value.checkOut,
      maxGuests: parseInt(value.maxGuests),
    };
    if (id) {
      const PlacesDoc = await axios.put("/addplaces", { id, ...places });
      if (PlacesDoc) {
        alert("Added Successfully");
      }
    } else {
      const PlacesDoc = await axios.post("/addplaces", places);
      if (PlacesDoc) {
        alert("Added Successfully");
      }
    }
  }
  function deletePhoto(link) {
    // ev.preventDefault();
    setValue((prevState) => ({
      ...prevState,
      photos: [...prevState.photos.filter((item) => item !== link)],
    }));
  }

  function handleFile(ev) {
    // ev.preventDefault();
    const files = ev.target.files;

    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }
    axios
      .post("/upload", data, {
        headers: { "Content-Type": "multipart / form - data" },
      })
      .then((response) => {
        const { data: filenames } = response;
        for (let i = 0; i < filenames.length; i++) {
          setValue((prevState) => ({
            ...prevState,
            photos: [...prevState.photos, filenames[i]],
          }));
        }
        // setValue({ ...value, photos: [{ ...filenames }] });
      });
    // alert("Upload Successful");
  }

  return (
    <div>
      {action !== "new" && (
        <div>
          <div className="text-center">
            <Link
              className="inline-flex gap-2 justify-center border rounded-full cursor-pointer bg-indigo-200 p-2"
              to="/account/places/new"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add new place
            </Link>
          </div>
          <Suspense fallback={<Loading />}>
            <Accomodations />
          </Suspense>
        </div>
      )}
      {action === "new" && (
        <div className="m-4">
          <form className="" onSubmit={formSubmit}>
            <label htmlFor="" className="">
              Title
            </label>
            <br />
            <input
              type="text"
              value={value.title}
              placeholder="title"
              className=""
              onChange={(ev) => setValue({ ...value, title: ev.target.value })}
            />
            <br />
            <label htmlFor="" className="">
              Property Address
            </label>
            <br />
            <input
              type="text"
              className=""
              placeholder="address"
              value={value.address}
              onChange={(ev) =>
                setValue({ ...value, address: ev.target.value })
              }
            />
            <br />
            <label htmlFor="" className="">
              Photos
            </label>
            <br />
            <div className="inline-flex gap-2 p-2 rounded-full bg-gray-100">
              <div className="max-w-sm border rounded-full bg-gray-200 px-2 hover:shadow">
                <label className="cursor-pointer flex">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFile}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                    />
                  </svg>
                  Upload
                </label>
              </div>
            </div>

            <br />
            <div className="mt-2 gap-2 grid grid-cols-5 md:grid-cols-4 lg:grid-cols-6">
              {value.photos.length > 0 &&
                value.photos.map((link) => {
                  return (
                    <div className="h-28 flex relative" key={link}>
                      <img
                        className="rounded-2xl w-full object-cover"
                        src={
                          process.env.NODE_ENV === "production"
                            ? "https://airbnb-clone-app-r59g.onrender.com"
                            : "http://localhost:4000/uploads/" + link
                        }
                        alt="link"
                      />
                      <div
                        className="absolute py-2 px-3 bg-black bg-opacity-50 text-white bottom-2 right-2 rounded-2xl cursor-pointer"
                        onClick={() => deletePhoto(link)}
                      >
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
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </div>
                    </div>
                  );
                })}
            </div>

            <label htmlFor="" className="">
              Description
            </label>
            <br />
            <textarea
              type="text"
              className=""
              placeholder="description"
              value={value.description}
              onChange={(ev) =>
                setValue({ ...value, description: ev.target.value })
              }
            />
            <br />
            <Perks selected={value} onChange={setValue} perk={value.perks} />
            <br />
            <label htmlFor="" className="">
              Extra Info
            </label>
            <br />
            <input
              type="text"
              className=""
              placeholder="extrainfo"
              value={value.extraInfo}
              onChange={(ev) =>
                setValue({ ...value, extraInfo: ev.target.value })
              }
            />
            <br />
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label htmlFor="" className="">
                  Check In
                </label>
                <br />
                <input
                  type="text"
                  className=""
                  placeholder="12:00"
                  value={value.checkIn}
                  onChange={(ev) =>
                    setValue({ ...value, checkIn: ev.target.value })
                  }
                />
              </div>

              <div>
                <label htmlFor="" className="">
                  Check Out
                </label>
                <br />
                <input
                  type="text"
                  className=""
                  placeholder="12:00"
                  value={value.checkOut}
                  onChange={(ev) =>
                    setValue({ ...value, checkOut: ev.target.value })
                  }
                />
              </div>

              <div>
                <label htmlFor="" className="">
                  Max Guests
                </label>
                <br />
                <input
                  type="text"
                  className=""
                  placeholder="1"
                  onChange={(ev) =>
                    setValue({ ...value, maxGuests: ev.target.value })
                  }
                />
              </div>
            </div>

            <br />
            <div className="">
              <button className="bg-indigo-500 hover:bg-violet-700 text-white font-bold p-2 rounded-full">
                Add Place
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Places;
