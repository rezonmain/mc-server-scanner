import { trpc } from '../../utils/trpc';
import Waiting from '../Waiting/Waiting';

const ServerCount = () => {
	const { isLoading, data } = trpc.useQuery(['count']);
	return (
		<>
			<div>
				<span>Total entries: </span>
				{isLoading ? (
					<Waiting className='w-10 h-[1.2ch] bg-neutral-600' />
				) : (
					<span>{data?.totalCount.toLocaleString()}</span>
				)}
			</div>
			<div>
				<span>Unique servers: </span>
				{isLoading ? (
					<Waiting className='w-10 h-[1.2ch] bg-neutral-600' />
				) : (
					<span>{data?.uniqueCount.toLocaleString()}</span>
				)}
			</div>
		</>
	);
};

export default ServerCount;
