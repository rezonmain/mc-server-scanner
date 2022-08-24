import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
	return (
		<div className='text-center h-[50vh] flex flex-col items-center justify-center gap-2'>
			<Head>
				<title>404 | Page not found</title>
			</Head>
			<h1 className='text-semibold text-3xl'>404 | Page not found</h1>
			<Link href={'/'}>
				<p className='underline cursor-pointer'>Click here to go to homepage</p>
			</Link>
			<small className='mt-4'>
				Damn cats stepping on the keyboard right? 🐱{' '}
			</small>
		</div>
	);
}
