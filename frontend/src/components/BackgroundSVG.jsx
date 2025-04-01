import React from "react";

const BackgroundSVG = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        className="opacity-30"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path
          d="M0,0 C300,20 400,120 500,120 C600,120 700,60 800,30 C900,0 1000,0 1200,0 Z"
          fill="url(#grad1)"
          className="translate-y-[5%]"
        />
        <path
          d="M0,0 C200,80 400,80 600,40 C800,0 1000,0 1200,0 Z"
          fill="url(#grad1)"
          transform="translate(0, 480)"
        />
        <circle cx="5%" cy="15%" r="50" fill="#6366f1" fillOpacity="0.05" />
        <circle cx="95%" cy="50%" r="80" fill="#8b5cf6" fillOpacity="0.05" />
        <circle cx="30%" cy="90%" r="100" fill="#6366f1" fillOpacity="0.05" />
        <circle cx="85%" cy="5%" r="120" fill="#8b5cf6" fillOpacity="0.05" />
      </svg>
    </div>
  );
};

export default BackgroundSVG;
