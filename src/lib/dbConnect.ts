import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error(
        'Bitte definieren Sie die MONGODB_URI Umgebungsvariable in .env.local'
    );
}

// Hier wird der 'global' Typ explizit erweitert, um den Fehler zu beheben.
const globalWithMongoose = global as typeof globalThis & {
    mongoose: {
        promise: Promise<Mongoose> | null;
        conn: Mongoose | null;
    };
};

let cached = globalWithMongoose.mongoose;

if (!cached) {
    cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;