import { useState } from "react";
import LeftSidebar from "./components/LeftSidebar";
import MiddleSection from "./components/MiddleSection";
import RightSidebar from "./components/RightSidebar";
import Arrow from "./components/Arrow";
import TermsModal from "./components/TermsModal"; // Import TermsModal component

function App() {
  const [priceInfo, setPriceInfo] = useState(""); // State to hold price information
  const [soilConditions, setSoilConditions] = useState("");
  const [loadingPriceInfo, setLoadingPriceInfo] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false); // State for modal visibility

  const openTermsModal = () => setIsTermsOpen(true);
  const closeTermsModal = () => setIsTermsOpen(false);

  return (
    <div id="app_bg" className="min-h-screen flex flex-col justify-center items-center bg-dark">
      <h1 className="text-2xl text-white font-black mb-4">AgriAdapt - AI-Powered Assistant for Smarter Crop Choices</h1>

      <div className="flex items-center w-full h-full px-[10px] space-x-4">
        {/* Left Sidebar with Image Uploader */}
        <LeftSidebar setSoilConditions={setSoilConditions} />

        {/* Arrow between Left Sidebar and Middle Section */}
        <Arrow />

        {/* Middle Section with text, passing setPriceInfo as prop */}
        <MiddleSection soilConditions={soilConditions} setPriceInfo={setPriceInfo} setLoadingPriceInfo={setLoadingPriceInfo} />

        {/* Arrow between Middle Section and Right Sidebar */}
        <Arrow />

        {/* Right Sidebar with a Button, passing priceInfo as prop */}
        <RightSidebar priceInfo={priceInfo} loadingPriceInfo={loadingPriceInfo} />
      </div>

      {/* Footer with T&C link */}
      <div className="w-full text-white text-center mt-2 text-sm">
        Please carefully review our{" "}
        <span
          className="text-white font-bold underline cursor-pointer"
          onClick={openTermsModal}
        >
          T&C
        </span>{" "}
        before using the tool.
      </div>

      {/* Terms Modal */}
      <TermsModal isOpen={isTermsOpen} onClose={closeTermsModal} />
    </div>
  );
}

export default App;
