import type { NextPage } from 'next';
import PropertyParser from '../lib/classes/PropertyParser';
import { trpc } from '../lib/trpc';

const Home: NextPage = () => {
	const { isLoading, data } = trpc.useQuery(['mostRecent', { limit: 20 }]);
	let el = data?.map((server) => {
		const parser = new PropertyParser(server);
		const desc = parser.getDescriptionElement();
		const date = parser.parseTs();
		return (
			<ul key={server._id} className='py-7'>
				<li>
					<span className='text-neutral-400'>ip: </span>
					{server.ip}
				</li>
				<li>
					<span className='text-neutral-400'>Description: </span> {desc}
				</li>
				<li>
					<span className='text-neutral-400'>Found at: </span>
					{date}
				</li>
				<li>
					<span className='text-neutral-400'>Ping: </span>
					{server.ping}
				</li>
				<li>
					<span className='text-neutral-400'>Players: </span>
					{server.players.online} / {server.players.max}
				</li>
			</ul>
		);
	});

	if (isLoading) {
		return <h1 className=''>Fetching data...</h1>;
	}
	return <ol className='list-decimal px-7'>{el}</ol>;
};

export default Home;
