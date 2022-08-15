import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import PropertyParser from '../../lib/classes/PropertyParser';
import { trpc } from '../../utils/trpc';
import ServerCard from '../ServerCard/ServerCard';
import ServerCardSkeleton from '../ServerCardSkeleton/ServerCardSkeleton';

const ServerList = () => {
	// FIX: Doesn't show every entry, probably something to do with cursor in the query definition
	const limit = 5;
	const { data, isLoading, fetchNextPage, hasNextPage } = trpc.useInfiniteQuery(
		['mostRecent', { limit }],
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		}
	);
	return (
		<InfiniteScroll
			loadMore={() => fetchNextPage()}
			hasMore={hasNextPage}
			loader={<ServerCardSkeleton amount={limit} />}
		>
			<div>
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
				{!isLoading && !hasNextPage && <div>Nothing more to show</div>}
			</div>
		</InfiniteScroll>
	);
};
export default ServerList;
