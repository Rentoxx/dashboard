import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect'; // <-- Importieren Sie die neue Funktion
import User from '@/models/User';
import Server from '@/models/Server';
import Module from '@/models/Module';

export async function POST(request: Request) {
    try {
        await dbConnect(); // <-- Stellt die Verbindung sicher, bevor es weitergeht
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

        // Validierung bleibt gleich...
        if (!data.name || !data.provider || !data.panelUrl || !data.ipAddress || !data.apiUrl) {
            return NextResponse.json({ error: 'Fehlende Daten. Bitte alle Felder ausfüllen.' }, { status: 400 });
        }

        const currentUser = await User.findOne({ email: session.user.email });
        if (!currentUser) {
            return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 });
        }

        // Der Rest Ihrer Logik bleibt unverändert...
        const newServer = new Server({
            name: data.name,
            provider: data.provider,
            panelUrl: data.panelUrl,
            ipAddress: data.ipAddress,
            owner: currentUser._id,
        });

        const genericModule = new Module({
            server: newServer._id,
            type: 'GENERIC_METRICS',
            api_config: {
                endpoint: data.apiUrl,
            }
        });

        newServer.modules.push(genericModule._id);

        await newServer.save();
        await genericModule.save();

        currentUser.servers.push(newServer._id);
        await currentUser.save();

        return NextResponse.json(newServer, { status: 201 });

    } catch (error: any) {
        console.error("Fehler beim Erstellen des Servers:", error);
        if (error.name === 'ValidationError') {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: 'Interner Serverfehler beim Erstellen des Servers' }, { status: 500 });
    }
}

// ============== NEUE GET-FUNKTION ==============
export async function GET() {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    try {
        const currentUser = await User.findOne({ email: session.user.email });
        if (!currentUser) {
            return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 });
        }

        // Finde alle Server, deren 'owner'-Feld die ID des aktuellen Benutzers ist.
        // `.populate('modules')` kann später hinzugefügt werden, um Modul-Daten mitzuladen.
        const servers = await Server.find({ owner: currentUser._id });

        // Hier simulieren wir die Live-Daten für die Anzeige.
        // In einer echten Anwendung würden diese Daten aus einer Metrik-Quelle kommen.
        const serversWithStatus = servers.map(server => ({
            id: server._id.toString(),
            name: server.name,
            provider: server.provider,
            panelUrl: server.panelUrl,
            status: 'Online', // Platzhalter
            cpuUsage: Math.floor(Math.random() * 80) + 10, // Zufällige Demowerte
            ramUsage: Math.floor(Math.random() * 80) + 10,
            diskUsage: Math.floor(Math.random() * 80) + 10,
        }));

        return NextResponse.json(serversWithStatus, { status: 200 });

    } catch (error) {
        console.error("Fehler beim Abrufen der Server:", error);
        return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
    }
}