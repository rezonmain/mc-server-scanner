import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import PropertyParser from '../../lib/classes/PropertyParser';
import { trpc } from '../../utils/trpc';
import Crash from '../Crash/Crash';
import ServerCard from '../ServerCard/ServerCard';
import Waiting from '../Waiting/Waiting';

type InfiniteQueries = 'mostRecent' | 'history' | 'search';

const InfiniteList = ({
	queryKey,
	input,
}: {
	queryKey: InfiniteQueries;
	input?: any;
}) => {
	const { data, isLoading, fetchNextPage, hasNextPage, isError, error } =
		trpc.useInfiniteQuery([queryKey, { ...input }], {
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		});

	if (isLoading) {
		return <Waiting key={1} amount={5} />;
	}

	if (isError) {
		console.log('loading');
		return <Crash message={error.message} />;
	}

	return (
		<InfiniteScroll
			loadMore={() => fetchNextPage()}
			hasMore={hasNextPage}
			loader={<Waiting key={2} amount={1} />}
		>
			<div>
				{data?.pages.map((group, i) => (
					<React.Fragment key={i}>
						{group.items.map((server) => {
							const p = new PropertyParser(server);
							const parsedServer = p.getParsedServer();
							return <ServerCard key={parsedServer.id} {...parsedServer} />;
						})}
					</React.Fragment>
				))}
				{!isLoading && !hasNextPage && <div>Nothing more to show</div>}
			</div>
		</InfiniteScroll>
	);
};
export default InfiniteList;
