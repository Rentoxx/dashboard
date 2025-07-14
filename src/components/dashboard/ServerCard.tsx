// src/components/dashboard/ServerCard.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// ... (Server-Typ bleibt unverändert)
export type Server = {
    id: string;
    name: string;
    provider: string;
    status: 'Online' | 'Offline';
    cpuUsage: number;
    ramUsage: number;
    diskUsage: number;
};

type ServerCardProps = {
    server: Server;
};

export const ServerCard = ({ server }: ServerCardProps) => {
    const isOnline = server.status === 'Online';

    const getUsageColor = (usage: number): 'mint' | 'amber' | 'red' => {
        if (usage > 90) return 'red';
        if (usage > 75) return 'amber';
        return 'mint';
    };

    // KORREKTUR: Die 'bg'-Klassen sind jetzt direkt und ohne den komplexen Selektor.
    const USAGE_COLORS = {
        mint: {
            bg: "bg-mint", // Geändert
            shadow: "var(--shadow-progress-mint)",
            activeShadow: "0 0 20px 5px rgba(52, 211, 153, 0.7)",
        },
        amber: {
            bg: "bg-amber-400", // Geändert
            shadow: "var(--shadow-progress-amber)",
            activeShadow: "0 0 20px 5px rgba(251, 191, 36, 0.7)",
        },
        red: {
            bg: "bg-red-500", // Geändert
            shadow: "0 0 10px 2px rgba(239, 68, 68, 0.5)",
            activeShadow: "0 0 20px 5px rgba(239, 68, 68, 0.7)",
        }
    };

    const cpuColor = USAGE_COLORS[getUsageColor(server.cpuUsage)];
    const ramColor = USAGE_COLORS[getUsageColor(server.ramUsage)];
    const diskColor = USAGE_COLORS[getUsageColor(server.diskUsage)];

    return (
        <Link href={`/dashboard/${server.id}`} className="block">
            <Card className="bg-dark-surface border-dark-subtle text-white hover:border-mint transition-colors duration-200 cursor-pointer h-full">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>{server.name}</span>
                        <div className={`flex items-center gap-2 text-sm font-medium ${isOnline ? 'text-mint' : 'text-red-500'}`}>
                            <motion.div
                                className={`h-3 w-3 rounded-full ${isOnline ? 'bg-mint shadow-glow-online' : 'bg-red-500 shadow-glow-offline'}`}
                                animate={isOnline ? { scale: [1, 1.15, 1], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } } : {}}
                            />
                            <span>{server.status}</span>
                        </div>
                    </CardTitle>
                    <CardDescription className="text-gray-400">{server.provider}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* CPU-Auslastung */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm text-gray-300 ">
                            <span>CPU</span>
                            <span>{server.cpuUsage}%</span>
                        </div>
                        <Progress
                            value={server.cpuUsage}
                            indicatorClassName={cpuColor.bg}
                            indicatorShadow={cpuColor.shadow}
                            indicatorActiveShadow={cpuColor.activeShadow}
                        />
                    </div>
                    {/* RAM-Auslastung */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm text-gray-300">
                            <span>RAM</span>
                            <span>{server.ramUsage}%</span>
                        </div>
                        <Progress
                            value={server.ramUsage}
                            indicatorClassName={ramColor.bg}
                            indicatorShadow={ramColor.shadow}
                            indicatorActiveShadow={ramColor.activeShadow}
                        />
                    </div>
                    {/* Speicher-Auslastung */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm text-gray-300">
                            <span>Speicher</span>
                            <span>{server.diskUsage}%</span>
                        </div>
                        <Progress
                            value={server.diskUsage}
                            indicatorClassName={diskColor.bg}
                            indicatorShadow={diskColor.shadow}
                            indicatorActiveShadow={diskColor.activeShadow}
                        />
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};