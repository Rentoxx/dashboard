import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Server, { IServer } from "@/models/Server";
import User from "@/models/User";
import { ServerDetailClient } from "@/components/dashboard/ServerDetailClient";
import { Types } from "mongoose";

// KORREKTUR: Wir definieren den Modul-Typ hier genau so, wie ihn die Client-Komponente erwartet.
type ModuleType = 'MINECRAFT_JAVA' | 'WEB_SERVER' | 'TAILSCALE' | 'ADGUARD_HOME' | 'GENERIC_METRICS';

type PlainServer = {
    id: string;
    name: string;
    provider: string;
    status: 'Online' | 'Offline';
    cpuUsage: number;
    ramUsage: number;
    diskUsage: number;
    panelUrl: string;
    backup_config?: {
        targetPath: string;
        driveFolderId: string;
    };
    modules: {
        type: ModuleType; // <-- Verwenden des spezifischen Typs anstelle von 'string'
        cached_data?: { [key: string]: string | number | boolean | null };
    }[];
};

type MetricData = { time: string; usage: number; };

// Mock-Daten bleiben unverändert
const MOCK_CPU_HISTORY: MetricData[] = [
    { time: '10:00', usage: 20 }, { time: '10:05', usage: 25 },
    { time: '10:10', usage: 22 }, { time: '10:15', usage: 30 },
    { time: '10:20', usage: 35 }, { time: '10:25', usage: 33 },
    { time: '10:30', usage: 40 }, { time: '10:35', usage: 38 },
];

async function getServerData(id: string): Promise<IServer | null> {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;
    if (!Types.ObjectId.isValid(id)) return null;
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) return null;
    const server = await Server.findById(id).populate('modules');
    if (!server || server.owner.toString() !== currentUser._id.toString()) return null;
    return server;
}

export default async function ServerDetailPage({ params }: { params: { serverid: string } }) {
    const { serverid } = params;
    const serverDocument = await getServerData(serverid);

    if (!serverDocument) {
        notFound();
    }

    // Die Umwandlung bleibt dieselbe, aber das Ergebnis entspricht jetzt dem richtigen Typ.
    const plainServer: PlainServer = JSON.parse(JSON.stringify({
        ...serverDocument.toObject(),
        id: serverDocument._id.toString(),
        status: 'Online',
        cpuUsage: 35,
        ramUsage: 60,
        diskUsage: 75,
    }));

    return <ServerDetailClient server={plainServer} cpuHistory={MOCK_CPU_HISTORY} />;
}