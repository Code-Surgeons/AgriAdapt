import React, { useRef, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Typewriter from "./Typewriter";

const MiddleSection = ({ soilConditions, setPriceInfo, setLoadingPriceInfo }) => {
  const [markdownContent, setMarkdownContent] = useState("No data yet.");
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Get Prices");

  const contentContainerRef = useRef(null);

  const isDisabled = !soilConditions;

  const handleButtonClick = async (value) => {
    if (isDisabled) return;

    setLoading(true);
    setButtonText(value === "Soil Preparation" ? "Get Recommendation" : "Get Prices");

    try {
      const formData = new FormData();
      let option = "";
      if (value === "Soil Preparation") {
        option = "soil_preparation";
      } else if (value === "Crop Alternatives") {
        option = "crop_alternative";
      } else if (value === "Crop Species Alternatives") {
        option = "crop_species_alternatives";
      }
      formData.append("option", option);

      const response = await fetch("http://localhost:8000/agriculture_suggestion", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const result = data.suggestion || "No solution available.";
      setMarkdownContent(`\n\n## Result\n${result}`);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMarkdownContent(`\n\n## Error\nFailed to fetch data.`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetPricesOrRecommendation = async () => {
    if (isDisabled) return;

    setLoadingPriceInfo(true);
    try {
      const response = await fetch("http://localhost:8000/get_prices", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const res = data.markdown_table || "No Data available.";
      setPriceInfo(res);
    } catch (error) {
      console.error("Error fetching price info:", error);
      setPriceInfo("Failed to fetch price information.");
    } finally {
      setLoadingPriceInfo(false);
    }
  };

  const getEmoji = () => {
    return buttonText === "Get Recommendation" ? "🌱" : "💰";
  };

  useEffect(() => {
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTop = contentContainerRef.current.scrollHeight;
    }
  }, [markdownContent]);
  
  return (
    <div
      className={`flex-1 h-[90vh] rounded-lg shadow-md p-4 flex flex-col ${isDisabled ? "bg-white bg-opacity-50 cursor-not-allowed" : "bg-[#474044]"}`}
    >
      <div className="flex justify-between space-x-2 mb-4">
        <button
          className={`py-2 px-4 rounded-md bg-blue-500 text-white font-bold ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
          onClick={() => handleButtonClick("Crop Alternatives")}
          disabled={isDisabled}
        >
          Crop Alternatives
        </button>
        <button
          className={`py-2 px-4 rounded-md bg-blue-500 text-white font-bold ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
          onClick={() => handleButtonClick("Soil Preparation")}
          disabled={isDisabled}
        >
          Soil Preparation
        </button>
        <button
          className={`py-2 px-4 rounded-md bg-blue-500 text-white font-bold ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
          onClick={() => handleButtonClick("Crop Species Alternatives")}
          disabled={isDisabled}
        >
          Crop Species Alternatives
        </button>
      </div>

      <div
        className={`flex-grow bg-white p-4 rounded-md overflow-y-auto border border-gray-300 ${isDisabled ? "opacity-50" : ""}`}
        style={{ minHeight: "80%" }}
        ref={contentContainerRef}
      >
        {loading ? (
          <p className="text-gray-500 animate-pulse">Loading...</p>
        ) : (
          <Typewriter key={markdownContent} text={markdownContent} speed={5} />
        )}
      </div>

      <button
        className={`w-full mt-4 py-2 rounded-md bg-green-600 text-white font-bold flex items-center justify-center space-x-2 font-bold  ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
        onClick={handleGetPricesOrRecommendation}
        disabled={loading || isDisabled}
      >
        <span>{getEmoji()}</span>
        <span className="font-bold">{buttonText}</span>
      </button>
    </div>
  );
};

export default MiddleSection;
