import { FiChevronDown } from 'react-icons/fi';
import { useState } from 'react';
import React from 'react';
import ParsedPlayer from '../../lib/classes/ParsedPlayer';
import ServerList from '../ServerList/ServerList';
import { AnimatePresence, motion } from 'framer-motion';
import Viewer from '../Viewer/Viewer';

const PlayerCard = ({
	name,
	uuid,
	servers,
	mojangName,
	mojangUUID,
	skin,
}: ParsedPlayer) => {
	const [showServers, setShowServers] = useState(false);
	const [animating, setAnimating] = useState(false);
	const isAuthorized = !!mojangName;
	const inDatabase = !!name || !!servers;

	return (
		<ul className='p-5 ring-1 ring-neutral-500 bg-neutral-800 mb-4 break-words rounded-lg leading-7 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-around'>
			<div id='skin-viewer' className='lg:self-start'>
				<Viewer skin={skin} />
			</div>
			<div>
				<hr className=' border-t-neutral-500 rounded-full mb-4 block lg:rotate-90'></hr>
			</div>
			<div id='details'>
				{inDatabase && (
					<li>
						<span className='text-neutral-400'>Name: </span>
						<span>{name}</span>
					</li>
				)}
				{isAuthorized && name !== mojangName && (
					<li>
						<span className='text-neutral-400'>Mojang name: </span>
						<span>{mojangName}</span>
					</li>
				)}

				<li>
					<span className='text-neutral-400'>UUID: </span>
					<span>{uuid || mojangUUID}</span>
				</li>
				{isAuthorized ? null : (
					<small className='italic'>
						Player not authenticated by Mojang/Microsoft
					</small>
				)}
				{servers && (
					<>
						<li>
							<div
								onClick={() => !animating && setShowServers((prev) => !prev)}
								className='cursor-pointer flex flex-row items-center gap-2 w-fit select-none'
							>
								<span>{showServers ? 'Hide' : 'Show'} servers</span>
								<motion.div
									onAnimationStart={() => setAnimating(true)}
									onAnimationComplete={() => setAnimating(false)}
									id='dropdown-button'
									animate={{ rotate: showServers ? '-180deg' : '0deg' }}
									className='active:bg-neutral-600 hover:bg-neutral-600 w-fit h-fit p-[0.1rem] rounded-full transition-colors'
								>
									<FiChevronDown size='18px' />
								</motion.div>
							</div>
						</li>
						<li>
							<AnimatePresence onExitComplete={() => setAnimating(false)}>
								{showServers ? <ServerList servers={servers} /> : null}
							</AnimatePresence>
						</li>{' '}
					</>
				)}
			</div>
		</ul>
	);
};

export default PlayerCard;
