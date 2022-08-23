import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

const ServerList = ({ servers }: { servers: string[] }) => {
	const router = useRouter();

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
				{servers.map((server) => (
					<motion.li key={server} variants={item} exit={{ display: 'none' }}>
						<span
							onClick={() =>
								router.push({
									pathname: '/search',
									query: { ip: server },
								})
							}
							className='text-white underline cursor-pointer'
						>
							{server}
						</span>
					</motion.li>
				))}
			</motion.ol>
		</motion.div>
	);
};

export default ServerList;
