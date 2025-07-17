import { Schema, model, models, Document } from 'mongoose';

export interface IApiConfig {
    endpoint: string;
    apiKey?: string;
}

export interface IModule extends Document {
    _id: string;
    server: Schema.Types.ObjectId;
    type: 'MINECRAFT_JAVA' | 'WEB_SERVER' | 'TAILSCALE' | 'ADGUARD_HOME' | 'GENERIC_METRICS';
    api_config?: IApiConfig;
    cached_data?: Record<string, string | number | boolean | null | undefined>;
    last_updated?: Date;
}

const ModuleSchema = new Schema<IModule>({
    server: { type: Schema.Types.ObjectId, ref: 'Server', required: true },
    type: {
        type: String,
        enum: ['MINECRAFT_JAVA', 'WEB_SERVER', 'TAILSCALE', 'ADGUARD_HOME', 'GENERIC_METRICS'],
        required: true
    },
    api_config: { type: Object },
    cached_data: { type: Object },
    last_updated: { type: Date }
});

const Module = models.Module || model<IModule>('Module', ModuleSchema);

export default Module;