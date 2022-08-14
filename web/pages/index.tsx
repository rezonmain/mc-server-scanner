import type { NextPage } from 'next';
import { trpc } from '../lib/trpc';

const Home: NextPage = () => {
	const servers = trpc.useQuery(['mostRecent', { limit: 10 }]);
	const el = servers.data?.map((server) => <p key={server._id}>{server.ip}</p>);
	return <div>{el}</div>;
};

export default Home;
