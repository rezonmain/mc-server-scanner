import type { NextPage } from 'next';
import ServerCard from '../components/ServerCard/ServerCard';
import PropertyParser from '../lib/classes/PropertyParser';
import { trpc } from '../utils/trpc';

const Dev: NextPage = () => {
	const { data } = trpc.useQuery(['search', { term: 'live' }]);

	const el = data?.items.map((server) => {
		const p = new PropertyParser(server);
		const parsed = p.getParsedServer();
		return <ServerCard key={server._id} {...parsed} />;
	});

	return <ul>{el}</ul>;
};

export default Dev;

// general search:

//FriendlyWale
