import { memo, useEffect, useRef } from 'react';
import { IdleAnimation, SkinViewer } from 'skinview3d';
import ParsedPlayer from '../../lib/classes/ParsedPlayer';

const Viewer = ({ skin }: { skin: string | undefined }) => {
	console.log('rendered');
	const ref = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		(async () => {
			// If skin is undefined use default steve skin
			const playerSkin = skin ?? ParsedPlayer.STEVE;
			// Convert base64 back to blob and get URL to pass to skinviewer
			const blob = await (await fetch(playerSkin)).blob();
			const url = URL.createObjectURL(blob);
			// Create the skin viewer
			const skinViewer = new SkinViewer({
				canvas: ref.current as HTMLCanvasElement,
				width: 150,
				height: 300,
				skin: url,
				animation: new IdleAnimation(),
			});
		})();
	}, [skin]);
	return (
		<div id='canvas-container' className='w-fit mx-auto'>
			<canvas ref={ref} id='skin-viewer'></canvas>
		</div>
	);
};

export default memo(Viewer);
