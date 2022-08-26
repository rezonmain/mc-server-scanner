import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface Blacklist {
	_id?: string;
	ip: string;
	message: string;
	author: string;
	createdAt?: Date;
	updatedAt?: Date;
}

const blacklistSchema = new Schema<Blacklist>(
	{
		ip: String,
		message: String,
		author: { type: String, maxlength: 7 },
	},
	{ timestamps: true }
);

const BlacklistModel =
	mongoose.models.BlacklistModel ||
	mongoose.model<Blacklist>('BlacklistModel', blacklistSchema, 'blacklist');
export default BlacklistModel;
