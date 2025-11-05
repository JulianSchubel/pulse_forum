import React from "react";

export const PulseForumLogo: React.FC<{ size?: number }> = ({ size = 200 }) => (
    <svg
        width={size}
        height={(size * 1.2)}
        viewBox="0 0 400 480"
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Speech bubble outline */}
        <path
            d="M100 50h200c33 0 60 27 60 60v100c0 33-27 60-60 60H180l-50 40v-40h-30c-33 0-60-27-60-60V140c0-33 27-60 60-60z"
            fill="none"
            stroke="#0E2337"
            strokeWidth="20"
            strokeLinecap="round"
            strokeLinejoin="round"
        />

        {/* Pulse waveform */}
        <path
            d="M120 190h40l15-30 25 70 25-90 20 50h35"
            fill="none"
            stroke="url(#pulseGradient)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
        />

        {/* Gradient definition */}
        <defs>
            <linearGradient id="pulseGradient" x1="120" y1="190" x2="320" y2="190" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E53935" />
                <stop offset="1" stopColor="#FB8C00" />
            </linearGradient>
        </defs>

        {/* Text: PULSE */}
        <text
            x="50%"
            y="370"
            textAnchor="middle"
            fontFamily="Hurmit, sans-serif"
            fontSize="72"
            fontWeight="700"
            fill="#0E2337"
        >
            PULSE
        </text>

        {/* Text: FORUM */}
        <text
            x="50%"
            y="430"
            textAnchor="middle"
            fontFamily="Hurmit, sans-serif"
            fontSize="36"
            fontWeight="500"
            fill="#0E2337"
            letterSpacing="4"
        >
            FORUM
        </text>
    </svg>
);

export default PulseForumLogo;

