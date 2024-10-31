import React from "react";

const Arrow = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-gray-800"
      fill="none"
      viewBox="0 0 24 24"
      stroke="#fff"
      strokeWidth={3} // Increase stroke width for bold effect
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
};

export default Arrow;
