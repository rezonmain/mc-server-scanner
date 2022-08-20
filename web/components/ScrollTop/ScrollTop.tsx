import { BsChevronUp } from 'react-icons/bs';

const ScrollTop = () => {
	const onClick = (e: React.MouseEvent) => {
		e.preventDefault();
		window &&
			window.scroll({
				top: 0,
				behavior: 'smooth',
			});
	};
	return (
		<button
			onClick={(e) => onClick(e)}
			title='Scroll to top'
			className='fixed w-12 aspect-square border border-white bg-neutral-900 rounded-full top-[90vh] left-[80vw] opacity-75 hover:opacity-100 active:opacity-100 transition-opacity z-20'
		>
			<BsChevronUp className='centered' fill='white' />
		</button>
	);
};

export default ScrollTop;
