import { RefObject, useEffect, useRef, useState } from 'react';

const useShyHeader = (ref: RefObject<HTMLElement>) => {
	const s = useRef({ prev: globalThis.scrollY, mag: 0 });

	const constrain = (scroll: number) => {
		// Constrain scroll (-refheight to 0)
		if (ref.current) {
			return scroll < -ref.current.clientHeight
				? -ref.current.clientHeight
				: scroll > 0
				? 0
				: scroll;
		} else {
			return 0;
		}
	};
	useEffect(() => {
		const onScroll = () => {
			const d = globalThis.scrollY;
			// Scrolling down
			if (s.current.prev < d) {
				// Decrement mag by the amount scrolled (amount scroll is negative in this case)
				s.current.mag += s.current.prev - d;
			}
			// Scrolling up
			if (s.current.prev > d) {
				// Increment mag by amount scrolled
				s.current.mag += s.current.prev - d;
			}
			s.current.mag = constrain(s.current.mag);
			// Set element top property
			ref.current?.setAttribute('style', `top: ${s.current.mag}px`);
			// Set prev to compare it at next scrolling event
			s.current.prev = d;
		};
		globalThis.addEventListener('scroll', onScroll);
		return () => globalThis.removeEventListener('scroll', onScroll);
	});
};

export default useShyHeader;
