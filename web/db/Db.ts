import mongoose from 'mongoose';

class DB {
	static URI = process.env.MONGO_URI as string;

	constructor() {}

	connect = async () => {
		mongoose.connect(DB.URI);
		return mongoose.connection;
	};
}

export default DB;
