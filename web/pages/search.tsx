import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import SearchPage from '../components/SearchPage/SearchPage';

const Search: NextPage = () => {
	const { query } = useRouter();
	return (
		<>
			<Head>
				<title>Server Browser | Search result</title>
			</Head>
			<SearchPage query={query} />
		</>
	);
};

export default Search;
