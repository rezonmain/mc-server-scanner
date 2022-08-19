import InfiniteList from '../InfiniteList/InfiniteList';
import { SearchQuery } from '../SearchPage/SearchPage';

const SearchList = ({ query }: { query: SearchQuery }) => {
	const input = {
		ip: query.ip,
		playerName: query.playerName ?? '.*',
		descr: query.description ?? '.*',
	};

	return (
		<>
			<InfiniteList queryKey='search' input={input}></InfiniteList>
		</>
	);
};
export default SearchList;
