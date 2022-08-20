import { useRouter } from 'next/router';

const Crash = ({ message }: { message: string }) => {
	const router = useRouter();
	return (
		<div
			onClick={() => router.push('/')}
			className='w-screen h-screen cursor-pointer'
		>
			<div className='centered w-full text-center flex flex-col gap-10'>
				<div>
					<h1 className='font-semibold text-5xl'>
						Ooops... Something went wrong 🥴
					</h1>
				</div>
				<div>
					<h3 className='text-xl font-bold'>ERORR: {message}</h3>
				</div>
				<div>
					<p>Click anywhere to go to home page.</p>
				</div>
			</div>
		</div>
	);
};

export default Crash;
