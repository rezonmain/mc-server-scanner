import mongoose from 'mongoose';

class DB {
	/* In development use the test database
	in production use the scanner_db database */
	static URI =
		process.env.NODE_ENV === 'production'
			? (process.env.MONGO_URI as string)
			: process.env.NODE_ENV === 'development'
			? (process.env.MONGO_URI_TEST as string)
			: '';

	constructor() {
		if (DB.URI !== '') {
			console.log('got it');
		}
	}

	connect = async () => {
		mongoose.connect(DB.URI);
		return mongoose.connection;
	};
}

export default DB;
