// src/components/dashboard/ServerCard.tsx
"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
    const statusBgClass = isOnline ? 'bg-mint' : 'bg-red-500';

    return (
        <Link href={`/dashboard/${server.id}`}>
            <Card className="bg-dark-surface border-dark-subtle text-white hover:border-mint transition-colors duration-200 cursor-pointer shadow-indigo-500/50 shadow-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span className="shadow-indigo-500/50 shadow-2xl">{server.name}</span>
                        <div className={`flex items-center gap-2 text-sm font-medium ${isOnline ? 'text-mint' : 'text-red-500'}`}>
                            <div
                                className={`h-3 w-3 rounded-full shadow-2xl ${statusBgClass} ${isOnline ? 'shadow-glow-online' : 'shadow-glow-offline'}`}
                            />
                            <span>{server.status}</span>
                        </div>
                    </CardTitle>
                    <CardDescription className="text-gray-400">{server.provider}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* CPU-Auslastung */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm text-gray-300 shadow-indigo-500/50 shadow-2xl">
                            <span>CPU</span>
                            <span>{server.cpuUsage}%</span>
                        </div>
                        {/* Nur die benutzerdefinierte Progress-Schattenklasse ist jetzt nötig */}
                        <Progress value={server.cpuUsage} className="h-2 [&>div]:bg-mint [&>div]:shadow-progress-mint " />
                    </div>
                    {/* RAM-Auslastung */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm text-gray-300">
                            <span>RAM</span>
                            <span>{server.ramUsage}%</span>
                        </div>
                        <Progress value={server.ramUsage} className="h-2 [&>div]:bg-blue-400 [&>div]:shadow-progress-blue" />
                    </div>
                    {/* Speicher-Auslastung */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm text-gray-300">
                            <span>Speicher</span>
                            <span>{server.diskUsage}%</span>
                        </div>
                        <Progress value={server.diskUsage} className="h-2 [&>div]:bg-amber-400 [&>div]:shadow-progress-amber" />
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};
    