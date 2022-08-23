import type { NextPage } from 'next';
import { trpc } from '../utils/trpc';

const Dev: NextPage = () => {
	const { data } = trpc.useQuery([
		'player',
		{ uuid: '5f8eb73b-25be-4c5a-a50f-d27d65e30ca0' },
	]);
	return (
		<>
			<span>{JSON.stringify(data)}</span>
		</>
	);
};

export default Dev;
