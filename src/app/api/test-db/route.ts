// src/app/api/test-db/route.ts

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
    try {
        const client = await clientPromise;
        // Pingt die Datenbank, um zu bestätigen, dass eine Verbindung besteht
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        return NextResponse.json({ status: 200, message: "Successfully connected to MongoDB!" });

    } catch (e) {
        console.error(e);
        // Stellt sicher, dass die Antwort auch im Fehlerfall ein gültiges JSON ist
        return NextResponse.json({ status: 500, error: "Failed to connect to MongoDB" }, { status: 500 });
    }
}