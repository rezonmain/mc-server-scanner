import type { NextPage } from 'next';
import { trpc } from '../lib/trpc';

const Home: NextPage = () => {
	return (
		<div className='bg-neutral-800'>
			<h1 className='text-2xl text-white'>{}</h1>
		</div>
	);
};

export default Home;
