import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PlayerPage from '../components/PlayerPage/PlayerPage';

const Player: NextPage = () => {
	const { query } = useRouter();
	return (
		<>
			<Head>
				<title>Server Browser | Player result</title>
			</Head>
			<PlayerPage query={query} />
		</>
	);
};

export default Player;
