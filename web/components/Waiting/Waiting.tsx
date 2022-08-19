import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';

const lines = 6;
const Waiting = ({ amount }: { amount: number }) => {
	return (
		<>
			{Array.from({ length: amount }).map((val, i) => (
				<Skeleton key={`Skeleton${i}`} index={i} />
			))}
		</>
	);
};

const Skeleton = ({ index }: { index: number }) => {
	const widths = [30, 78, 88, 67, 71, 23];
	return (
		<ul className='flex flex-col gap-2 animate-pulse rounded-lg w-full bg-neutral-600 py-7 p-4 my-4'>
			<div className='animate-pulse bg-neutral-700 rounded-full w-[64px] h-[64px]'></div>
			{Array.from({ length: lines }).map((val, i) => (
				<SkeletonLine key={`line${index}${i}`} width={widths[i]} />
			))}
		</ul>
	);
};

const SkeletonLine = ({ width }: { width: number }) => {
	return (
		<div
			style={{ width: `${width}%` }}
			className={`animate-pulse bg-neutral-700 rounded-md h-[1.2ch]`}
		></div>
	);
};

export default Waiting;
