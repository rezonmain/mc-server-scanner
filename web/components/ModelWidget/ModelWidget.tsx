import { useFrame } from '@react-three/fiber';
import { RefObject, useEffect, useRef } from 'react';
import { Group } from 'three';
import usePointerPos from '../../lib/hooks/usePointerPos';
import ClassicModel from '../ClassicModel/ClassicModel';
import SlimModel from '../SlimModel/SlimModel';

const Model = ({ type }: { type: 'classic' | 'slim' }) => {
	const ref = useRef() as RefObject<Group>;
	const { x, y } = usePointerPos();
	useFrame((state, delta) => {
		// @ts-ignore
		ref.current.moveBody(x);
		//@ts-ignore
		ref.current.moveHead(y);
	});
	return (
		<>
			{type === 'classic' ? (
				<ClassicModel position={[0, -1.2, 0]} ref={ref} />
			) : (
				<SlimModel position={[0, -1.2, 0]} ref={ref} />
			)}
		</>
	);
};

export default Model;
