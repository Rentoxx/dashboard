// src/components/InteractiveBackground.tsx
"use client";

import { useEffect } from 'react';

export const InteractiveBackground = () => {
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
        };
        window.addEventListener("mousemove", handleMouseMove);

        // Optional: Ein kleiner Fade-in für das Gitter, um einen harten Übergang zu vermeiden
        const grid = document.getElementById('interactive-grid');
        if (grid) {
            grid.style.opacity = '1';
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0"
        >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#3741512a_1px,transparent_1px),linear-gradient(to_bottom,#3741512a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_800px_at_100%_0%,#34d3991f,transparent)] animate-pulse-glow"></div>
            <div
                id="interactive-grid"
                className="absolute inset-0 bg-[linear-gradient(to_right,#9ca3af33_1px,transparent_1px),linear-gradient(to_bottom,#9ca3af33_1px,transparent_1px)] bg-[size:40px_40px] opacity-0 transition-opacity duration-300"
                style={{
                    mask: 'radial-gradient(circle 250px at var(--mouse-x) var(--mouse-y), black, transparent)',
                    WebkitMask: 'radial-gradient(circle 250px at var(--mouse-x) var(--mouse-y), black, transparent)'
                }}
            ></div>
        </div>
    );
};