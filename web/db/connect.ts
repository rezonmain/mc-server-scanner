import mongoose from 'mongoose';

const URI = process.env.MONGO_URI as string;

const connect = async () => {
	const connection = await mongoose.connect(URI);
	return connection;
};

export default connect;
