import React, { useState, useEffect } from 'react';

function TypingAnimation({ text }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const typingInterval = setInterval(() => {
      // Check if all letters are displayed
      if (currentIndex < text.length) {
        // Add one letter from the original text to the displayText
        setDisplayText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      } else {
        // Clear interval when all letters are displayed
        clearInterval(typingInterval);
      }
    }, 30); // Adjust the speed of typing by changing the interval time

    // Clear interval on component unmount
    return () => clearInterval(typingInterval);
  }, [currentIndex, text]);

  return (
    <div className='my-3'>
      <h5 className='mb-0 fw-bold'>Ai Evaluation :</h5>  
      <span>{displayText}</span>
      {/* You can add a blinking cursor element here if needed */}
    </div>
  );
}

export default TypingAnimation;
