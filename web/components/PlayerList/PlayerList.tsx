import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import ParsedServer from '../../lib/classes/ParsedServer';

const PlayerList = ({ players }: { players: ParsedServer['players'] }) => {
	const router = useRouter();
	if (players.sample && players.sample?.length <= 0) return null;

	const list = {
		visible: {
			opacity: 1,
			transition: {
				when: 'beforeChildren',
				staggerChildren: 0.075,
			},
		},
		hidden: {
			opacity: 0,
			transition: {
				when: 'afterChildren',
			},
		},
	};

	const item = {
		visible: { opacity: 1, y: 0 },
		hidden: { opacity: 0, y: -10 },
	};

	return (
		<motion.div
			initial={{ height: 0 }}
			animate={{ height: '' }}
			exit={{ height: 0 }}
		>
			<motion.ol
				variants={list}
				initial='hidden'
				animate='visible'
				exit='hidden'
				className='list-decimal pl-8 text-neutral-400'
			>
				{players.sample?.map((sample) => (
					<motion.li key={sample.id} variants={item} exit={{ display: 'none' }}>
						<span
							onClick={() =>
								router.push({
									pathname: '/search',
									query: { keyword: sample.name },
								})
							}
							className='text-white underline cursor-pointer'
						>
							{sample.name}
						</span>
					</motion.li>
				))}
			</motion.ol>
		</motion.div>
	);
};

export default PlayerList;
