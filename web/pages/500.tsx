import Head from 'next/head';
import Link from 'next/link';

export default function Custom500() {
	return (
		<div className='text-center h-[50vh] flex flex-col items-center justify-center gap-2'>
			<Head>
				<title>Oops...</title>
			</Head>
			<h1 className='text-semibold text-3xl max-w-[20ch]'>
				Oops... something went wrong on our end 🥴
			</h1>
			<Link href={'/'}>
				<p className='underline cursor-pointer'>Click here to go to homepage</p>
			</Link>
		</div>
	);
}
