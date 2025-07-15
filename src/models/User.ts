import { Schema, model, models, Document } from 'mongoose';

// 1. TypeScript-Interface definieren, das die Struktur eines User-Dokuments beschreibt
export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    image: string;
    servers: Schema.Types.ObjectId[]; // Ein Array von Referenzen zum Server-Modell
}

// 2. Mongoose-Schema erstellen, das die Regeln für die Datenbank festlegt
const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    servers: [{ type: Schema.Types.ObjectId, ref: 'Server' }] // Referenz zum 'Server'-Modell
});

// 3. Modell exportieren.
// Es wird geprüft, ob das Modell schon existiert, um Fehler bei Hot-Reloads zu vermeiden.
const User = models.User || model<IUser>('User', UserSchema);

export default User;