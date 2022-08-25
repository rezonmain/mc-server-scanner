import { z } from 'zod';
import SearchList from '../SearchList/SearchList';
import { BiArrowBack } from 'react-icons/bi';
import { useRouter } from 'next/router';
import Crash from '../Crash/Crash';
import { IP_REGEX } from '../../utils/regex';

export type SearchQuery = {
	ip?: string | undefined | null;
	keyword?: string | undefined | null;
	uuid?: string | undefined | null;
};

const SearchPage = ({ query }: { query: SearchQuery }) => {
	const router = useRouter();
	let validIp = true;

	if (Object.keys(query).length <= 0) {
		return <Crash message='No search query was given' />;
	}

	const searchSchema = z.object({
		ip: z.string().regex(IP_REGEX).optional(),
		keyword: z.string().trim().nullish(),
	});

	let res;
	try {
		res = searchSchema.parse(query);
	} catch {
		validIp = false;
	}

	return (
		<div className='p-4 md:max-w-[750px] xl:max-w-[990px] mx-auto'>
			<div
				onClick={() => router.back()}
				className='cursor-pointer w-fit h-fit mb-4 p-1 rounded-full hover:bg-neutral-700 transition-colors'
			>
				<BiArrowBack size={28} />
			</div>
			{validIp && query ? (
				<SearchList query={res} />
			) : (
				<span>{query.ip} is not a valid IP address</span>
			)}
		</div>
	);
};

export default SearchPage;
