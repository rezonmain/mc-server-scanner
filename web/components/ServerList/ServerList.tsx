import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { z } from 'zod';
import { IP_REGEX } from '../../utils/regex';

const ServerList = ({ servers }: { servers: string[] }) => {
	const router = useRouter();

	const list = {
		visible: {
			opacity: 1,
		},
		hidden: {
			opacity: 0,
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
				{servers.map((server) => {
					let validIP = true;
					try {
						z.string().regex(IP_REGEX).parse(server);
					} catch {
						validIP = false;
					}
					return (
						<motion.li key={server} variants={item} exit={{ display: 'none' }}>
							<span
								onClick={() =>
									validIP &&
									router.push({
										pathname: '/search',
										query: { ip: server },
									})
								}
								className={`text-white ${
									validIP && 'underline'
								} cursor-pointer`}
							>
								{server}
							</span>
						</motion.li>
					);
				})}
			</motion.ol>
		</motion.div>
	);
};

export default ServerList;
