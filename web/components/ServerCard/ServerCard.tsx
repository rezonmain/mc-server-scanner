import { ParsedServer } from '../../lib/types';
import ServerFavicon from '../ServerFavicon/ServerFavicon';

const ServerCard = ({
	id,
	favicon,
	hasCustomFavicon,
	ip,
	description,
	rawDescription,
	version,
	foundAt,
	ping,
	players,
}: ParsedServer) => {
	return (
		<ul className='py-7 bg-neutral-800 p-4 my-4 break-words max-w-[750px] mx-auto'>
			<li>
				<ServerFavicon favicon={favicon} hasCustomFavicon={hasCustomFavicon} />
			</li>
			<li>
				<span className='text-neutral-400'>IP: </span>
				{id}
			</li>
			<li>
				<span className='text-neutral-400'>IP: </span>
				{ip}
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
