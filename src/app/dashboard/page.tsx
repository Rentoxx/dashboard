// src/app/dashboard/page.tsx

import { ServerCard, type Server } from "@/components/dashboard/ServerCard";

// Mock-Daten für unsere Server. Später kommen diese aus einer echten Datenquelle.
const mockServers: Server[] = [
    {
        id: "digital-ocean-nomi",
        name: "Nomi-Server",
        provider: "DigitalOcean",
        status: "Online",
        cpuUsage: 35,
        ramUsage: 60,
        diskUsage: 75,
    },
    {
        id: "oracle-arm",
        name: "ARM-Instanz",
        provider: "Oracle Cloud",
        status: "Online",
        cpuUsage: 12,
        ramUsage: 25,
        diskUsage: 40,
    },
    {
        id: "oracle-vpn",
        name: "VPN Gateway",
        provider: "Oracle Cloud",
        status: "Offline",
        cpuUsage: 0,
        ramUsage: 0,
        diskUsage: 10,
    },
];

export default function DashboardOverviewPage() {
    return (
        <div className="min-h-screen w-full bg-dark-background p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white shadow-indigo-500/50 shadow-2xl">Serverübersicht</h1>
                <p className="text-lg text-gray-400 ">
                    Ein Überblick über den Status deiner aktiven Instanzen.
                </p>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Wir gehen die Liste der Server durch und erstellen für jeden eine Karte */}
                {mockServers.map((server) => (
                    <ServerCard key={server.id} server={server} />
                ))}
            </main>
        </div>
    );
}