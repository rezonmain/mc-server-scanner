const NewEntriesButton = ({
	count,
	onClick,
}: {
	count: number;
	onClick: () => void;
}) => {
	if (count > 0) {
		return (
			<span
				onClick={() => onClick()}
				className='relative inline-flex justify-end'
			>
				<button className='bg-black ring-2 ring-neutral-600 text-sm text-neutral-300 font-semibold rounded-md py-1 px-2'>{`${count} new ${
					count > 1 ? 'entries' : 'entry'
				}`}</button>
				<span className='flex absolute h-[0.6rem] w-[0.6rem] top-0 right-0 -mt-1 -mr-1'>
					<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75'></span>
					<span className='relative inline-flex rounded-full h-[0.6rem] w-[0.6rem] bg-green-600'></span>
				</span>
			</span>
		);
	}
	return null;
};

export default NewEntriesButton;
