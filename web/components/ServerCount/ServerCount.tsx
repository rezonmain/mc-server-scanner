import { useEffect, useState } from 'react';
import { trpc } from '../../utils/trpc';

const ServerCount = () => {
	/* Locale strings trigger hydration errors when server and client,
	are in different locals, so all locale code should render only on client side 
	to avoid the mention errors.
	*/
	const { isLoading, data } = trpc.useQuery(['count'], {
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});
	const [rendered, setRendered] = useState(false);
	useEffect(() => {
		setRendered(true);
	}, []);
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
						{rendered && data?.totalCount.toLocaleString()}
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
						{rendered && data?.uniqueCount.toLocaleString()}
					</span>
				)}
			</div>
		</>
	);
};

export default ServerCount;
