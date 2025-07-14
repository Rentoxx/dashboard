// src/components/AuthButton.tsx
"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { LogIn, LogOut, Loader2, User } from "lucide-react";
import Image from "next/image";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

// Eine wiederverwendbare Klasse für den "Ghost"-Button-Stil
const buttonClassName = "flex items-center justify-center gap-2 rounded-md border border-dark-subtle bg-dark-surface/50 px-4 py-2 font-semibold text-dark-text shadow-sm backdrop-blur-sm transition-colors";

export const AuthButton = () => {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <Loader2 className="h-6 w-6 animate-spin text-mint" />;
    }

    // EINGELOGGTER ZUSTAND
    if (session) {
        return (
            <div className="flex items-center gap-4">
        <span className="text-sm text-gray-300 hidden sm:inline">
          Hallo, {session.user?.name}
        </span>
                <button
                    onClick={() => signOut()}
                    className={`${buttonClassName} hover:border-red-500/80 hover:text-red-400`}
                >
                    <LogOut size={16} />
                    <span>Logout</span>
                </button>
                {session.user?.image && (
                    <Image
                        src={session.user.image}
                        alt={session.user.name || "User Avatar"}
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-dark-subtle"
                    />
                )}
            </div>
        );
    }

    // AUSGELOGGTER ZUSTAND (mit Popup)
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className={`${buttonClassName} hover:border-mint/80 hover:text-mint`}>
                    <LogIn size={16} />
                    <span>Login</span>
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-dark-surface border-dark-subtle text-white">
                <DialogHeader>
                    <DialogTitle>Anmelden</DialogTitle>
                    <DialogDescription>
                        Wähle eine Anmeldemethode, um auf dein Dashboard zuzugreifen.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <button
                        onClick={() => signIn("github")}
                        className="w-full flex items-center justify-center gap-3 rounded-md bg-mint px-4 py-2 font-semibold text-dark-background transition-colors hover:bg-mint-dark"
                    >
                        <User size={16} />
                        <span>Mit GitHub anmelden</span>
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};