import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/models/User';
import Server from '@/models/Server';
import Module from '@/models/Module';
import { Types } from 'mongoose';
import dbConnect from "@/lib/dbConnect";

export async function DELETE(request: Request, { params }: { params: { serverid: string } }) {
    try {
        await dbConnect();
    } catch (error) {
        console.error("Datenbankverbindungsfehler:", error);
        return NextResponse.json({ error: 'Datenbankverbindung fehlgeschlagen' }, { status: 500 });
    }



    const session = await getServerSession(authOptions);
    const { serverid } = params;

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    // Prüfen, ob die Server-ID eine gültige MongoDB ObjectId ist
    if (!Types.ObjectId.isValid(serverid)) {
        return NextResponse.json({ error: 'Ungültige Server-ID' }, { status: 400 });
    }

    try {
        const currentUser = await User.findOne({ email: session.user.email });
        if (!currentUser) {
            return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 });
        }

        const server = await Server.findById(serverid);
        if (!server) {
            return NextResponse.json({ error: 'Server nicht gefunden' }, { status: 404 });
        }

        // Sicherheitscheck: Gehört dieser Server dem eingeloggten Benutzer?
        if (server.owner.toString() !== currentUser._id.toString()) {
            return NextResponse.json({ error: 'Keine Berechtigung zum Löschen dieses Servers' }, { status: 403 });
        }

        // Transaktionale Logik (optional, aber empfohlen für Produktionsumgebungen)
        // Hier in einer vereinfachten Form:

        // 1. Alle zugehörigen Module löschen
        await Module.deleteMany({ server: server._id });

        // 2. Den Server selbst löschen
        await Server.findByIdAndDelete(serverid);

        // 3. Die Referenz aus dem Benutzerdokument entfernen
        await User.updateOne(
            { _id: currentUser._id },
            { $pull: { servers: new Types.ObjectId(serverid) } }
        );

        return NextResponse.json({ message: 'Server erfolgreich gelöscht' }, { status: 200 });

    } catch (error) {
        console.error("Fehler beim Löschen des Servers:", error);
        return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
    }
}