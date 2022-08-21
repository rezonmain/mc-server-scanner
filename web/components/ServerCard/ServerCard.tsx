import { ParsedServer } from '../../lib/types';
import ServerFavicon from '../ServerFavicon/ServerFavicon';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import { FiChevronDown } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useState } from 'react';
import PlayerList from '../PlayerList/PlayerList';
import { motion, AnimatePresence } from 'framer-motion';

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
	const [showPlayers, setShowPlayers] = useState(false);
	const router = useRouter();
	const handleCopyClick = () => navigator.clipboard.writeText(ip);

	return (
		<ul className='p-5 bg-neutral-800 mb-4 break-words rounded-lg leading-7'>
			<li className='mb-2'>
				<ServerFavicon favicon={favicon} hasCustomFavicon={hasCustomFavicon} />
			</li>
			<li className='flex flex-row items-center gap-2'>
				<span className='text-neutral-400'>IP: </span>
				<span
					onClick={() => router.push({ pathname: '/search', query: { ip } })}
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
				<div
					onClick={() => setShowPlayers((prev) => !prev)}
					className='flex flex-row gap-1 items-center w-fit cursor-pointer select-none'
				>
					<span className='text-neutral-400'>Players: </span>
					{players.online} / {players.max}
					{players.sample && players.sample?.length > 0 ? (
						<motion.div
							id='dropdown-button'
							animate={{ rotate: showPlayers ? '-180deg' : '0deg' }}
							className='active:bg-neutral-600 hover:bg-neutral-600 w-fit h-fit p-[0.1rem] rounded-full transition-colors'
						>
							<FiChevronDown size='18px' />
						</motion.div>
					) : null}
				</div>
			</li>
			<li>
				<AnimatePresence>
					{showPlayers ? <PlayerList players={players} /> : null}
				</AnimatePresence>
			</li>
		</ul>
	);
};

export default ServerCard;
