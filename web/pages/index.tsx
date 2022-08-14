import type { NextPage } from 'next';
import { trpc } from '../lib/trpc';

const Home: NextPage = () => {
	const hello = trpc.useQuery(['greet', { text: '' }]);
	return (
		<div className='bg-neutral-800'>
			<h1 className='text-2xl text-white'>{hello.data?.greeting}</h1>
		</div>
	);
};

export default Home;
