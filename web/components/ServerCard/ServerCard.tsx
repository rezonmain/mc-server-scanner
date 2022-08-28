import { ParsedServer } from '../../lib/types';
import ServerFavicon from '../ServerFavicon/ServerFavicon';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import { FiChevronDown } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PlayerList from '../PlayerList/PlayerList';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import { IP_REGEX } from '../../utils/regex';
import { z } from 'zod';

const ServerCard = ({
	id,
	favicon,
	hasCustomFavicon,
	ip,
	description,
	version,
	foundAt,
	foundBy,
	ping,
	players,
}: ParsedServer) => {
	const [rendered, setRendered] = useState(false);
	const [showPlayers, setShowPlayers] = useState(false);
	const [animating, setAnimating] = useState(false);
	/* A little id for the favicon derived from the component key (id)
	used to remember the showFavicon state across page transitions */
	const favId = 'fav' + id;

	let validIP: boolean = true;
	try {
		z.string().regex(IP_REGEX).parse(ip);
	} catch {
		validIP = false;
	}

	const router = useRouter();
	const handleCopyClick = () => navigator.clipboard.writeText(ip);

	const onShow = (showPlayers: boolean) => {
		// Remember the showplayers state
		showPlayers = !showPlayers;
		sessionStorage.setItem(id, showPlayers.toString());
		setShowPlayers((prev) => !prev);
	};

	// On first render
	useEffect(() => {
		// Get the showPlayers state if exits
		const initalState = sessionStorage.getItem(id);
		initalState && setShowPlayers(initalState === 'true');
		setRendered(true);
	}, [id]);

	return (
		<ul className='p-5 bg-neutral-800 break-words rounded-lg leading-7'>
			<li className='mb-2'>
				<ServerFavicon
					id={favId}
					favicon={favicon}
					hasCustomFavicon={hasCustomFavicon}
				/>
			</li>
			<li className='flex flex-row items-center gap-2'>
				<span className='text-neutral-400'>IP: </span>
				<span
					onClick={() =>
						validIP && router.push({ pathname: '/search', query: { ip } })
					}
					className={`${
						validIP ? 'underline' : 'no-underline'
					} cursor-pointer active:no-underline`}
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
				{rendered && foundAt}
			</li>
			{foundBy && (
				<>
					<span className='text-neutral-400'>Found by: </span>
					{foundBy}
				</>
			)}

			<li>
				<span className='text-neutral-400'>Ping: </span>
				{ping}
			</li>
			<li>
				<div
					onClick={() => !animating && onShow(showPlayers)}
					className={`flex flex-row gap-1 items-center w-fit select-none ${
						players.sample && players.sample?.length > 0 ? 'cursor-pointer' : ''
					}`}
				>
					<span className='text-neutral-400'>Players: </span>
					{players.online} / {players.max}
					{players.sample && players.sample?.length > 0 ? (
						<motion.div
							onAnimationStart={() => setAnimating(true)}
							onAnimationComplete={() => setAnimating(false)}
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
				<AnimatePresence onExitComplete={() => setAnimating(false)}>
					{showPlayers ? <PlayerList players={players} /> : null}
				</AnimatePresence>
			</li>
		</ul>
	);
};

export default React.memo(ServerCard);
