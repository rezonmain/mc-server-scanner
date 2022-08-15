import mongoose from 'mongoose';
import { RawServer } from '../../lib/types';
const { Schema } = mongoose;

// Include types that are used in queries, otherwise the find query fails
const serverSchema = new Schema<RawServer>({
	ip: String,
});

const FoundServerModel =
	mongoose.models.FoundServerModel ||
	mongoose.model<RawServer>('FoundServerModel', serverSchema, 'servers');
export default FoundServerModel;
