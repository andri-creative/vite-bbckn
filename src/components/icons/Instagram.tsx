import type { SVGProps } from "react";

const Instagram = (props: SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id="ig-grad" r="150%" cx="30%" cy="107%">
                <stop offset="0%" stopColor="#fdf497" />
                <stop offset="5%" stopColor="#fdf497" />
                <stop offset="45%" stopColor="#fd5949" />
                <stop offset="60%" stopColor="#d6249f" />
                <stop offset="90%" stopColor="#285AEB" />
            </radialGradient>
        </defs>
        <rect x="2" y="2" width="20" height="20" rx="5.5" ry="5.5" fill="url(#ig-grad)" />
        <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.6" fill="none" />
        <circle cx="17.5" cy="6.5" r="1.1" fill="white" />
    </svg>
);

export { Instagram };
