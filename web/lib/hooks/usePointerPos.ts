import { useEffect, useState } from 'react';

const usePointerPos = () => {
	const [pos, setPos] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setPos({ x: e.clientX, y: e.clientY });
		};
		globalThis.addEventListener('mousemove', (e) => handleMouseMove(e));
		return () =>
			globalThis.removeEventListener('mousemove', (e) => handleMouseMove(e));
	});
	return {
		x: pos.x,
		y: pos.y,
	};
};

export default usePointerPos;
