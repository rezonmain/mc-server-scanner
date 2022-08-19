import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import SearchPage from '../components/SearchPage/SearchPage';

const Search: NextPage = () => {
	const { query } = useRouter();
	return <SearchPage query={query} />;
};

export default Search;
