import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import KeyModel, { AuthKey, Scope } from '../db/models/KeyModel';

// Utility function to generate and store an AuthKey
const generateAuthKey = async (scopes: Scope[], input?: string | undefined) => {
	const prefix = nanoid(7);
	const raw = input ?? nanoid(32);
	const hashedKey = await bcrypt.hash(raw, 10);
	const entry = new KeyModel<AuthKey>({
		hashedKey,
		prefix,
		scopes,
	});
	entry.save();
	const key = `${prefix}.${raw}`;
	console.log('Save it somewhere secure:', key);
	return key;
};

export default generateAuthKey;
