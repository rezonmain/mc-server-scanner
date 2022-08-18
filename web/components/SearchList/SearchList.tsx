import InfiniteList from '../InfiniteList/InfiniteList';

const SearchList = () => {
	const input = {
		term: 'live',
	};

	return (
		<>
			<span>Showing results for {input.term}</span>
			<InfiniteList queryKey='search' input={input}></InfiniteList>
		</>
	);
};
export default SearchList;
