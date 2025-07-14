"use client";

import { LogIn, Rocket } from "lucide-react";
import { useEffect } from "react";
import { ProjectSection } from "@/components/ProjectSection";
import { TechStackSection } from "@/components/TechStackSection";

export default function LandingPage() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);

    const grid = document.getElementById('interactive-grid');
    if (grid) {
      grid.style.opacity = '1';
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
      // 1. Das <main>-Tag wird zum Positions-Container
      <main className="relative bg-dark-background">
        {/* 2. Der gesamte Hintergrund-Effekt wird hierher verschoben und auf 'fixed' gesetzt */}
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

        {/* 3. Alle Inhalts-Sektionen liegen jetzt ÜBER dem fixierten Hintergrund */}
        <div className="relative z-10">
          <section className="flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-8">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-5xl font-bold tracking-tight text-white md:text-7xl">
                Willkommen in meinem digitalen Maschinenraum.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
                Eine persönliche Dashboard-Anwendung zum Verwalten und Überwachen meiner
                selbst gehosteten Dienste – vom Game-Server bis zur Cloud-Infrastruktur.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
                <a href="/login" className="flex items-center justify-center gap-2 rounded-md bg-mint px-6 py-3 font-semibold text-dark-background shadow-lg transition-transform hover:scale-105 hover:bg-mint-dark focus:outline-none focus:ring-2 focus:ring-mint-light focus:ring-offset-2 focus:ring-offset-dark-background"><LogIn size={20} /><span>Login</span></a>
                <a href="/dashboard" className="flex items-center justify-center gap-2 rounded-md border border-dark-subtle bg-dark-surface/50 px-6 py-3 font-semibold text-dark-text shadow-lg backdrop-blur-sm transition-transform hover:scale-105 hover:border-mint focus:outline-none focus:ring-2 focus:ring-mint-light focus:ring-offset-2 focus:ring-offset-dark-background"><Rocket size={20} /><span>Demo ansehen</span></a>
              </div>
            </div>
          </section>

          <ProjectSection />
          <TechStackSection />
        </div>
      </main>
  );
}