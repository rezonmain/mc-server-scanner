import { useRouter } from 'next/router';

const Crash = ({ message }: { message: string }) => {
	const router = useRouter();
	return (
		<div
			onClick={() => router.push('/')}
			className='w-screen h-screen cursor-pointer'
		>
			<div className='centered w-full text-center'>
				<h1 className='text-xl font-bold'>ERORR: {message}</h1>
				<p>Click anywhere to go to home page.</p>
			</div>
		</div>
	);
};

export default Crash;
