import type { NextPage } from 'next';
import Head from 'next/head';
import BlacklistPage from '../components/BlacklistPage/BlacklistPage';

const Blacklist: NextPage = () => {
	return (
		<>
			<Head>
				<title>Server Browser | Blacklist an IP</title>
			</Head>
			<BlacklistPage />
		</>
	);
};

export default Blacklist;
