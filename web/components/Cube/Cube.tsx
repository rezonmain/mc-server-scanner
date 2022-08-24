import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame, Vector3 } from '@react-three/fiber';

const Cube = ({ position }: { position: Vector3 }) => {
	const ref = useRef<THREE.Mesh>(null!);

	useFrame(() => {
		// Rotate 20 degrees cw
		ref.current.rotation.y += (0.5 * Math.PI) / 180;
		ref.current.rotation.x = 0;
	});

	return (
		<mesh position={position} ref={ref} scale={2.2}>
			<boxGeometry />
			<meshBasicMaterial wireframe={true} />
		</mesh>
	);
};

export default Cube;
