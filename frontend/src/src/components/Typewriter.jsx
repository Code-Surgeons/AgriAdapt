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
      setDisplayedText((prev) => prev + text[index]);
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
