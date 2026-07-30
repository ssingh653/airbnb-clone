import { React, lazy, Suspense, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Perks from "../components/Perks";
import axios from "axios";
import Loading from "../components/Loading";
import { usePopup } from "../PopupContext";
// import Accomodations from "../components/Accomodations";
const Accomodations = lazy(() => import("../components/Accomodations"));

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

  const navigate = useNavigate();
  const { showAlert, showConfirm } = usePopup();
  const [isUploading, setIsUploading] = useState(false);
  const { action } = useParams();
  const id = action && action !== "new" ? action : undefined;

  useEffect(() => {
    if (!id) {
      setValue({
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
      return;
    }
    axios.get("/places/" + id).then((response) => {
      const { data } = response;
      if (data) {
        setValue({
          title: data.title || "",
          address: data.address || "",
          photos: data.photos || [],
          description: data.description || "",
          perks: data.perks || [],
          extraInfo: data.extraInfo || "",
          checkIn: data.checkIn || "",
          checkOut: data.checkOut || "",
          maxGuests: data.maxGuests || 1,
        });
      }
    });
  }, [id]);

  async function formSubmit(ev) {
    ev.preventDefault();
    if (!value.title || value.title.trim().length < 5) {
      showAlert("Title is required and must be at least 5 characters long.", "error");
      return;
    }
    if (!value.address || value.address.trim().length === 0) {
      showAlert("Property address is required.", "error");
      return;
    }
    if (!value.photos || value.photos.length === 0) {
      showAlert("Please upload at least one photo for the property.", "error");
      return;
    }
    if (!value.description || value.description.trim().length < 10) {
      showAlert("Description is required and must be at least 10 characters long.", "error");
      return;
    }
    if (!value.checkIn || value.checkIn.trim().length === 0) {
      showAlert("Check-in time is required.", "error");
      return;
    }
    if (!value.checkOut || value.checkOut.trim().length === 0) {
      showAlert("Check-out time is required.", "error");
      return;
    }
    const maxGuestsInt = parseInt(value.maxGuests);
    if (!maxGuestsInt || maxGuestsInt < 1 || isNaN(maxGuestsInt)) {
      showAlert("Maximum number of guests must be at least 1.", "error");
      return;
    }

    const places = {
      title: value.title,
      address: value.address,
      photos: value.photos,
      description: value.description,
      perks: value.perks,
      extraInfo: value.extraInfo,
      checkIn: value.checkIn,
      checkOut: value.checkOut,
      maxGuests: maxGuestsInt,
    };
    if (id) {
      const PlacesDoc = await axios.put("/addplaces", { id, ...places });
      if (PlacesDoc) {
        await showAlert("Updated Successfully", "success");
        navigate("/account/places");
      }
    } else {
      const PlacesDoc = await axios.post("/addplaces", places);
      if (PlacesDoc) {
        await showAlert("Added Successfully", "success");
        navigate("/account/places");
      }
    }
  }

  async function deletePlace(ev) {
    ev.preventDefault();
    if (await showConfirm("Are you sure you want to delete this accommodation?")) {
      const res = await axios.delete("/places/" + id);
      if (res) {
        await showAlert("Deleted Successfully", "success");
        navigate("/account/places");
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
    const files = ev.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }
    axios
      .post("/upload", data)
      .then((response) => {
        const { data: filenames } = response;
        for (let i = 0; i < filenames.length; i++) {
          setValue((prevState) => ({
            ...prevState,
            photos: [...prevState.photos, filenames[i]],
          }));
        }
      })
      .catch((err) => {
        console.error("Upload error:", err);
        showAlert("Failed to upload image. Please try again.", "error");
      })
      .finally(() => {
        setIsUploading(false);
      });
  }

  return (
    <div>
      {action === undefined && (
        <div className="max-w-4xl mx-auto py-4">
          <div className="flex justify-between items-center mb-6 pl-2">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Accomodations</h2>
            <Link
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-2.5 px-5 rounded-2xl shadow-md hover:shadow-lg active:scale-95 transition duration-200 text-sm tracking-tight"
              to="/account/places/new"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add New Place
            </Link>
          </div>
          <Suspense fallback={<Loading />}>
            <Accomodations />
          </Suspense>
        </div>
      )}
      {action !== undefined && (
        <div className="m-4 max-w-4xl mx-auto">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex gap-1 items-center bg-gray-150 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 transition text-gray-800 px-4 py-2 rounded-full font-semibold shadow-sm mb-6 border border-gray-250 dark:border-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back
          </button>
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
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5 pl-1">Photos</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-2">
              {/* Uploader Box */}
              <label className="h-28 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-rose-500 dark:hover:border-rose-400 rounded-2xl cursor-pointer flex flex-col items-center justify-center gap-1 bg-gray-50 dark:bg-gray-800 hover:bg-rose-50/20 dark:hover:bg-rose-950/10 text-gray-500 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-455 transition duration-200">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFile}
                  disabled={isUploading}
                />
                {isUploading ? (
                  <>
                    <svg className="animate-spin h-6 w-6 text-rose-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-500">Uploading...</span>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                      />
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-wider">Upload</span>
                  </>
                )}
              </label>

              {/* Rendered Uploaded Photos */}
              {value.photos.length > 0 &&
                value.photos.map((link) => (
                  <div className="h-28 flex relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm group" key={link}>
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      src={getPhotoUrl(link)}
                      alt="uploaded preview"
                    />
                    <button
                      type="button"
                      onClick={() => deletePhoto(link)}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-xl cursor-pointer hover:bg-red-500 transition opacity-0 group-hover:opacity-100"
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
                    </button>
                  </div>
                ))}
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
                <div className="relative my-2 w-full">
                  <button
                    type="button"
                    onClick={() =>
                      setValue({
                        ...value,
                        maxGuests: Math.max(1, (parseInt(value.maxGuests) || 1) - 1),
                      })
                    }
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-gray-50 hover:bg-rose-500 hover:text-white dark:bg-gray-700 dark:hover:bg-rose-500 dark:hover:text-white border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-300 transition duration-150 active:scale-95 cursor-pointer shadow-sm text-base font-bold select-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    min="1"
                    className="w-full border border-gray-200 dark:border-gray-700 py-3 px-12 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900 focus:border-rose-500 transition-all duration-200 text-center font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="1"
                    value={value.maxGuests}
                    onChange={(ev) =>
                      setValue({
                        ...value,
                        maxGuests: Math.max(1, parseInt(ev.target.value) || 1),
                      })
                    }
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setValue({
                        ...value,
                        maxGuests: (parseInt(value.maxGuests) || 1) + 1,
                      })
                    }
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-gray-50 hover:bg-rose-500 hover:text-white dark:bg-gray-700 dark:hover:bg-rose-500 dark:hover:text-white border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-300 transition duration-150 active:scale-95 cursor-pointer shadow-sm text-base font-bold select-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button className="flex-1 px-6 py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold rounded-2xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 text-sm tracking-tight">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {id ? "Save Accommodation" : "Add Accommodation"}
              </button>
              {id && (
                <button
                  type="button"
                  onClick={deletePlace}
                  className="px-6 py-3.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 dark:hover:text-white font-bold rounded-2xl active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 text-sm tracking-tight"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  Delete Place
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Places;
