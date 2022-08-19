import _ from 'lodash';
import { useEffect, useState } from 'react';

const Waiting = ({ amount }: { amount: number }) => {
	const [client, setClient] = useState(false);
	useEffect(() => {
		setClient(true);
	}, []);
	return (
		<>
			{client &&
				Array.from({ length: amount }).map((val, i) => (
					<Skeleton key={`Skeleton${i}`} index={i} />
				))}
		</>
	);
};

const Skeleton = ({ index }: { index: number }) => {
	const lines = 6;
	const ran = () => {
		return _.random(7, 40, false);
	};
	return (
		<ul className='flex flex-col gap-2 animate-pulse rounded-lg w-full bg-neutral-600 py-7 p-4 my-4'>
			<div className='animate-pulse bg-neutral-700 rounded-full w-[64px] h-[64px]'></div>
			{Array.from({ length: lines }).map((val, i) => (
				<SkeletonLine key={`line${index}${i}`} width={ran()} />
			))}
		</ul>
	);
};

const SkeletonLine = ({ width }: { width: number }) => {
	return (
		<div
			style={{ width: `${width}ch` }}
			className={`animate-pulse bg-neutral-700 rounded-md h-[1.2ch]`}
		></div>
	);
};

export default Waiting;
