import React from 'react';
import PropertyParser from '../../lib/classes/PropertyParser';
import { trpc } from '../../utils/trpc';
import ServerCard from '../ServerCard/ServerCard';
import ServerCardSkeleton from '../ServerCardSkeleton/ServerCardSkeleton';

const ServerList = () => {
	const limit = 5;
	const {
		data,
		error,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
	} = trpc.useInfiniteQuery(['mostRecent', { limit }], {
		getNextPageParam: (lastPage) => lastPage.nextCursor,
	});

	if (isLoading) {
		return <ServerCardSkeleton amount={limit} />;
	}
	return (
		<>
			<ul>
				{data?.pages.map((group, i) => (
					<React.Fragment key={i}>
						{group.items.map((server) => {
							const p = new PropertyParser(server);
							const parsedServer = p.getParsedServer();
							return <ServerCard {...parsedServer} />;
						})}
					</React.Fragment>
				))}
			</ul>
			<div>
				<button
					onClick={() => fetchNextPage()}
					disabled={!hasNextPage || isFetching}
				>
					{isFetchingNextPage
						? 'Loading more..'
						: hasNextPage
						? 'Load More'
						: 'Nothing more to load'}
				</button>
				<div>
					{isFetching && !isFetchingNextPage ? (
						<ServerCardSkeleton amount={limit} />
					) : null}
				</div>
			</div>
		</>
	);
};
export default ServerList;
