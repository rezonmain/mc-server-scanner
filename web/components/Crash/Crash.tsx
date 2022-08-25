import Link from 'next/link';

const Crash = ({ message }: { message: string }) => {
	return (
		<div className='w-full cursor-pointer flex items-center justify-center'>
			<div className='w-full text-center flex flex-col gap-4'>
				<div>
					<h1 className='font-semibold text-2xl'>
						Ooops... Something went wrong 🥴
					</h1>
				</div>
				<div>
					<h3 className='text-xl font-bold'>Error: {message}</h3>
				</div>
				<div>
					<Link href='/'>
						<p className='hover:underline active:underline cursor-pointer'>
							Click here to go to home page.
						</p>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Crash;
