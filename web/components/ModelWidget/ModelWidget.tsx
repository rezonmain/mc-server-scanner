import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import ClassicModel from '../ClassicModel/ClassicModel';

const Model = ({ type }: { type: 'classic' | 'slim' }) => {
	const ref = useRef<THREE.Group>(null!);
	useFrame((state, delta) => {});
	return <ClassicModel position={[0, -1.2, 0]} ref={ref} />;
};

export default Model;
