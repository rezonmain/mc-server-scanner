import PropertyParser from '../../lib/classes/PropertyParser';
import { AllowedUserQuery } from '../../lib/types';
import { trpc } from '../../utils/trpc';
import ServerCard from '../ServerCard/ServerCard';
import Waiting from '../Waiting/Waiting';

const ListByIp = ({
	type,
	input,
	validationError,
}: {
	type: AllowedUserQuery;
	input: { ip: string };
	validationError: boolean | string;
}) => {
	const { data, isLoading, isError, error } = trpc.useQuery([
		type,
		{ ...input },
	]);

	if (isLoading) {
		return <Waiting className='w-10 h-5 bg-neutral-600' />;
	}

	// Something went wrong server side
	if (isError) {
		return <span>{error.data?.code}</span>;
	}

	// No results with given input
	if (data?.items && data.items.length <= 0) {
		return <span>No results found for: &apos;{input.ip}&apos;</span>;
	}

	const el = data?.items.map((server) => {
		const p = new PropertyParser(server);
		const parsed = p.getParsedServer();
		return <ServerCard key={server._id} {...parsed} />;
	});

	return (
		<>
			<span>Showing results for &apos;{input.ip}&apos;</span>
			<ul>{el}</ul>
		</>
	);
};

export default ListByIp;
