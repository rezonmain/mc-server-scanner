import { useEffect, useRef } from 'react';
import { SkinViewer } from 'skinview3d';

const Viewer = ({ type, skin }: { type: 'classic' | 'slim'; skin: string }) => {
	const ref = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		const img = new Image(64, 64);
		img.src = skin;
		let sv = new SkinViewer({
			canvas: ref.current as HTMLCanvasElement,
			width: 300,
			height: 400,
			skin,
		});

		sv.background = 0x5a76f3;
	});
	return (
		<div id='canvas-container' className='w-full h-full'>
			<canvas ref={ref} id='skin-viewer'></canvas>
		</div>
	);
};

export default Viewer;
