import { trpc } from '../../utils/trpc';
import Waiting from '../Waiting/Waiting';

const ServerCount = () => {
	const { isLoading, data } = trpc.useQuery(['count'], {
		refetchInterval: 1000 * 1,
	});
	return (
		<div>
			<span>Total servers: </span>
			{isLoading ? (
				<Waiting className='w-10 h-[1.2ch] bg-neutral-600' />
			) : (
				<span>{data?.toLocaleString()}</span>
			)}
		</div>
	);
};

export default ServerCount;
