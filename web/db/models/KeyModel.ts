import mongoose from 'mongoose';
const { Schema } = mongoose;

export type Scope = 'blacklist.add' | 'blacklist.delete';

interface Key {
	_id: string;
	hashedKey: string;
	prefix: string;
	scopes: Scope[];
	createdAt: Date;
	updatedAt: Date;
}

const keySchema = new Schema<Key>(
	{
		hashedKey: String,
		prefix: { type: String, maxlength: 7 },
		scopes: [String],
	},
	{ timestamps: true }
);

const KeyModel =
	mongoose.models.KeyModel ||
	mongoose.model<Key>('KeyModel', keySchema, 'keys');
export default KeyModel;
