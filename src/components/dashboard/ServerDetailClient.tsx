"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Cpu, HardDrive, MemoryStick, ArrowUpRight, Puzzle, ClipboardCopy,
    ClipboardCheck, RadioTower, Terminal, Play, StopCircle, RefreshCw, Wifi, WifiOff
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Trash2 } from "lucide-react";
import {useRouter} from "next/navigation";

// --- Typ-Definitionen (angepasst für die neuen Anforderungen) ---
interface IBackupConfig {
    targetPath: string;
    driveFolderId: string;
}

interface IModule {
    type: 'MINECRAFT_JAVA' | 'WEB_SERVER' | 'TAILSCALE' | 'ADGUARD_HOME' | 'GENERIC_METRICS';
    cached_data?: {
        [key: string]: string | number | boolean | null;
    };
}

type Server = {
    id: string;
    name: string;
    provider: string;
    status: 'Online' | 'Offline';
    cpuUsage: number;
    ramUsage: number;
    diskUsage: number;
    panelUrl: string;
    backup_config?: IBackupConfig; // Backup-Konfig ist jetzt Teil des Server-Typs
    modules: IModule[]; // Der Server hat jetzt ein Array von Modulen
};

type MetricData = { time: string; usage: number; };

type TooltipPayload = {
    payload: MetricData;
    value: number;
};

interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
}

// --- Framer Motion Varianten ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

// --- Hauptkomponente ---
export function ServerDetailClient({ server, cpuHistory }: { server: Server, cpuHistory: MetricData[] }) {

    // Wir finden die spezifischen Module für die bedingte Anzeige
    const minecraftModule = server.modules.find(m => m.type === 'MINECRAFT_JAVA');
    const tailscaleModule = server.modules.find(m => m.type === 'TAILSCALE');

    return (
        <div className="p-4 sm:p-8">
            <header className="mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gradient">{server.name}</h1>
                    <p className="text-lg text-gray-400">{server.provider}</p>
                </div>
                <div className="flex items-center gap-2">
                    <a href={server.panelUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-400 hover:text-mint transition-colors">
                        <ArrowUpRight size={16} />
                        Host Panel
                    </a>
                </div>
            </header>

            <motion.div
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div className="lg:col-span-2 space-y-6" variants={itemVariants}>
                    <MetricsChart data={cpuHistory} />
                    <LastEventsWidget />
                </motion.div>

                <motion.div className="space-y-6" variants={itemVariants}>
                    <ServerActionsWidget server={server} />
                    <LiveMetricsWidget server={server} />
                    <ServerInfoWidget />

                    {/* Module werden jetzt dynamisch basierend auf den Daten gerendert */}
                    {tailscaleModule && <TailscaleModuleWidget module={tailscaleModule} />}
                    {minecraftModule && <MinecraftModuleWidget module={minecraftModule} />}
                </motion.div>
            </motion.div>
        </div>
    );
}


// ============== HILFS- & WIDGET-KOMPONENTEN ==============

function CopyButton({ textToCopy }: { textToCopy: string }) {
    const [hasCopied, setHasCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2000);
    };
    return (
        <button onClick={handleCopy} className="p-1 text-gray-400 hover:text-mint transition-colors">
            {hasCopied ? <ClipboardCheck size={16} className="text-mint" /> : <ClipboardCopy size={16} />}
        </button>
    );
}

