import type { NextPage } from 'next';
import { trpc } from '../lib/trpc';

const Home: NextPage = () => {
	const { isLoading, data } = trpc.useQuery([
		'findOne',
		{ ip: '142.44.142.183' },
	]);
	if (isLoading) {
		return <h1 className=''>Fetching data...</h1>;
	}
	return (
		<ol className='list-decimal px-7'>
			<li>{data?.ip}</li>
		</ol>
	);
};

export default Home;
