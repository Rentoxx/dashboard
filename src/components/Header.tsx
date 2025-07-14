// src/components/Header.tsx
"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { AuthButton } from "./AuthButton";

export const Header = () => {
    const { data: session } = useSession();
    const homeHref = session ? "/dashboard" : "/";

    return (
        <header className="sticky top-0 z-50 w-full border-b border-dark-subtle/50 bg-dark-surface/50 backdrop-blur-lg">
            {/* Änderungen:
        - Höhe von h-16 auf h-14 reduziert
        - max-w-5xl entfernt, damit es auf großen Screens nicht mittig ist
        - padding (px-4) erhöht, damit es nicht am Rand klebt
      */}
            <div className="container mx-auto flex h-14 items-center justify-between px-6">
                <Link href={homeHref} className="font-bold text-mint transition-colors hover:text-mint-dark">
                    tguentner.tech
                </Link>

                <AuthButton />
            </div>
        </header>
    );
};