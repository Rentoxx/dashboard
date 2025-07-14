// src/components/dashboard/ServerDetailClient.tsx
"use client";
import { motion } from "framer-motion";
import { Cpu, HardDrive, MemoryStick, ArrowUpRight, Puzzle } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from "@/components/CopyButton";

// Define die Typen direkt hier, damit die Komponente eigenständig ist
type Server = {
    id: string; name: string; provider: string; status: 'Online' | 'Offline';
    cpuUsage: number; ramUsage: number; diskUsage: number; panelUrl: string;
};
type MetricData = { time: string; usage: number; };

// Framer Motion Varianten für die Animation
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1, // Kleine Verzögerung zwischen den Animationen der Kinder
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
        },
    },
};

// Die Komponente nimmt jetzt alle benötigten Daten als Props entgegen
export function ServerDetailClient({ server, cpuHistory }: { server: Server, cpuHistory: MetricData[] }) {
    const isOnline = server.status === 'Online';

    return (
        <div className="p-4 sm:p-8">
            <header className="mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">{server.name}</h1>
                    <p className="text-lg text-gray-400">{server.provider}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 text-sm font-medium ${isOnline ? 'text-mint' : 'text-red-500'}`}>
                        <div className={`h-3 w-3 rounded-full ${isOnline ? 'bg-mint shadow-glow-online' : 'bg-red-500 shadow-glow-offline'}`} />
                        <span>{server.status}</span>
                    </div>
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

                {/* Jedes Hauptelement im Grid bekommt die Item-Animation */}
                <motion.div className="lg:col-span-2" variants={itemVariants}>
                    <MetricsChart data={cpuHistory} />
                </motion.div>

                <motion.div className="space-y-6" variants={itemVariants}>
                    <LiveMetricsWidget server={server} />
                    <ServerInfoWidget />
                    {server.id === "digital-ocean-nomi" && <MinecraftModuleWidget />}
                </motion.div>

            </motion.div>
        </div>
    );
}
// Widget 1: Der große Graph - mit dem neuen Typ
function MetricsChart({ data }: { data: MetricData[] }) { // KORREKTUR hier
    return (
        <Card className="bg-dark-surface border-dark-subtle text-white h-96">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>CPU Auslastung</CardTitle>
                    <div className="flex gap-2 text-sm">
                        <button className="px-3 py-1 bg-dark-subtle/50 rounded-md">30 Min</button>
                        <button className="px-3 py-1 hover:bg-dark-subtle/50 rounded-md">3h</button>
                        <button className="px-3 py-1 hover:bg-dark-subtle/50 rounded-md">24h</button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#34D399" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#34D399" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey="time" stroke="rgba(255, 255, 255, 0.5)" fontSize={12} />
                        <YAxis stroke="rgba(255, 255, 255, 0.5)" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: '#27272a', border: '1px solid #52525b' }} />
                        <Area type="monotone" dataKey="usage" stroke="#34D399" fillOpacity={1} fill="url(#colorCpu)" />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

// ... (Rest der Widget-Komponenten bleibt unverändert) ...
function LiveMetricsWidget({ server }: { server: Server }) {
    return (
        <Card className="bg-dark-surface border-dark-subtle text-white">
            <CardHeader><CardTitle>Live Metriken</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center gap-2">
                    <Cpu className="text-mint" />
                    <span className="text-2xl font-bold">{server.cpuUsage}%</span>
                    <span className="text-xs text-gray-400">CPU</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <MemoryStick className="text-blue-400" />
                    <span className="text-2xl font-bold">{server.ramUsage}%</span>
                    <span className="text-xs text-gray-400">RAM</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <HardDrive className="text-amber-400" />
                    <span className="text-2xl font-bold">{server.diskUsage}%</span>
                    <span className="text-xs text-gray-400">Speicher</span>
                </div>
            </CardContent>
        </Card>
    );
}

function ServerInfoWidget() {
    const ipAddress = "123.45.67.89"; // IP als Variable speichern

    return (
        <Card className="bg-dark-surface border-dark-subtle text-white">
            <CardHeader><CardTitle>Informationen</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">IP Adresse</span>
                    <div className="flex items-center gap-2">
                        <span>{ipAddress}</span>
                        <CopyButton textToCopy={ipAddress} />
                    </div>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Standort</span>
                    <span>Frankfurt, DE</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Betriebssystem</span>
                    <span>Ubuntu 22.04</span>
                </div>
            </CardContent>
        </Card>
    );
}

function MinecraftModuleWidget() {
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
                    <span className="text-green-400 font-bold">20.0</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Spieler online</span>
                    <span>3 / 20</span>
                </div>
            </CardContent>
        </Card>
    )
}