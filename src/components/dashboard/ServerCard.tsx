// src/components/dashboard/ServerCard.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation"; // useRouter importieren
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export type Server = {
    id: string;
    name: string;
    provider: string;
    status: 'Online' | 'Offline';
    cpuUsage: number;
    ramUsage: number;
    diskUsage: number;
    panelUrl: string;
};

type ServerCardProps = {
    server: Server;
};

export const ServerCard = ({ server }: ServerCardProps) => {
    const router = useRouter(); // Router-Hook initialisieren
    const isOnline = server.status === 'Online';

    // KORREKTUR: Funktion, die die Navigation auslöst
    const handleCardClick = () => {
        router.push(`/dashboard/${server.id}`);
    };

    const getUsageColor = (usage: number): 'mint' | 'amber' | 'red' => {
        if (usage > 90) return 'red';
        if (usage > 75) return 'amber';
        return 'mint';
    };

    const USAGE_COLORS = {
        mint: {
            bg: "bg-mint",
            shadow: "var(--shadow-progress-mint)",
            activeShadow: "0 0 20px 5px rgba(52, 211, 153, 0.7)",
        },
        amber: {
            bg: "bg-amber-400",
            shadow: "var(--shadow-progress-amber)",
            activeShadow: "0 0 20px 5px rgba(251, 191, 36, 0.7)",
        },
        red: {
            bg: "bg-red-500",
            shadow: "0 0 10px 2px rgba(239, 68, 68, 0.5)",
            activeShadow: "0 0 20px 5px rgba(239, 68, 68, 0.7)",
        }
    };

    const cpuColor = USAGE_COLORS[getUsageColor(server.cpuUsage)];
    const ramColor = USAGE_COLORS[getUsageColor(server.ramUsage)];
    const diskColor = USAGE_COLORS[getUsageColor(server.diskUsage)];

    // KORREKTUR: Kein <Link> mehr, der die Card umschließt. Stattdessen onClick.
    return (
        <Card
            className="flex flex-col bg-dark-surface border-dark-subtle text-white transition-colors duration-200 h-full cursor-pointer hover:border-mint"
            onClick={handleCardClick}
        >
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>
                            {/* Dieser Link bleibt, aber wir verhindern, dass der Klick weitergegeben wird */}
                            <Link href={`/dashboard/${server.id}`} onClick={(e) => e.stopPropagation()} className="hover:text-mint transition-colors">
                                {server.name}
                            </Link>
                        </CardTitle>
                        <CardDescription className="text-gray-400">{server.provider}</CardDescription>
                    </div>
                    <div className={`flex items-center gap-2 text-sm font-medium ${isOnline ? 'text-mint' : 'text-red-500'}`}>
                        <motion.div
                            className={`h-3 w-3 rounded-full ${isOnline ? 'bg-mint shadow-glow-online' : 'bg-red-500 shadow-glow-offline'}`}
                            animate={isOnline ? { scale: [1, 1.15, 1], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } } : {}}
                        />
                        <span>{server.status}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                {/* Progress Bars bleiben unverändert */}
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
            <CardFooter>
                <a
                    href={server.panelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} // Dies ist jetzt noch wichtiger!
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-mint transition-colors"
                >
                    <ExternalLink size={16} />
                    <span>Zum Host-Panel</span>
                </a>
            </CardFooter>
        </Card>
    );
};