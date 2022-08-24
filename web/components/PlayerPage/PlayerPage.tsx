import { useRouter } from 'next/router';
import { BiArrowBack } from 'react-icons/bi';
import { z } from 'zod';
import { trpc } from '../../utils/trpc';
import PlayerCard from '../PlayerCard/PlayerCard';
import Waiting from '../Waiting/Waiting';

const PlayerPage = ({ query }: { query: { uuid?: string } }) => {
	const uuidSchema = z.string();
	let uuid = uuidSchema.parse(query.uuid);
	if (uuid[8] !== '-') {
		uuid =
			uuid.slice(0, 8) +
			'-' +
			uuid.slice(8, 12) +
			'-' +
			uuid.slice(12, 16) +
			'-' +
			uuid.slice(16, 20) +
			'-' +
			uuid.slice(20, uuid.length);
	}
	const { data, isLoading, isFetched } = trpc.useQuery(['player', { uuid }]);
	let inDatabase = true;
	let notFound = false;
	if (data?.player.name === undefined) {
		inDatabase = false;
	}

	const router = useRouter();
	return (
		<div className='p-4 md:max-w-[750px] xl:max-w-[990px] mx-auto'>
			<div
				onClick={() => router.back()}
				className='cursor-pointer w-fit h-fit mb-4 p-1 rounded-full hover:bg-neutral-700 transition-colors'
			>
				<BiArrowBack size={28} />
			</div>
			{isFetched && !inDatabase && (
				<span className='block mb-4'>
					Player not found in scanned entries. <br></br>Showing results from
					Mojang.
				</span>
			)}
			{isLoading ? (
				<Waiting amount={1} />
			) : (
				data && <PlayerCard {...data.player} />
			)}
		</div>
	);
};

export default PlayerPage;
