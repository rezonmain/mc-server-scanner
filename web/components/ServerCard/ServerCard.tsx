import Image from 'next/image';
import { ParsedServer } from '../../lib/types';
import ServerFavicon from '../ServerFavicon/ServerFavicon';

const ServerCard = ({
	id,
	favicon,
	hasCustomFavicon,
	ip,
	description,
	version,
	foundAt,
	ping,
	players,
}: ParsedServer) => {
	return (
		<ul className='py-7 bg-neutral-800 p-4 m-4'>
			<li>
				<ServerFavicon favicon={favicon} hasCustomFavicon={hasCustomFavicon} />
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
