import { useEffect, useRef, useState } from 'react';
import { SkinViewer } from 'skinview3d';

const Viewer = ({ type, skin }: { type: 'classic' | 'slim'; skin: string }) => {
	const [render, setRender] = useState(false);
	const ref = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		fetch(skin)
			.then((res) => res.blob())
			.then((blob) => URL.createObjectURL(blob))
			.then((url) => {
				let skinViewer = new SkinViewer({
					canvas: ref.current as HTMLCanvasElement,
					width: 300,
					height: 400,
					skin: url,
				});
			});
	}, []);
	return (
		<div id='canvas-container' className='w-full h-full bg-white'>
			<canvas ref={ref} id='skin-viewer'></canvas>
		</div>
	);
};

export default Viewer;
