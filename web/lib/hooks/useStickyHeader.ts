import { useEffect, useRef } from 'react';
/* 
~FIX~
Fixed: see useShyHeader
This code makes me cringe, but it works, so not refactoring it right now
maybe later
*/
const useStickyHeader = () => {
	const scrollRef = useRef({ amount: 0, dir: 0, offset: 0 });
	useEffect(() => {
		scrollRef.current = { amount: 0, dir: 0, offset: globalThis.scrollY };
		const header = document.querySelector('header');
		// Get scroll direction and amount
		const dir = () => {
			const delta = window.scrollY;
			if (delta > scrollRef.current.offset) {
				if (scrollRef.current.dir === -1 && scrollRef.current.amount) {
					scrollRef.current.amount = 0;
				} else {
					scrollRef.current.amount += delta - scrollRef.current.offset;
				}
				scrollRef.current.dir = 1;
			} else {
				if (scrollRef.current.dir === 1) {
					scrollRef.current.amount = 0;
				} else {
					scrollRef.current.amount -= delta - scrollRef.current.offset;
				}
				scrollRef.current.dir = -1;
			}

			header &&
				(scrollRef.current.amount =
					scrollRef.current.amount >= header.clientHeight
						? header?.clientHeight
						: scrollRef.current.amount);
			scrollRef.current.offset = delta <= 0 ? 0 : delta;
		};

		const handleScroll = () => {
			dir();
			const opacity = scrollRef.current.amount / 64;
			if (scrollRef.current.dir === 1) {
				header?.setAttribute('style', `top:${-scrollRef.current.amount}px`);
			}
			if (scrollRef.current.dir === -1) {
				header?.setAttribute(
					'style',
					`top: ${scrollRef.current.amount - header.clientHeight}px`
				);
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
};

export default useStickyHeader;
