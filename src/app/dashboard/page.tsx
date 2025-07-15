"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ServerCard } from "@/components/dashboard/ServerCard";
import { AddServerDialog, NewServerData } from "@/components/dashboard/AddServerDialog";
import { Loader2 } from "lucide-react";
import type { Server } from "@/components/dashboard/ServerCard"; // Importiere den Server-Typ

// Die Mock-Daten für den Demo-Modus
const mockServers: Server[] = [
    { id: "digital-ocean-nomi", name: "Nomi-Server", provider: "DigitalOcean", status: "Online", cpuUsage: 35, ramUsage: 60, diskUsage: 75, panelUrl: "https://cloud.digitalocean.com/login" },
    { id: "oracle-arm", name: "ARM-Instanz", provider: "Oracle Cloud", status: "Online", cpuUsage: 12, ramUsage: 25, diskUsage: 40, panelUrl: "https://www.oracle.com/cloud/sign-in.html" },
];

export default function DashboardOverviewPage() {
    const { data: session, status } = useSession();
    const [userServers, setUserServers] = useState<Server[]>([]); // State für die Server des eingeloggten Nutzers

    // Sobald die Session geladen ist, könntest du hier die echten Server von der DB fetchen.
    // Fürs Erste starten wir mit einer leeren Liste.
    useEffect(() => {
        if (status === "authenticated") {
            // HIER WÜRDE DER FETCH ZU DEINER API KOMMEN, z.B. GET /api/servers
            // fetch('/api/servers').then(res => res.json()).then(data => setUserServers(data));
        }
    }, [status]);

    const handleServerAdd = (newServerData: NewServerData) => {
        const newServer: Server = {
            // Im echten Leben würde die ID von der Datenbank kommen
            id: `new-server-${Math.random()}`,
            name: newServerData.name,
            provider: newServerData.provider,
            panelUrl: newServerData.panelUrl,
            // Standardwerte für einen neuen Server
            status: "Online",
            cpuUsage: 0,
            ramUsage: 0,
            diskUsage: 5,
        };

        // Fügt den neuen Server zum lokalen State hinzu (später würde das ein API-Call sein)
        setUserServers(currentServers => [...currentServers, newServer]);
    };

    // Lade-Zustand, während die Session geprüft wird
    if (status === "loading") {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-16 w-16 animate-spin text-mint" />
            </div>
        );
    }

    const isDemoMode = status === "unauthenticated";
    const serversToDisplay = isDemoMode ? mockServers : userServers;

    return (
        <div className="w-full p-8">
            <header className="mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Serverübersicht</h1>
                    <p className="text-lg text-gray-400">
                        {isDemoMode
                            ? "Ein Demo-Überblick über den Status deiner Instanzen."
                            : "Ein Überblick über den Status deiner aktiven Instanzen."}
                    </p>
                </div>
                {!isDemoMode && <AddServerDialog onServerAdd={handleServerAdd} />}
            </header>

            {serversToDisplay.length > 0 ? (
                <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {serversToDisplay.map((server) => (
                        <ServerCard key={server.id} server={server} />
                    ))}
                </main>
            ) : (
                <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-dark-subtle rounded-lg">
                    <h2 className="text-xl font-semibold text-white">Noch keine Server</h2>
                    <p className="text-gray-400 mt-2">Füge deinen ersten Server hinzu, um mit dem Monitoring zu beginnen.</p>
                </div>
            )}
        </div>
    );
}