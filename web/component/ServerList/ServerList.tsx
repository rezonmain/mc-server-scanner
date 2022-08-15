import PropertyParser from '../../lib/classes/PropertyParser';
import { trpc } from '../../lib/trpc';
import ServerCard from '../ServerCard/ServerCard';

const ServerList = () => {
	const limit = 5;
	const { isLoading, data } = trpc.useQuery(['mostRecent', { limit }]);
	const cards =
		data &&
		data.map((server) => {
			const p = new PropertyParser(server);
			const parsedServer = p.getParsedServer();
			return <ServerCard {...parsedServer} />;
		});
	return <ol>{cards}</ol>;
};
export default ServerList;
