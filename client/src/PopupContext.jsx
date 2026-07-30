import React, { createContext, useContext, useState } from "react";

const PopupContext = createContext({});

export const usePopup = () => useContext(PopupContext);

export function PopupProvider({ children }) {
  const [popup, setPopup] = useState(null);

  const showAlert = (message, variant = "info", title = "") => {
    return new Promise((resolve) => {
      setPopup({
        type: "alert",
        message,
        title: title || (variant === "error" ? "Error" : variant === "success" ? "Success" : "Notification"),
        variant,
        onConfirm: () => {
          setPopup(null);
          resolve(true);
        },
      });
    });
  };

  const showConfirm = (message, title = "Are you sure?") => {
    return new Promise((resolve) => {
      setPopup({
        type: "confirm",
        message,
        title,
        onConfirm: () => {
          setPopup(null);
          resolve(true);
        },
        onCancel: () => {
          setPopup(null);
          resolve(false);
        },
      });
    });
  };

  return (
    <PopupContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      {popup && <PopupModal popup={popup} />}
    </PopupContext.Provider>
  );
}

function PopupModal({ popup }) {
  const { type, message, title, onConfirm, onCancel, variant } = popup;

  let iconColor = "text-blue-500 bg-blue-50 dark:bg-blue-950/40";
  let iconSvg = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.085 1.085l-.04.02m-.086-1.085a.75.75 0 00-1.086 1.086L12 13.5m0-6.75h.008v.008H12V6.75z" />
    </svg>
  );
  let confirmBtnClass = "bg-rose-500 hover:bg-rose-600";

  if (variant === "success") {
    iconColor = "text-green-500 bg-green-50 dark:bg-green-950/40";
    iconSvg = (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    );
    confirmBtnClass = "bg-emerald-500 hover:bg-emerald-600";
  } else if (variant === "error") {
    iconColor = "text-red-500 bg-red-50 dark:bg-red-950/40";
    iconSvg = (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    );
    confirmBtnClass = "bg-red-500 hover:bg-red-600";
  } else if (type === "confirm") {
    iconColor = "text-amber-500 bg-amber-50 dark:bg-amber-950/40";
    iconSvg = (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    );
    confirmBtnClass = "bg-amber-500 hover:bg-amber-600";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[4px] animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl border border-gray-150 dark:border-gray-700 max-w-sm w-full transform scale-95 animate-scale-up">
        <div className="flex gap-4">
          <div className={`p-2.5 h-fit rounded-2xl shrink-0 ${iconColor}`}>
            {iconSvg}
          </div>
          <div className="min-w-0 grow text-left">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight leading-snug">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed whitespace-pre-wrap">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          {type === "confirm" && (
            <button
              onClick={onCancel}
              className="px-4 py-2.5 rounded-2xl border border-gray-255 dark:border-gray-650 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-sm transition"
            >
              Cancel
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`px-6 py-2.5 rounded-2xl text-white font-bold text-sm shadow-md transition ${confirmBtnClass}`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
