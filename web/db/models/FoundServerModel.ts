import mongoose from 'mongoose';
import { RawServer } from '../../lib/types';
const { Schema } = mongoose;

// Using existing database no need to define schema
const serverSchema = new Schema<RawServer>({});

const FoundServerModel =
	mongoose.models.FoundServerModel ||
	mongoose.model<RawServer>('FoundServerModel', serverSchema, 'servers');
export default FoundServerModel;
