import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import User from '@/models/User';
import Server from '@/models/Server';
import Module from '@/models/Module';
import { Types } from 'mongoose';
import dbConnect from "@/lib/dbConnect";

// The function signature is adjusted here using `any` as a workaround
export async function DELETE(
    request: Request,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: any
) {
    // We still destructure params inside for clean code
    const { serverid } = context.params;

    try {
        await dbConnect();
    } catch (error) {
        console.error("Datenbankverbindungsfehler:", error);
        return NextResponse.json({ error: 'Datenbankverbindung fehlgeschlagen' }, { status: 500 });
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

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

        if (server.owner.toString() !== currentUser._id.toString()) {
            return NextResponse.json({ error: 'Keine Berechtigung zum Löschen dieses Servers' }, { status: 403 });
        }

        await Module.deleteMany({ server: server._id });
        await Server.findByIdAndDelete(serverid);
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