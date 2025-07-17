"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ServerCard } from "@/components/dashboard/ServerCard";
import { AddServerDialog } from "@/components/dashboard/AddServerDialog";
import { Loader2 } from "lucide-react";
import type { Server } from "@/components/dashboard/ServerCard"; // Importiert den Server-Typ

// Die Mock-Daten für den Demo-Modus bleiben unverändert
const mockServers: Server[] = [
    { id: "digital-ocean-nomi", name: "Nomi-Server", provider: "DigitalOcean", status: "Online", cpuUsage: 35, ramUsage: 60, diskUsage: 75, panelUrl: "https://cloud.digitalocean.com/login" },
    { id: "oracle-arm", name: "ARM-Instanz", provider: "Oracle Cloud", status: "Online", cpuUsage: 12, ramUsage: 25, diskUsage: 40, panelUrl: "https://www.oracle.com/cloud/sign-in.html" },
];

type NewServerApiResponse = {
    _id: string;
    name: string;
    provider: string;
    panelUrl: string;
    ipAddress: string;
    owner: string;
    modules: string[];
};

export default function DashboardOverviewPage() {
    const {status } = useSession();
    const [userServers, setUserServers] = useState<Server[]>([]);
    const [isLoading, setIsLoading] = useState(true); // Eigener Lade-State

    // Effekt zum Laden der Serverdaten, wenn der Benutzer authentifiziert ist
    useEffect(() => {
        const fetchServers = async () => {
            if (status === "authenticated") {
                setIsLoading(true);
                try {
                    const response = await fetch('/api/servers');
                    if (!response.ok) {
                        throw new Error('Fehler beim Laden der Server');
                    }
                    const data = await response.json();
                    setUserServers(data);
                } catch (error) {
                    console.error(error);
                    // Hier könntest du eine Fehlermeldung anzeigen
                } finally {
                    setIsLoading(false);
                }
            } else if (status === "unauthenticated") {
                setIsLoading(false); // Nicht laden im Demo-Modus
            }
        };

        fetchServers();
    }, [status]); // Abhängig vom Session-Status

    // KORREKTUR 1 (Anwendung): Der 'any'-Typ wird durch den spezifischen Typ ersetzt.
    const handleServerAdd = (newServerFromApi: NewServerApiResponse) => {
        const newServerForState: Server = {
            id: newServerFromApi._id, // Echte ID aus der DB
            name: newServerFromApi.name,
            provider: newServerFromApi.provider,
            panelUrl: newServerFromApi.panelUrl,
            status: 'Online',
            cpuUsage: 0,
            ramUsage: 0,
            diskUsage: 5,
        };
        setUserServers(currentServers => [...currentServers, newServerForState]);
    };

    // Kombinierter Lade-Zustand für Session und Daten
    if (status === "loading" || (status === "authenticated" && isLoading)) {
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
                {/* onServerAdd ist jetzt korrekt angebunden */}
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