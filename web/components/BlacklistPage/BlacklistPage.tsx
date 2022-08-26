import { FormEvent } from 'react';
import { trpc } from '../../utils/trpc';

const BlacklistPage = () => {
	const { data, mutate, isSuccess, isError, error } = trpc.useMutation([
		'blacklistAdd',
	]);
	const onSubmit = async (
		e: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
	) => {
		e.preventDefault();
		mutate({
			ip: '0.0.0.0',
			key: '',
		});
	};

	if (isSuccess) {
		console.log(data);
	}

	if (isError) {
		console.log(error);
	}
	return (
		<div className='p-4 md:max-w-[750px] xl:max-w-[990px] mx-auto'>
			<div className='bg-neutral-800'>
				<h1 className='text-center font-semibold text-xl'>
					Add an IP to blacklist
				</h1>
				<form onSubmit={(e) => onSubmit(e)} className='flex flex-col'>
					<label>
						IP Address:
						<input name='ip' />
					</label>
					<label>
						Message:
						<input name='message' />
					</label>
					<label>
						Auth Key:
						<input name='key' />
					</label>
					<button onClick={(e) => onSubmit(e)}>Blacklist</button>
				</form>
			</div>
		</div>
	);
};

export default BlacklistPage;
