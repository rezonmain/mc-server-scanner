import InfiniteList from '../InfiniteList/InfiniteList';
import { SearchQuery } from '../SearchPage/SearchPage';

const SearchList = ({ query }: { query: SearchQuery | undefined }) => {
	const input = {
		ip: query ? query.ip : undefined,
		keyword: query ? query.keyword : undefined,
	};

	return (
		<>
			{
				<span className='block mb-4'>
					Showing results for <em>{input.ip ? input.ip : input.keyword}</em>
				</span>
			}
			<InfiniteList queryKey='search' input={input}></InfiniteList>
		</>
	);
};
export default SearchList;
