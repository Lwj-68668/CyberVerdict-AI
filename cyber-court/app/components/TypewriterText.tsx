"use client";

import { useEffect, useState } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

export default function TypewriterText({
  text,
  speed = 30,
  onComplete,
  className = "",
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const isComplete = currentIndex >= text.length;

  useEffect(() => {
    if (isComplete) {
      onComplete?.();
      return;
    }

    const timer = window.setTimeout(() => {
      setDisplayedText((previous) => previous + text[currentIndex]);
      setCurrentIndex((previous) => previous + 1);
    }, speed);

    return () => window.clearTimeout(timer);
  }, [currentIndex, isComplete, onComplete, speed, text]);

  return (
    <span className={className}>
      {displayedText}
      {!isComplete ? (
        <span className="cursor-blink ml-0.5 inline-block h-4 w-0.5 align-middle bg-[var(--gold)]" />
      ) : null}
    </span>
  );
}
