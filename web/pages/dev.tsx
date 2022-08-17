import type { NextPage } from 'next';
import React, { useState } from 'react';
import SearchForm from '../components/SearchForm/SearchForm';
import ServerCard from '../components/ServerCard/ServerCard';
import PropertyParser from '../lib/classes/PropertyParser';
import { AllowedUserQuery } from '../lib/types';
import { trpc } from '../utils/trpc';

const Dev: NextPage = () => {
	const [query, setQuery] = useState<{ type: AllowedUserQuery; input: object }>(
		{
			type: 'mostRecent',
			input: {},
		}
	);

	const { data } = trpc.useQuery([query.type, { ...query.input }]);

	const handleSubmit = (query: AllowedUserQuery, input: object) => {
		setQuery({
			type: query,
			input,
		});
	};

	const el = data?.items.map((server) => {
		const p = new PropertyParser(server);
		const parsed = p.getParsedServer();
		return <ServerCard key={server._id} {...parsed} />;
	});

	return (
		<>
			<SearchForm handleSubmit={handleSubmit} />
			<ul>{el}</ul>
		</>
	);
};

export default Dev;
