// src/app/page.tsx
"use client";

import { Rocket } from "lucide-react";
import { ProjectSection } from "@/components/ProjectSection";
import { TechStackSection } from "@/components/TechStackSection";
import Link from "next/link";


export default function LandingPage() {
  return (
      <>
        <section className="flex min-h-[calc(100vh-7rem)] w-full flex-col items-center justify-center overflow-hidden p-8">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-5xl font-bold tracking-tight text-white md:text-7xl">
              Willkommen in meinem digitalen Maschinenraum.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
              Eine persönliche Dashboard-Anwendung zum Verwalten und Überwachen meiner
              selbst gehosteten Dienste – vom Game-Server bis zur Cloud-Infrastruktur. Test
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 rounded-md border border-dark-subtle bg-dark-surface/50 px-6 py-3 font-semibold text-dark-text shadow-lg backdrop-blur-sm transition-transform hover:scale-105 hover:border-mint focus:outline-none focus:ring-2 focus:ring-mint-light focus:ring-offset-2 focus:ring-offset-dark-background"
              >
                <Rocket size={20} />
                <span>Demo ansehen</span>
              </Link>
            </div>
          </div>
        </section>

        <ProjectSection />
        <TechStackSection />
      </>
  );
}