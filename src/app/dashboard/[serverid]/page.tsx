// src/app/dashboard/[serverid]/page.tsx
import { notFound } from "next/navigation";
import { ServerDetailClient } from "@/components/dashboard/ServerDetailClient";

// --- Typen & Mock-Daten ---

interface IBackupConfig {
    targetPath: string;
    driveFolderId: string;
}

interface IModule {
    type: 'MINECRAFT_JAVA' | 'WEB_SERVER' | 'TAILSCALE' | 'ADGUARD_HOME' | 'GENERIC_METRICS';
    cached_data?: { [key: string]: string | number | boolean | null };
}

type Server = {
    id: string; name: string; provider: string; status: 'Online' | 'Offline';
    cpuUsage: number; ramUsage: number; diskUsage: number; panelUrl: string;
    backup_config?: IBackupConfig;
    modules: IModule[];
};

type MetricData = { time: string; usage: number; };

// KORREKTUR: Mock-Server haben jetzt ein "modules"-Array
const mockServers: Server[] = [
    {
        id: "digital-ocean-nomi",
        name: "Nomi-Server",
        provider: "DigitalOcean",
        status: "Online", cpuUsage: 35, ramUsage: 60, diskUsage: 75,
        panelUrl: "https://cloud.digitalocean.com/login",
        backup_config: { targetPath: "/home/minecraft", driveFolderId: "123xyz" },
        modules: [
            { type: 'MINECRAFT_JAVA', cached_data: { tps: 20.0, players: 3 } },
            { type: 'TAILSCALE', cached_data: { status: 'connected' } },
            { type: 'WEB_SERVER' }
        ]
    },
    {
        id: "oracle-arm",
        name: "ARM-Instanz",
        provider: "Oracle Cloud",
        status: "Online", cpuUsage: 12, ramUsage: 25, diskUsage: 40,
        panelUrl: "https://www.oracle.com/cloud/sign-in.html",
        modules: [
            { type: 'TAILSCALE', cached_data: { status: 'connected' } },
            { type: 'ADGUARD_HOME' }
        ]
    },
    {
        id: "oracle-vpn",
        name: "VPN Gateway",
        provider: "Oracle Cloud",
        status: "Offline", cpuUsage: 0, ramUsage: 0, diskUsage: 10,
        panelUrl: "https://www.oracle.com/cloud/sign-in.html",
        modules: [
            { type: 'TAILSCALE', cached_data: { status: 'disconnected' } }
        ]
    },
];

const MOCK_CPU_HISTORY: MetricData[] = [
    { time: '10:00', usage: 20 }, { time: '10:05', usage: 25 },
    { time: '10:10', usage: 22 }, { time: '10:15', usage: 30 },
    { time: '10:20', usage: 35 }, { time: '10:25', usage: 33 },
    { time: '10:30', usage: 40 }, { time: '10:35', usage: 38 },
];

export async function generateStaticParams() {
    return mockServers.map((server) => ({ serverid: server.id }));
}

async function getServerData(id: string): Promise<Server | undefined> {
    await new Promise(resolve => setTimeout(resolve, 1));
    return mockServers.find(s => s.id === id);
}

export default async function ServerDetailPage({ params }: { params: { serverid: string } }) {
    const { serverid } = await params;
    const server = await getServerData(serverid);

    if (!server) {
        notFound();
    }

    return <ServerDetailClient server={server} cpuHistory={MOCK_CPU_HISTORY} />;
}