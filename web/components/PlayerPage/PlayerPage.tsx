import { useRouter } from 'next/router';
import { BiArrowBack } from 'react-icons/bi';
import { z } from 'zod';
import { trpc } from '../../utils/trpc';
import PlayerCard from '../PlayerCard/PlayerCard';
import Waiting from '../Waiting/Waiting';

const PlayerPage = ({ query }: { query: { uuid?: string } }) => {
	const uuidSchema = z.string();
	const uuid = uuidSchema.parse(query.uuid);
	const { data, isLoading } = trpc.useQuery(['player', { uuid }]);
	const router = useRouter();
	return (
		<div className='p-4 md:max-w-[750px] xl:max-w-[990px] mx-auto'>
			<div
				onClick={() => router.back()}
				className='cursor-pointer w-fit h-fit mb-4 p-1 rounded-full hover:bg-neutral-700 transition-colors'
			>
				<BiArrowBack size={28} />
			</div>
			{isLoading ? (
				<Waiting amount={1} />
			) : (
				data && <PlayerCard {...data.player} />
			)}
		</div>
	);
};

export default PlayerPage;
