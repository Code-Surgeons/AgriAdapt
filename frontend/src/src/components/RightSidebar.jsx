import React from "react";
import ReactMarkdown from "react-markdown";
import Markdown from 'markdown-to-jsx'
import remarkGfm from "remark-gfm"; // Import GFM for extended markdown
import rehypeRaw from "rehype-raw"; // Import rehypeRaw for raw HTML

const RightSidebar = ({ loadingPriceInfo, priceInfo }) => {
  const isDisabled = !priceInfo;

  return (
    <div
      className={`flex-1 h-[90vh] rounded-lg shadow-md p-4 flex flex-col justify-center items-center ${
        isDisabled ? "bg-white bg-opacity-50 cursor-not-allowed" : "bg-[#293132]"
      }`}
    >
      {/* Markdown Display */}
      <div
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
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            className="prose" // Tailwind CSS class for markdown styling
          >
            {isDisabled
              ? "No price information or recommendations available."
              : priceInfo}
          </Markdown>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
