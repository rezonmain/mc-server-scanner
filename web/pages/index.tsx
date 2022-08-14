import type { NextPage } from 'next';
import { trpc } from '../lib/trpc';

const Home: NextPage = () => {
	const { isLoading, data } = trpc.useQuery(['mostRecent', { limit: 18 }]);
	const el =
		data &&
		data.map((server, i) => (
			<p key={server._id}>
				{++i}: {server.ip}
			</p>
		));

	if (isLoading) {
		return (
			<div>
				<h1>Fetching data...</h1>
			</div>
		);
	}

	return <div>{el}</div>;
};

export default Home;
