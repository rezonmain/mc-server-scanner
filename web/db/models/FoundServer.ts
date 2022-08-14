import mongoose, { Schema } from 'mongoose';

interface FoundServer {
	ip: string;
	foundAt: Date;
	players: { max: number; online: number };
	favicon?: string;
}

const serverSchema = new Schema<FoundServer>({
	ip: { type: String, required: true },
	foundAt: { type: Date, required: true },
	players: {
		max: { type: Number, required: false },
		online: { type: Number, required: false },
		required: false,
	},
	favicon: { type: String, required: false },
});

const FoundServer = mongoose.model<FoundServer>('FoundServer', serverSchema);
export default FoundServer;
