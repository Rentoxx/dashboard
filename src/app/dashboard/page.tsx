// src/app/dashboard/page.tsx

import { ServerCard, type Server } from "@/components/dashboard/ServerCard";

// Mock-Daten für unsere Server. Später kommen diese aus einer echten Datenquelle.
// Mock-Daten um die neue panelUrl erweitert
const mockServers: Server[] = [
    {
        id: "digital-ocean-nomi",
        name: "Nomi-Server",
        provider: "DigitalOcean",
        status: "Online",
        cpuUsage: 35,
        ramUsage: 60,
        diskUsage: 75,
        panelUrl: "https://cloud.digitalocean.com/login", // NEU
    },
    {
        id: "oracle-arm",
        name: "ARM-Instanz",
        provider: "Oracle Cloud",
        status: "Online",
        cpuUsage: 12,
        ramUsage: 25,
        diskUsage: 40,
        panelUrl: "https://www.oracle.com/cloud/sign-in.html", // NEU
    },
    {
        id: "oracle-vpn",
        name: "VPN Gateway",
        provider: "Oracle Cloud",
        status: "Offline",
        cpuUsage: 0,
        ramUsage: 0,
        diskUsage: 10,
        panelUrl: "https://www.oracle.com/cloud/sign-in.html", // NEU
    },
];

export default function DashboardOverviewPage() {
    return (
        <div className="min-h-screen w-full p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white">Serverübersicht</h1>
                <p className="text-lg text-gray-400 ">
                    Ein Überblick über den Status deiner aktiven Instanzen.
                </p>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockServers.map((server) => (
                    <ServerCard key={server.id} server={server} />
                ))}
            </main>
        </div>
    );
}