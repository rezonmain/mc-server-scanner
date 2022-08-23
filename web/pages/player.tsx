import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import PlayerPage from '../components/PlayerPage/PlayerPage';

const Player: NextPage = () => {
	const { query } = useRouter();
	return <PlayerPage query={query} />;
};

export default Player;
