import mongoose from 'mongoose';
import { RawServer } from '../../lib/types';
const { Schema } = mongoose;

// Include types that are used in queries, otherwise the find query fails
const serverSchema = new Schema<RawServer>({
	ip: String,
	foundAt: Number,
	foundBy: String,
	description: Schema.Types.Mixed,
	players: {
		max: Number,
		online: Number,
		sample: { type: [{ name: String, id: String }], required: false },
	},
	version: { name: String, protocol: Number },
	ping: Number,
	favicon: { type: String, required: false },
	enforcesSecureChat: { type: Boolean, required: false },
	previewsChat: { type: Boolean, required: false },
	modinfo: { type: Schema.Types.Mixed, requires: false },
	forgeData: { type: Schema.Types.Mixed, requires: false },
});

const FoundServerModel =
	mongoose.models.FoundServerModel ||
	mongoose.model<RawServer>('FoundServerModel', serverSchema, 'servers');
export default FoundServerModel;
