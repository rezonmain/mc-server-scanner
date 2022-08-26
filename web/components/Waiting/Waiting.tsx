import _ from 'lodash';

const lines = 6;
const Waiting = ({ amount }: { amount: number }) => {
	return (
		<div className='flex flex-col gap-4 lg:grid lg:grid-cols-2 mt-4'>
			{Array.from({ length: amount }).map((val, i) => (
				<Skeleton key={`Skeleton${i}`} index={i} />
			))}
		</div>
	);
};

const Skeleton = ({ index }: { index: number }) => {
	const widths = [30, 78, 88, 67, 71, 23];
	return (
		<div className='flex flex-col gap-[1rem] animate-pulse rounded-lg w-full bg-neutral-600 p-5'>
			<div className='animate-pulse bg-neutral-700 rounded-full w-[64px] h-[64px]'></div>
			{Array.from({ length: lines }).map((val, i) => (
				<SkeletonLine key={`line${index}${i}`} width={widths[i]} />
			))}
		</div>
	);
};

const SkeletonLine = ({ width }: { width: number }) => {
	return (
		<div
			style={{ width: `${width}%` }}
			className={`animate-pulse bg-neutral-700 rounded-md h-[1.3ch]`}
		></div>
	);
};

export default Waiting;
