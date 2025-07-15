import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import User from '@/models/User';
import Server from '@/models/Server';
import Module from '@/models/Module';

export async function DELETE(request: Request, { params }: { params: { serverid: string } }) {
    try {
        await clientPromise;
    } catch (error) {
        console.error("Datenbankverbindungsfehler:", error);
        return NextResponse.json({ error: 'Datenbankverbindung fehlgeschlagen' }, { status: 500 });
    }

    const session = await getServerSession(authOptions);
    const { serverid } = params;

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    try {
        await clientPromise;

        const server = await Server.findById(serverid);
        if (!server) {
            return NextResponse.json({ error: 'Server nicht gefunden' }, { status: 404 });
        }

        const currentUser = await User.findOne({ email: session.user.email });
        // Sicherheitscheck: Gehört dieser Server dem eingeloggten Benutzer?
        if (server.owner.toString() !== currentUser?._id.toString()) {
            return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 });
        }

        // 1. Alle zugehörigen Module löschen
        await Module.deleteMany({ server: serverid });

        // 2. Den Server selbst löschen
        await Server.findByIdAndDelete(serverid);

        // 3. Die Referenz vom Benutzer entfernen
        await User.updateOne(
            { _id: currentUser._id },
            { $pull: { servers: serverid } }
        );

        return NextResponse.json({ message: 'Server erfolgreich gelöscht' }, { status: 200 });

    } catch (error) {
        console.error("Fehler beim Löschen des Servers:", error);
        return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
    }
}