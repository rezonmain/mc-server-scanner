import { NextPage } from 'next';
import Head from 'next/head';

const About: NextPage = () => {
	return (
		<>
			<Head>
				<title>Server Browser | FAQ</title>
			</Head>
			<div className='py-4 px-10 md:max-w-[700px] mx-auto'>
				<h1 className='text-2xl font-bold mb-4'>FAQ</h1>
				<ol className='list-decimal marker:text-xl'>
					<li>
						<Question>What is this website?</Question>
						<Answer>
							<>
								This is the front end for my{' '}
								<a
									className=' text-blue-500 font-semibold'
									href='https://github.com/rezonmain/mc-server-scanner'
								>
									minecraft server scanner.
								</a>{' '}
								I created it to browse the scanned entries and search for
								particular players or servers.
							</>
						</Answer>
					</li>
					<li>
						<Question>
							Why sometimes I cannot see the players on a server?
						</Question>
					</li>
					<Answer>
						Even if the server shows online players, that information is
						controlled by the server admin, this website tries to filter for
						potentially fake players so only shows real players on the player
						list.
					</Answer>
					<li>
						<Question>
							Why some servers have their image as &apos;Tap to show&apos;?
						</Question>
						<Answer>
							It means the server has a custom image or favicon, as these may
							contain nudity or explicit content, the user can choose to see the
							favicon or not.
						</Answer>
					</li>
					<li>
						<Question>
							What does &apos;total&apos; and &apos;unique&apos; mean on the
							entries count?
						</Question>
						<Answer>
							Total is every entry in the scanned server database, the scanner
							covers the entire internet multiple times, this can result in
							scanning the same server several times, this is intended. The
							unique count is every unique server IP.
						</Answer>
					</li>
					<li>
						<Question>
							What does &apos;Player not authenticated by Mojang/Microsoft&apos;
							mean?
						</Question>
						<Answer>
							It can mean either of 2 things, the server responded with a fake
							player UUID, or the server is cracked and allows offline accounts
							to connect to it.
						</Answer>
					</li>
				</ol>
			</div>
		</>
	);
};

const Question = ({ children }: { children: string }) => {
	return <h2 className='text-xl font-semibold mb-1'>{children}</h2>;
};

const Answer = ({ children }: { children: string | JSX.Element }) => {
	return <p className='mb-6 leading-7'>{children}</p>;
};

export default About;
