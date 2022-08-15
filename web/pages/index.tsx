import type { NextPage } from 'next';
import PropertyParser from '../lib/classes/PropertyParser';
import { trpc } from '../lib/trpc';

const Home: NextPage = () => {
	const { isLoading, data } = trpc.useQuery(['mostRecent', { limit: 5 }]);
	let el = data?.map((server) => {
		const parser = new PropertyParser(server);
		const parsed = parser.getParsedServer();
		return (
			<ul key={server._id} className='py-7 bg-neutral-800 p-4 m-4'>
				<li>
					<img className=' rounded-full' src={parsed.favicon}></img>
				</li>
				<li>
					<span className='text-neutral-400'>ip: </span>
					{parsed.ip}
				</li>
				<li>
					<span className='text-neutral-400'>Description: </span>
					{parsed.description}
				</li>
				<li>
					<span className='text-neutral-400'>Version: </span>
					{parsed.version}
				</li>
				<li>
					<span className='text-neutral-400'>Found at: </span>
					{parsed.foundAt}
				</li>
				<li>
					<span className='text-neutral-400'>Ping: </span>
					{parsed.ping}
				</li>
				<li>
					<span className='text-neutral-400'>Players: </span>
					{parsed.players.online} / {parsed.players.max}
				</li>
			</ul>
		);
	});

	if (isLoading) {
		return <h1 className=''>Fetching data...</h1>;
	}
	return (
		<div className='w-[80vw] mx-auto bg-black'>
			<ol className='list-decimal px-7'>{el}</ol>
		</div>
	);
};

export default Home;
