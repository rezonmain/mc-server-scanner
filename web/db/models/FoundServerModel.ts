import mongoose from 'mongoose';
import { MongoDocument } from '../../lib/types';
const { Schema } = mongoose;

export interface FoundServer extends MongoDocument {
	ip: string;
	foundAt: Date;
	players: { max: number; online: number };
	favicon?: string;
}

const serverSchema = new Schema<FoundServer>({});

const FoundServerModel =
	mongoose.models.FoundServerModel ||
	mongoose.model<FoundServer>('FoundServerModel', serverSchema, 'servers');
export default FoundServerModel;
