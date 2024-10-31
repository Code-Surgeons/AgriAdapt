import React, { useRef, useEffect} from "react";
import Typewriter from "./Typewriter";

const RightSidebar = ({ loadingPriceInfo, priceInfo }) => {
  const isDisabled = !priceInfo;

  const contentContainerRef = useRef(null);

  useEffect(() => {
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTop = contentContainerRef.current.scrollHeight;
    }
  }, [priceInfo]);  

  return (
    <div
      className={`flex-1 h-[90vh] rounded-lg shadow-md p-4 flex flex-col justify-center items-center ${
        isDisabled ? "bg-white bg-opacity-50 cursor-not-allowed" : "bg-[#293132]"
      }`}
    >
      {/* Markdown Display */}
      <div
        ref={contentContainerRef}
        className={`flex-grow bg-white p-4 rounded-md border border-gray-300 ${
          isDisabled ? "opacity-50" : ""
        }`}
        style={{
          width: "100%",
          minHeight: "100%",
          overflowY: "auto",
          overflowX: "auto",
        }}
      >
        {loadingPriceInfo ? (
          <p className="text-gray-500 text-lg animate-pulse">Loading...</p>
        ) : (
          isDisabled
            ? "No price information or recommendations available."
            : <Typewriter text={priceInfo} speed={5} />
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
