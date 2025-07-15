import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import User from '@/models/User';
import Server from '@/models/Server';
import Module from '@/models/Module';

export async function POST(request: Request) {

    try {
        await clientPromise;
    } catch (error) {
        console.error("Datenbankverbindungsfehler:", error);
        return NextResponse.json({ error: 'Datenbankverbindung fehlgeschlagen' }, { status: 500 });
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    try {
        const data = await request.json();

        // Einfache Validierung
        if (!data.name || !data.provider || !data.panelUrl || !data.ipAddress) {
            return NextResponse.json({ error: 'Fehlende Daten' }, { status: 400 });
        }

        await clientPromise; // Stellt sicher, dass die DB-Verbindung aktiv ist

        // Finde den aktuellen Benutzer
        const currentUser = await User.findOne({ email: session.user.email });
        if (!currentUser) {
            return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 });
        }

        // Erstelle den neuen Server
        const newServer = new Server({
            name: data.name,
            provider: data.provider,
            panelUrl: data.panelUrl,
            owner: currentUser._id,
            // Später fügen wir hier noch IP-Adresse etc. hinzu
        });

        // Erstelle das generische Metrik-Modul, das jeder Server standardmäßig bekommt
        const genericModule = new Module({
            server: newServer._id,
            type: 'GENERIC_METRICS',
            api_config: {
                endpoint: data.apiUrl, // Die URL, die wir im Dialog eingegeben haben
            }
        });

        // Füge die Modul-ID zum Server hinzu
        newServer.modules.push(genericModule._id);

        // Speichere beide neuen Dokumente
        await newServer.save();
        await genericModule.save();

        // Füge die Server-ID zur Liste des Benutzers hinzu
        currentUser.servers.push(newServer._id);
        await currentUser.save();

        return NextResponse.json(newServer, { status: 201 });

    } catch (error) {
        console.error("Fehler beim Erstellen des Servers:", error);
        return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
    }
}