import type { NextPage } from 'next';
import Head from 'next/head';
import HomePage from '../components/HomePage/HomePage';

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>Minecraft Server Browser</title>
			</Head>
			<HomePage />
		</>
	);
};

export default Home;
