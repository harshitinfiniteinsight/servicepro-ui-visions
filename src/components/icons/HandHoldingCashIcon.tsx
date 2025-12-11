import React from "react";

interface HandHoldingCashIconProps {
  className?: string;
}

export const HandHoldingCashIcon = ({ className = "" }: HandHoldingCashIconProps) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Wrist and Sleeve - solid black shape */}
      <path
        d="M7.5 20.5C7.5 20.5 8 20 8.5 20C9 20 9.5 20.5 9.5 20.5L10 21.5C10 21.5 9.5 22 9 22C8.5 22 8 21.5 8 21.5L7.5 20.5Z"
        fill="currentColor"
      />
      {/* Circular button cutout on sleeve */}
      <circle cx="8.5" cy="21" r="0.6" fill="white" />
      
      {/* Hand - Palm facing up with smooth curved outlines */}
      <path
        d="M8 21.5L6.5 19C6 18 6 16.5 6.5 15.5L7.5 14C8 13.5 8.5 13 9 13C9.5 13 10 13.5 10.5 14L11.5 15.5C12 16.5 12 18 11.5 19L10 21.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Thumb */}
      <path
        d="M6.5 15.5L5 14C4.5 13.5 4 13.5 4 14C4 14.5 4.5 15 5 15.5L6.5 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Back Bill (partially visible, offset upward and to the left) */}
      <rect
        x="5.5"
        y="9.5"
        width="6.5"
        height="4.5"
        rx="0.6"
        fill="currentColor"
        opacity="0.7"
      />
      
      {/* Front Bill with rounded ornamental corners */}
      <rect
        x="7"
        y="11"
        width="6.5"
        height="4.5"
        rx="0.6"
        stroke="currentColor"
        strokeWidth="1.3"
        fill="white"
      />
      
      {/* Ornamental rounded corners on front bill */}
      <path
        d="M7 11C7 11 7.2 10.8 7.5 10.8C7.8 10.8 8 11 8 11"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
      />
      <path
        d="M13 11C13 11 12.8 10.8 12.5 10.8C12.2 10.8 12 11 12 11"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
      />
      <path
        d="M7 15.5C7 15.5 7.2 15.7 7.5 15.7C7.8 15.7 8 15.5 8 15.5"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
      />
      <path
        d="M13 15.5C13 15.5 12.8 15.7 12.5 15.7C12.2 15.7 12 15.5 12 15.5"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
      />
      
      {/* Bold Dollar Sign ($) centered on front bill */}
      <path
        d="M10 12V16M9.2 12.5H10.8M9.2 15.5H10.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="10" cy="13.2" r="0.4" fill="currentColor" />
      <circle cx="10" cy="14.8" r="0.4" fill="currentColor" />
    </svg>
  );
};

