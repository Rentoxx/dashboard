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

// Typdefinition für die Formulardaten
export type NewServerData = {
    name: string;
    provider: string;
    panelUrl: string;
    ipAddress: string;
    apiUrl: string; // z.B. die URL zum Prometheus Node Exporter
};

// More specific type for the server response
export type NewServerApiResponse = {
    _id: string;
    name: string;
    provider: string;
    panelUrl: string;
    ipAddress: string;
    owner: string;
    modules: string[];
};

type AddServerDialogProps = {
    onServerAdd: (data: NewServerApiResponse) => void; // Akzeptiert den vom Server zurückgegebenen Typ
};

export function AddServerDialog({ onServerAdd }: AddServerDialogProps) {
    // State für alle Formularfelder
    const [formData, setFormData] = useState<NewServerData>({
        name: "",
        provider: "",
        panelUrl: "",
        ipAddress: "",
        apiUrl: "",
    });
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async () => {
        setError(null); // Fehler zurücksetzen
        try {
            const response = await fetch('/api/servers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Fehler beim Erstellen des Servers");
            }

            const newServer = await response.json();
            onServerAdd(newServer); // Übergibt den neuen Server an die Dashboard-Seite

            // Formular zurücksetzen und Dialog schließen
            setFormData({ name: "", provider: "", panelUrl: "", ipAddress: "", apiUrl: "" });
            setIsOpen(false);
        } catch (err: unknown) { // Correction is here
            console.error(err);
            if (err instanceof Error) {
                setError(err.message); // Fehlermeldung im Dialog anzeigen
            } else {
                setError("An unknown error occurred");
            }
        }
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
                    {/* Alle Input-Felder verwenden jetzt den zentralen State */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3 bg-dark-background border-dark-subtle" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="provider" className="text-right">Provider</Label>
                        <Input id="provider" value={formData.provider} onChange={handleChange} className="col-span-3 bg-dark-background border-dark-subtle" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="panelUrl" className="text-right">Panel URL</Label>
                        <Input id="panelUrl" value={formData.panelUrl} onChange={handleChange} className="col-span-3 bg-dark-background border-dark-subtle" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="ipAddress" className="text-right">IP Adresse</Label>
                        <Input id="ipAddress" value={formData.ipAddress} onChange={handleChange} className="col-span-3 bg-dark-background border-dark-subtle" placeholder="z.B. 123.45.67.89" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="apiUrl" className="text-right">Metrik URL</Label>
                        <Input id="apiUrl" value={formData.apiUrl} onChange={handleChange} className="col-span-3 bg-dark-background border-dark-subtle" placeholder="z.B. http://IP:9100/metrics" />
                    </div>
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <DialogFooter>
                    <Button onClick={handleSubmit} className="bg-mint text-dark-background hover:bg-mint-dark">
                        Speichern
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}