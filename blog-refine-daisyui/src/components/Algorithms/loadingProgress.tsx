// components/LoadingProgress.tsx
import React, { useEffect, useState, CSSProperties } from "react";

interface LoadingProgressProps {
  isLoading: boolean;
  complete: boolean;
}

const LoadingProgress: React.FC<LoadingProgressProps> = ({
  isLoading,
  complete,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      return;
    }

    if (complete) {
      setProgress(100);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 10;
        return next >= 90 ? 90 : next;
      });
    }, 18000); // 18000 ms = 18s -> 10 steps to reach 90% in 3min

    return () => clearInterval(interval);
  }, [isLoading, complete]);

  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      <div
        className="radial-progress text-secundary"
        style={{ "--value": progress } as CSSProperties}
        aria-valuenow={progress}
        role="progressbar"
      >
        {progress}%
      </div>
      <p className="text-sm text-gray-500">
        {progress < 100 ? "Loading optimization..." : "Completed!"}
      </p>
    </div>
  );
};

export default LoadingProgress;
