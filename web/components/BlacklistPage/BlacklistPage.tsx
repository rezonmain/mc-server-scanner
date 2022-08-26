import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IP_REGEX } from '../../utils/regex';
import { trpc } from '../../utils/trpc';
import { useState } from 'react';

const BlacklistPage = () => {
	const { data, mutate, isSuccess, isError, error } = trpc.useMutation([
		'blacklistAdd',
	]);

	const formSchema = z
		.object({
			ip: z.string().regex(IP_REGEX, { message: 'Invalid IP address' }),
			message: z.string().nullish(),
			key: z.string().min(1, { message: 'Key is required' }),
		})
		.required();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(formSchema),
	});

	return (
		<div className='p-4 md:max-w-[750px] xl:max-w-[990px] mx-auto'>
			<div className='bg-neutral-800 max-w-[600px] rounded-lg p-4'>
				<form
					// @ts-ignore
					onSubmit={handleSubmit((d) => mutate(d))}
					className='flex flex-col gap-3 item-center justify-center  mx-auto w-full'
				>
					<h1 className='font-semibold text-2xl mb-2'>Add to blacklist</h1>
					<Input
						label='IP address'
						name='ip'
						as='input'
						width='w-[50%]'
						register={register}
						errors={errors}
					></Input>
					<Input
						label='Message'
						name='message'
						as='textarea'
						placeholder='Message to show instead of IP address'
						register={register}
						errors={errors}
					></Input>
					<Input
						label='AuthKey'
						name='key'
						as='input'
						type='password'
						register={register}
						errors={errors}
					>
						<>
							{isError && error.message === 'UNAUTHORIZED' && (
								<span className='text-red-700'>* Invalid AuthKey</span>
							)}
							{isSuccess && (
								<span className='bg-green-700 px-2 py-1 w-fit rounded-lg mt-2'>
									✔ Succesfully added <em>{data.ip}</em> to blacklist
								</span>
							)}
						</>
					</Input>
					<button className='block select-none self-start mt-4 cursor-pointer bg-black ring-2 ring-neutral-600 text-md font-semibold rounded-md h-[2rem] py-1 px-2 hover:bg-neutral-800 active:bg-neutral-800 transition-colors'>
						Blacklist
					</button>
				</form>
			</div>
		</div>
	);
};

const Input = ({
	label,
	name,
	children,
	width,
	placeholder,
	register,
	errors,
	type,
	as,
}: {
	label: string;
	name: string;
	children?: string | JSX.Element;
	width?: string;
	placeholder?: string;
	register: any;
	errors: any;
	type?: string;
	as: 'input' | 'textarea';
}) => {
	const [showPassword, setShowPassword] = useState(false);
	const style = `outline-none rounded-md bg-black ring-1 ring-neutral-500 p-2 focus:ring-2 focus:ring-blue-500 transition-colors ${width} placeholder:italic`;
	type = type ?? 'text';
	return (
		<>
			<label className='flex flex-col gap-1'>
				{label}
				{as === 'input' ? (
					<>
						<input
							type={showPassword ? 'text' : type}
							className={style}
							{...register(name)}
						/>
					</>
				) : (
					<textarea
						className={style}
						placeholder={placeholder}
						{...register(name)}
					/>
				)}
			</label>
			<div className='flex flex-row justify-between gap-2'>
				{children}
				{errors[name]?.message && (
					<span className=' text-red-700'>* {errors[name]?.message}</span>
				)}
				{type === 'password' && (
					<span
						onPointerDown={() => setShowPassword(true)}
						onPointerUp={() => setShowPassword(false)}
						className='ml-auto active:underline cursor-pointer select-none'
					>
						Show
					</span>
				)}
			</div>
		</>
	);
};

export default BlacklistPage;
