import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Perks from "../components/Perks";
import axios from "axios";

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
  console.log(value);
  const { action } = useParams();
  async function formSubmit(ev) {
    ev.preventDefault();
    await axios.post("/addplaces", {
      value: {
        ...value,
      },
    });
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
        setValue({ ...value, photos: { ...filenames } });
      });
    // alert("Upload Successful");
  }

  return (
    <div>
      {action !== "new" && (
        <div className="text-center">
          <Link
            className="inline-flex gap-2 justify-center border p-2 rounded-full cursor-pointer bg-gray-100 bg-indigo-200 p-2 rounded-full"
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
              <button className="max-w-sm border rounded-full bg-gray-200 px-2 hover:shadow">
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
              </button>
              {value.photos.length > 0 &&
                value.photos.map((link) => {
                  return (
                    <div className="h-20 flex">
                      <img
                        className="rounded-2xl object-cover"
                        src={"http://localhost:4000/uploads/" + link}
                        alt=""
                      />
                    </div>
                  );
                })}
            </div>

            <br />
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
            <Perks selected={value.perks} onChange={setValue} />
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
