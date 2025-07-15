"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";

// KORREKTUR: Typ um die neuen, notwendigen Felder erweitert
export type NewServerData = {
    name: string;
    provider: string;
    panelUrl: string;
    ipAddress: string;
    apiUrl: string; // z.B. die URL zum Prometheus Node Exporter
};

type AddServerDialogProps = {
    onServerAdd: (data: NewServerData) => void;
};



export function AddServerDialog({ onServerAdd }: AddServerDialogProps) {
    const [name, setName] = useState("");
    const [provider, setProvider] = useState("");
    const [panelUrl, setPanelUrl] = useState("");
    const [ipAddress, setIpAddress] = useState("");
    const [apiUrl, setApiUrl] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = async () => {
        // API-Aufruf statt nur State-Änderung
        try {
            const response = await fetch('/api/servers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, provider, panelUrl, ipAddress, apiUrl }),
            });
            if (!response.ok) throw new Error("Fehler beim Erstellen des Servers");

            const newServer = await response.json();
            onServerAdd(newServer); // Übergibt den neuen Server an die Dashboard-Seite
        } catch (error) {
            console.error(error);
            // Hier könntest du eine Fehlermeldung anzeigen
        }

        // Reset form and close dialog
        setName(""); setProvider(""); setPanelUrl(""); setIpAddress(""); setApiUrl("");
        setIsOpen(false);
    };



    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 border-mint bg-mint/10 text-mint hover:bg-mint/20 hover:text-mint">
                    <PlusCircle size={18} />
                    Server hinzufügen
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-dark-surface border-dark-subtle text-white">
                <DialogHeader>
                    <DialogTitle>Neuen Server hinzufügen</DialogTitle>
                    <DialogDescription>
                        Gib die Basis-Informationen und Endpunkte deines Servers ein.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3 bg-dark-background border-dark-subtle" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="provider" className="text-right">Provider</Label>
                        <Input id="provider" value={provider} onChange={(e) => setProvider(e.target.value)} className="col-span-3 bg-dark-background border-dark-subtle" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="panelUrl" className="text-right">Panel URL</Label>
                        <Input id="panelUrl" value={panelUrl} onChange={(e) => setPanelUrl(e.target.value)} className="col-span-3 bg-dark-background border-dark-subtle" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="ipAddress" className="text-right">IP Adresse</Label>
                        <Input id="ipAddress" value={ipAddress} onChange={(e) => setIpAddress(e.target.value)} className="col-span-3 bg-dark-background border-dark-subtle" placeholder="z.B. 123.45.67.89" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="apiUrl" className="text-right">Metrik URL</Label>
                        <Input id="apiUrl" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} className="col-span-3 bg-dark-background border-dark-subtle" placeholder="z.B. http://IP:9100/metrics" />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} className="bg-mint text-dark-background hover:bg-mint-dark">
                        Speichern
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}