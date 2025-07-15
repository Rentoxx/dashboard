import { Schema, model, models, Document } from 'mongoose';

export interface IBackupConfig {
    targetPath: string;
    driveFolderId: string;
}

export interface IServer extends Document {
    _id: string;
    name: string;
    provider: string;
    panelUrl: string;
    owner: Schema.Types.ObjectId;
    modules: Schema.Types.ObjectId[];
    backup_config?: IBackupConfig;
}

const ServerSchema = new Schema<IServer>({
    name: { type: String, required: true },
    provider: { type: String, required: true },
    panelUrl: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    modules: [{ type: Schema.Types.ObjectId, ref: 'Module' }],
    backup_config: { type: Object }
});

const Server = models.Server || model<IServer>('Server', ServerSchema);

export default Server;