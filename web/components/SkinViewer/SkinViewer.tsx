import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import ModelWidget from '../ModelWidget/ModelWidget';

const Viewer = ({ type, skin }: { type: 'classic' | 'slim'; skin: string }) => {
	return (
		<div id='canvas-container' className='w-full h-full'>
			<Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 2] }}>
				<ambientLight intensity={1} />
				<spotLight position={[10, 10, 10]} angle={0.1} penumbra={1} />
				<pointLight position={[0, 0, 0]} />
				<Suspense fallback={null}>
					<ModelWidget type={type} />
				</Suspense>
			</Canvas>
		</div>
	);
};

export default Viewer;
