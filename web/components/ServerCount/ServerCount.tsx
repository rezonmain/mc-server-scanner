import { trpc } from '../../utils/trpc';
import Waiting from '../Waiting/Waiting';

const ServerCount = () => {
	const { isLoading, data } = trpc.useQuery(['count']);
	return (
		<>
			<div>
				<span>Total entries: </span>
				{isLoading ? (
					<span>...</span>
				) : (
					<span>{data?.totalCount.toLocaleString()}</span>
				)}
			</div>
			<div>
				<span>Unique servers: </span>
				{isLoading ? (
					<span>...</span>
				) : (
					<span>{data?.uniqueCount.toLocaleString()}</span>
				)}
			</div>
		</>
	);
};

export default ServerCount;
