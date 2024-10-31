// Typewriter.js
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

const Typewriter = ({ text, speed = 50 }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!text) return;

    let index = 0;
    setDisplayedText(""); // Reset displayed text before typing new text
    const intervalId = setInterval(() => {
      // Add text character by character
      console.log(text[index]);
      console.log("rrrrrrrrrrrr")
      if (index !== text.length) {
        setDisplayedText((prev) => prev + text[index]);
      }
    //   console.log(displayedText);
      index += 1;

      if (index === text.length) {
        clearInterval(intervalId);
      }
    }, speed);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [text, speed]);

  return <ReactMarkdown className="text-gray-500">{displayedText}</ReactMarkdown>;
};

export default Typewriter;
