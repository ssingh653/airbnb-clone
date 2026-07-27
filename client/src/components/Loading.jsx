import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-16 w-full grow min-h-[40vh] text-center">
      {/* Premium Rotating SVG Ring */}
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-gray-100 dark:border-gray-800 animate-pulse"></div>
        <div className="absolute w-12 h-12 rounded-full border-4 border-transparent border-t-rose-500 border-r-rose-400 animate-spin"></div>
      </div>
      
      <span className="mt-4 text-sm font-semibold tracking-wide text-gray-500 dark:text-gray-400 animate-pulse uppercase">
        Loading...
      </span>
    </div>
  );
}
