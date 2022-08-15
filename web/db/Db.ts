import mongoose from 'mongoose';

class DB {
	/* In development use the test database
	in production use the scanner_db database */
	static URI =
		process.env.NODE_ENV === 'development' || 'preview'
			? (process.env.MONGO_URI_TEST as string)
			: (process.env.MONOG_URI as string);

	constructor() {
		console.log(DB.URI);
	}

	connect = async () => {
		mongoose.connect(DB.URI);
		console.log('CONNECTED!');
		return mongoose.connection;
	};
}

export default DB;
