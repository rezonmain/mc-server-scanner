import type { NextPage } from 'next';
import SearchList from '../components/SearchList/SearchList';

const Search: NextPage = () => {
	return (
		<div className='p-4 max-w-[750px] mx-auto'>
			<SearchList />
		</div>
	);
};

export default Search;
