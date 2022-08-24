import { useEffect, useRef, useState } from 'react';
import { IdleAnimation, SkinViewer } from 'skinview3d';
import ParsedPlayer from '../../lib/classes/ParsedPlayer';

const Viewer = ({ skin }: { skin: string | undefined }) => {
	const ref = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		(async () => {
			// If skin is undefined use default steve skin
			skin = skin ?? ParsedPlayer.STEVE;
			// Convert base64 back to blob and get URL to pass to skinviewer
			const blob = await (await fetch(skin as string)).blob();
			const url = URL.createObjectURL(blob);
			// Create the skin viewer
			const skinViewer = new SkinViewer({
				canvas: ref.current as HTMLCanvasElement,
				width: 150,
				height: 300,
				skin: url,
				animation: new IdleAnimation(),
			});
			// Rotate player a little bit to show perspective
			skinViewer.autoRotate = true;
			skinViewer.autoRotateSpeed = 10;
			window.setTimeout(() => (skinViewer.autoRotate = false), 10);
		})();
	}, []);
	return (
		<div id='canvas-container' className='w-fit mx-auto'>
			<canvas ref={ref} id='skin-viewer'></canvas>
		</div>
	);
};

export default Viewer;
