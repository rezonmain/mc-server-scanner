import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import PropertyParser from '../../lib/classes/PropertyParser';
import { trpc } from '../../utils/trpc';
import Crash from '../Crash/Crash';
import NewEntriesButton from '../NewEntriesButton/NewEntriesButton';
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
	const {
		data,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isError,
		error,
		refetch,
		isFetching,
	} = trpc.useInfiniteQuery([queryKey, { ...input }], {
		getNextPageParam: (lastPage) => lastPage.nextCursor,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});

	const mostRecentTs = data?.pages[0].items[0]
		? data?.pages[0].items[0].foundAt
		: undefined;
	const { data: newData } = trpc.useQuery(
		['countNewData', { cursor: mostRecentTs }],
		{
			refetchInterval: 1000 * 30,
			refetchOnMount: false,
		}
	);

	if (isLoading) {
		return <Waiting key={1} amount={6} />;
	}

	if (isError) {
		return <Crash message={error.message} />;
	}

	if (!data?.pages[0].items[0]) {
		return <span className='block'>No results found</span>;
	}

	return (
		<section id='infinite-list' className='flex flex-col gap-4'>
			{queryKey === 'mostRecent' && newData && (
				<NewEntriesButton
					count={newData.count}
					onClick={() => refetch()}
					isFetching={isFetching}
				/>
			)}
			<InfiniteScroll
				loadMore={() => fetchNextPage()}
				hasMore={hasNextPage}
				loader={<Waiting key={2} amount={2} />}
			>
				<div className='flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-4'>
					{data?.pages.map((group, i) => (
						<React.Fragment key={i}>
							{group.items.map((server, i) => {
								const p = new PropertyParser(server);
								const parsedServer = p.getParsedServer();
								return <ServerCard key={parsedServer.id} {...parsedServer} />;
							})}
						</React.Fragment>
					))}
				</div>
			</InfiniteScroll>
			{!isLoading && !hasNextPage && <div>Nothing more to show</div>}
		</section>
	);
};
export default InfiniteList;