function MetricsChart({ data }: { data: MetricData[] }) {
    const [activeRange, setActiveRange] = useState('30 Min');

    const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
        if (active && payload && payload.length) {
            return (
                <div className="rounded-md border border-dark-subtle bg-dark-surface/80 p-2 shadow-lg backdrop-blur-sm">
                    <p className="text-sm text-gray-300">{`Zeit: ${label}`}</p>
                    <p className="text-sm font-bold text-mint">{`Auslastung: ${payload[0].value}%`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="bg-dark-surface border-dark-subtle text-white h-96">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>CPU Auslastung</CardTitle>
                    <div className="flex gap-2 text-sm">
                        {['30 Min', '3h', '24h'].map(range => (
                            <button
                                key={range}
                                onClick={() => setActiveRange(range)}
                                className={cn(
                                    "px-3 py-1 rounded-md transition-colors",
                                    activeRange === range ? 'bg-mint text-dark-background font-semibold' : 'hover:bg-dark-subtle/50'
                                )}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#34D399" stopOpacity={0.7}/>
                                <stop offset="95%" stopColor="#34D399" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey="time" stroke="rgba(255, 255, 255, 0.5)" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="rgba(255, 255, 255, 0.5)" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(52, 211, 153, 0.1)' }}/>
                        <Area type="monotone" dataKey="usage" stroke="#34D399" fillOpacity={1} fill="url(#colorCpu)" />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

function LiveMetricsWidget({ server }: { server: Server }) {
    const metrics = [
        { name: 'CPU', value: server.cpuUsage, icon: Cpu, details: "2 Kerne, 2.4 GHz" },
        { name: 'RAM', value: server.ramUsage, icon: MemoryStick, details: "4 GB DDR4" },
        { name: 'Speicher', value: server.diskUsage, icon: HardDrive, details: "80 GB NVMe SSD" }
    ];

    return (
        <Card className="bg-dark-surface border-dark-subtle text-white">
            <CardHeader><CardTitle>Live Metriken</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-3 gap-4 text-center">
                {metrics.map(metric => (
                    <Popover key={metric.name}>
                        <PopoverTrigger asChild>
                            <div className="flex flex-col items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-dark-subtle/30">
                                <metric.icon className="text-mint" />
                                <span className="text-2xl font-bold">{metric.value}%</span>
                                <span className="text-xs text-gray-400">{metric.name}</span>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto bg-dark-surface border-dark-subtle text-white text-sm p-2">
                            {metric.details}
                        </PopoverContent>
                    </Popover>
                ))}
            </CardContent>
        </Card>
    );
}

function ServerInfoWidget() {
    const ipAddress = "123.45.67.89";
    return (
        <Card className="bg-dark-surface border-dark-subtle text-white">
            <CardHeader><CardTitle>Informationen</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">IP Adresse</span>
                    <div className="flex items-center gap-2 font-mono">
                        <span>{ipAddress}</span>
                        <CopyButton textToCopy={ipAddress} />
                    </div>
                </div>
                <div className="flex justify-between"><span className="text-gray-400">Standort</span><span>Frankfurt, DE</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Betriebssystem</span><span>Ubuntu 22.04</span></div>
            </CardContent>
        </Card>
    );
}

function LastEventsWidget() {
    const events = [
        { time: "2m ago", text: "User 'tguentner' logged in via SSH", icon: Terminal },
        { time: "1h ago", text: "Server restarted successfully", icon: RadioTower },
        { time: "5h ago", text: "Docker image 'nginx:latest' pulled", icon: Puzzle },
    ];
    return (
        <Card className="bg-dark-surface border-dark-subtle text-white">
            <CardHeader><CardTitle>Letzte Events</CardTitle></CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {events.map((event, index) => (
                        <li key={index} className="flex items-center gap-4 text-sm">
                            <event.icon className="text-mint flex-shrink-0" size={18} />
                            <span className="flex-grow text-gray-300">{event.text}</span>
                            <span className="text-gray-500 font-mono">{event.time}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}

// ============== AKTUALISIERTE & NEUE WIDGETS ==============

// ============== WIDGET FÜR AKTIONEN ==============

// KORREKTUR: Der 'Pick'-Typ wird um 'id' erweitert
function ServerActionsWidget({ server }: { server: Pick<Server, 'id' | 'backup_config'> }) {
    const router = useRouter(); // Empfohlen für die Navigation

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/servers/${server.id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error("Löschen fehlgeschlagen");
            }
            // Besser als window.location.href, um einen vollen Reload zu vermeiden
            router.push('/dashboard');
            router.refresh(); // Sorgt dafür, dass die Serverliste aktualisiert wird
        } catch (error) {
            console.error("Fehler beim Löschen:", error);
        }
    };

    const genericActions = [
        { name: "Start", icon: Play, className: "hover:border-green-500 hover:text-green-400" },
        { name: "Stop", icon: StopCircle, className: "hover:border-red-500 hover:text-red-400" },
        { name: "Restart", icon: RefreshCw, className: "hover:border-blue-500 hover:text-blue-400" },
    ];

    const hasBackup = !!server.backup_config;

    return (
        <Card className="bg-dark-surface border-dark-subtle text-white">
            <CardHeader><CardTitle>Aktionen</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
                {genericActions.map(action => (
                    <button key={action.name} className={`flex items-center gap-2 text-sm p-2 border border-dark-subtle rounded-md transition-colors ${action.className}`}>
                        <action.icon size={16} />
                        <span>{action.name}</span>
                    </button>
                ))}
                {hasBackup && (
                    <button className="flex items-center gap-2 text-sm p-2 border border-dark-subtle rounded-md transition-colors hover:border-purple-500 hover:text-purple-400">
                        <HardDrive size={16} />
                        <span>Backup erstellen</span>
                    </button>
                )}
                <ConfirmationDialog
                    triggerButton={
                        <button className="flex items-center gap-2 text-sm p-2 border border-dark-subtle rounded-md transition-colors hover:border-red-500 hover:text-red-400">
                            <Trash2 size={16} />
                            <span>Löschen</span>
                        </button>
                    }
                    title="Bist du dir absolut sicher?"
                    description="Diese Aktion kann nicht rückgängig gemacht werden. Dadurch wird dieser Server und alle zugehörigen Daten endgültig gelöscht."
                    onConfirm={handleDelete}
                />
            </CardContent>
        </Card>
    );
}

function TailscaleModuleWidget({ module }: { module: IModule }) {
    // Der Status kommt jetzt aus den (gemockten) cached_data des Moduls
    const isConnected = module.cached_data?.status === "connected";

    return (
        <Card className="bg-dark-surface border-dark-subtle text-white">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Wifi className="text-mint" size={20}/>
                    <CardTitle>Tailscale</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Status</span>
                    <span className={isConnected ? "text-green-400" : "text-red-400"}>
                        {isConnected ? "Verbunden" : "Getrennt"}
                    </span>
                </div>
                <div className="flex gap-2 pt-3 border-t border-dark-subtle/50">
                    <button className="flex items-center flex-1 justify-center gap-2 text-sm p-2 border border-dark-subtle rounded-md transition-colors hover:border-blue-500 hover:text-blue-400">
                        <Wifi size={16} />
                        <span>Verbinden</span>
                    </button>
                    <button className="flex items-center flex-1 justify-center gap-2 text-sm p-2 border border-dark-subtle rounded-md transition-colors hover:border-red-500 hover:text-red-400">
                        <WifiOff size={16} />
                        <span>Trennen</span>
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}

function MinecraftModuleWidget({ module }: { module: IModule }) {
    return (
        <Card className="bg-dark-surface border-dark-subtle text-white">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Puzzle size={20} className="text-mint"/>
                    <CardTitle>Minecraft Modul</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-400">Live TPS</span>
                    <span className="text-green-400 font-bold">{module.cached_data?.tps || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Spieler online</span>
                    <span>{module.cached_data?.players || 0} / 20</span>
                </div>
            </CardContent>
        </Card>
    )
}