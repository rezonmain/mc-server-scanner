import { Canvas } from '@react-three/fiber';
import React from 'react';
import Cube from './Cube';

const CubeWidget = () => {
	return (
		<Canvas camera={{ fov: 60, near: 0.1, far: 1000, position: [0, 2, 4] }}>
			<Cube position={[0, 0, 0]} />
		</Canvas>
	);
};

export default React.memo(CubeWidget);
