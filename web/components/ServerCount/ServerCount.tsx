import { trpc } from '../../utils/trpc';
import Waiting from '../Waiting/Waiting';

const ServerCount = () => {
	const { isLoading, data } = trpc.useQuery(['count']);
	return (
		<>
			<div>
				<span className='font-semibold'>
					Total: <br></br>{' '}
				</span>
				{isLoading ? (
					<span className='text-neutral-300'>...</span>
				) : (
					<span className='text-neutral-300'>
						{data?.totalCount.toLocaleString()}
					</span>
				)}
			</div>
			<div>
				<span className='font-semibold'>
					Unique: <br></br>
				</span>
				{isLoading ? (
					<span className='text-neutral-300'>...</span>
				) : (
					<span className='text-neutral-300'>
						{data?.uniqueCount.toLocaleString()}
					</span>
				)}
			</div>
		</>
	);
};

export default ServerCount;
