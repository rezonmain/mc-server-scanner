import { ParsedServer } from '../../lib/types';
import ServerFavicon from '../ServerFavicon/ServerFavicon';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import { useRouter } from 'next/router';

const ServerCard = ({
	favicon,
	hasCustomFavicon,
	ip,
	description,
	version,
	foundAt,
	ping,
	players,
}: ParsedServer) => {
	const router = useRouter();
	const handleIPClick = () =>
		router.push({ pathname: '/search', query: { ip } });
	const handleCopyClick = () => navigator.clipboard.writeText(ip);

	return (
		<ul className='py-7 bg-neutral-800 p-4 my-4 break-words rounded-md'>
			<li>
				<ServerFavicon favicon={favicon} hasCustomFavicon={hasCustomFavicon} />
			</li>
			<li className='flex flex-row items-center gap-2'>
				<span className='text-neutral-400'>IP: </span>
				<span
					onClick={() => handleIPClick()}
					className='underline cursor-pointer active:no-underline'
				>
					{ip}
				</span>
				<HiOutlinePencilAlt
					onClick={() => handleCopyClick()}
					title='Copy ip address to clipboard'
					size={21}
					className='inline-block cursor-pointer active:scale-110 transition-transform'
				/>
			</li>
			<li>
				<span className='text-neutral-400'>Description: </span>
				{description}
			</li>
			<li>
				<span className='text-neutral-400'>Version: </span>
				{version}
			</li>
			<li>
				<span className='text-neutral-400'>Found at: </span>
				{foundAt}
			</li>
			<li>
				<span className='text-neutral-400'>Ping: </span>
				{ping}
			</li>
			<li>
				<span className='text-neutral-400'>Players: </span>
				{players.online} / {players.max}
			</li>
		</ul>
	);
};

export default ServerCard;
