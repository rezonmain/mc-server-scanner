import Link from 'next/link';

const Footer = () => {
	return (
		<footer className='h-20 mt-10'>
			<div className='flex flex-col justify-center items-center mx-auto w-fit gap-2'>
				<small>&copy; 2022 made with 💝 by rezonmain</small>
				<small>
					<Link href='/about'>
						<a className='hover:underline active:underline'>About</a>
					</Link>{' '}
					|{' '}
					<a
						className='hover:underline active:underline'
						href='https://github.com/rezonmain/mc-server-scanner'
					>
						Github
					</a>{' '}
					|{' '}
					<Link href='/blacklist'>
						<a className='hover:underline active:underline'>Blacklist</a>
					</Link>
				</small>
			</div>
		</footer>
	);
};

export default Footer;
