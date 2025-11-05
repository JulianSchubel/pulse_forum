export default function PulseLogo() {
    return (
        <svg
            width="150"
            height="100"
            viewBox="0 0 150 100"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Static Speech Bubble */}
            <rect
                x="10"
                y="10"
                width="130"
                height="80"
                rx="10"
                ry="10"
                fill="none"
                stroke=""
                strokeWidth="4"
            />

            {/* Animated Pulse Line */}
            <path
                className="pulse-line"
                d="M20 50 L40 50 L50 30 L60 70 L70 50 L130 50"
                fill="none"
                stroke="url(#pulseGradient)"
                strokeWidth="4"
                strokeLinecap="round"
            />

            {/* Gradient Definition */}
            <defs>
                 <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1A5FB4" />
                    <stop offset="50%" stopColor="#00ff95" />
                    <stop offset="100%" stopColor="#1A5FB4" />
                    <animateTransform
                        attributeName="gradientTransform"
                        type="translate"
                        from="-1 0"
                        to="1 0"
                        dur="2s"
                        repeatCount="indefinite"
                    />
                </linearGradient>
            </defs>
        </svg>
    );
}
