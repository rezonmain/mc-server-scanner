import mongoose from 'mongoose';
const { Schema } = mongoose;

export type Scope = 'blacklist.add' | 'blacklist.delete';

export interface AuthKey {
	_id?: string;
	hashedKey: string;
	prefix: string;
	scopes: Scope[];
	createdAt?: Date;
	updatedAt?: Date;
}

const keySchema = new Schema<AuthKey>(
	{
		hashedKey: String,
		prefix: { type: String, maxlength: 7 },
		scopes: [String],
	},
	{ timestamps: true }
);

const KeyModel =
	mongoose.models.KeyModel ||
	mongoose.model<AuthKey>('KeyModel', keySchema, 'keys');
export default KeyModel;
