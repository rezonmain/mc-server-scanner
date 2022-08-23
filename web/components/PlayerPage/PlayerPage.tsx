import { z } from 'zod';
import { trpc } from '../../utils/trpc';
import PlayerCard from '../PlayerCard/PlayerCard';

const PlayerPage = ({ query }: { query: { uuid?: string } }) => {
	const uuidSchema = z.string();
	const uuid = uuidSchema.parse(query.uuid);
	const { data } = trpc.useQuery(['player', { uuid }]);
	return <>{data && <PlayerCard {...data.player} />}</>;
};

export default PlayerPage;
