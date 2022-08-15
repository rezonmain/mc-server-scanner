import Image from 'next/image';
import { ParsedServer } from '../../lib/types';

const ServerCard = ({
	id,
	favicon,
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
				<Image
					width='64'
					height='64'
					alt='server-favicon'
					className='rounded-full'
					src={favicon}
				></Image>
			</li>
			<li>
				<span className='text-neutral-400'>ID: </span>
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
