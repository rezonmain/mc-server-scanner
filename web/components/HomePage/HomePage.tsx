import { useState } from 'react';
import { AllowedUserQuery } from '../../lib/types';
import ScrollTop from '../ScrollTop/ScrollTop';
import SearchForm from '../SearchForm/SearchForm';
import ServerCount from '../ServerCount/ServerCount';
import ListByMostRecent from '../ListByMostRecent/ListByMostRecent';
import ListByIp from '../ListByIp/ListByIp';

const HomePage = () => {
	const [query, setQuery] = useState<{
		type: AllowedUserQuery;
		input: object;
		validationError: boolean | string;
	}>({
		type: 'mostRecent',
		input: {},
		validationError: false,
	});

	const handleSubmit = (
		query: AllowedUserQuery,
		input: object,
		validationError: boolean | string
	) => {
		setQuery({
			type: query,
			input,
			validationError,
		});
	};

	return (
		<div className='p-4 max-w-[750px] mx-auto'>
			<ServerCount />
			<SearchForm handleSubmit={handleSubmit} />
			<ScrollTop />
			{query.validationError ? (
				<span className=' text-red-500'>{query.validationError}</span>
			) : query.type === 'mostRecent' ? (
				<ListByMostRecent />
			) : query.type === 'findByIp' ? (
				<ListByIp
					{...(query as {
						type: AllowedUserQuery;
						input: { ip: string };
						validationError: boolean | string;
					})}
				/>
			) : null}
		</div>
	);
};

export default HomePage;
