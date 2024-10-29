import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import ReactMarkdown from "react-markdown";

const LeftSidebar = ({ setSoilConditions }) => {
  const [imageFile, setImageFile] = useState(null);
  const [logs, setLogs] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [irrigationMonths, setIrrigationMonths] = useState("");
  const [irrigationDays, setIrrigationDays] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("");

  const fetchLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation is not supported by this browser.");
      } else {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
              );
              const data = await response.json();

              if (data && data.address) {
                const state = data.address.state || 'Unknown state';
                const district = data.address.county || data.address.state_district || data.address.village || 'Unknown district';
                resolve({ latitude, longitude, district, state });
              } else {
                reject("Could not determine district from coordinates.");
              }
            } catch (error) {
              reject(`Error fetching district: ${error.message}`);
            }
          },
          (error) => {
            reject(error.message);
          }
        );
      }
    });
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
  });

  const handleSubmit = async () => {
    if (!imageFile || !irrigationMonths || !irrigationDays || !selectedCrop) {
      alert("Please fill in all fields and upload an image.");
      return;
    }

    setIsLoading(true);

    let location = null;
    try {
      location = await fetchLocation();
    } catch (error) {
      alert(`Error fetching location: ${error}`);
      setIsLoading(false);
      return;
    }

    let days = parseInt(irrigationMonths) * 31 + parseInt(irrigationDays);
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("days", days);
    formData.append("crop", selectedCrop);
    formData.append("location", location.district);

    try {
      const response = await fetch("https://agriadapt.onrender.com/crop_suggestion", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json(); // Parse the response as JSON
        console.log(data)
        const responseText = data.suggestion || "No suggestions available.";
        setLogs(responseText);
        setSoilConditions(responseText);
      } else {
        setLogs("Failed to Analyze Soil Conditions.");
      }
    } catch (error) {
      console.error("Error:", error);
      setLogs("Failed to Analyze Soil Conditions.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 h-[90vh] bg-[#4F5165] rounded-lg shadow-md p-4 flex flex-col justify-between">
      <div className="flex-1 mb-4" style={{ flexBasis: "30%" }}>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 cursor-pointer flex items-center justify-center ${
            isDragActive ? "border-blue-500" : "border-gray-300"
          }`}
          style={{
            height: "100%",
            backgroundColor: "#f0f4ff",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <input {...getInputProps()} required />
          {imageFile ? (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Uploaded"
              className="absolute w-full h-full object-contain rounded-lg"
              style={{ maxHeight: "100%" }}
            />
          ) : (
            <p className="text-center text-gray-500">
              Drag & drop an image here, or click to select one
            </p>
          )}
        </div>
      </div>

      {/* Irrigation Tenure Title and Selector */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white mb-2">Irrigation Tenure</h2>
        <div className="flex space-x-4 mb-2">
          <input
            type="number"
            placeholder="Months"
            value={irrigationMonths}
            onChange={(e) => setIrrigationMonths(e.target.value)}
            className="w-1/2 p-2 rounded-md border border-gray-300 text-center"
            min="0"
            required
          />
          <input
            type="number"
            placeholder="Days"
            value={irrigationDays}
            onChange={(e) => {
              const value = Math.min(e.target.value, 31);
              setIrrigationDays(value);
            }}
            max="31"
            min="0"
            className="w-1/2 p-2 rounded-md border border-gray-300 text-center"
            required
          />
        </div>
      </div>

      {/* Crop Selection */}
      <div className="mb-4">
        <label className="block mb-2 text-white font-semibold">Select Crop</label>
        <select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className="w-full p-2 rounded-md border border-gray-300"
          required
        >
          <option value="">Select a crop...</option>
          <option value="wheat">Wheat</option>
          <option value="tomato">Tomato</option>
          <option value="maize">Maize</option>
          <option value="pumpkin">Pumpkin</option>
          <option value="potato">Potato</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="mt-4 bg-green-600 text-white font-bold py-2 rounded-md space-x-2 font-bold"
      >
        <span>🔍</span>
        <span className="font-bold">Analyze Conditions</span>
      </button>

      {/* Logs Box with Loading Animation */}
      <div className="mt-4 bg-white p-4 rounded-md shadow h-[30vh] overflow-auto">
        {isLoading ? (
          <p className="text-gray-500 animate-pulse">Loading...</p>
        ) : (
          <ReactMarkdown className="text-gray-500">{logs}</ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
