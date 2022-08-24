import { useEffect, useState } from 'react';
import Image from 'next/image';

const ServerFavicon = ({
	id,
	hasCustomFavicon,
	favicon,
}: {
	id: string;
	hasCustomFavicon: boolean;
	favicon: string;
}) => {
	const [show, setShow] = useState(!hasCustomFavicon);

	const onClick = (show: boolean) => {
		// Remember the show state across pages
		show = !show;
		sessionStorage.setItem(id, show.toString());
		hasCustomFavicon && setShow((prev) => !prev);
	};

	useEffect(() => {
		// Get show state if exists in sessionstorage
		const initialState = sessionStorage.getItem(id);
		initialState && setShow(initialState === 'true');
	}, [id]);

	if (!hasCustomFavicon) {
		return (
			<div className='w-[64px] h-[64px] rounded-full border-2 border-white select-none'>
				<Image
					width='64'
					height='64'
					alt='server-favicon'
					className={`rounded-full ${
						show ? 'opacity-100' : 'opacity-0'
					} transition-opacity`}
					src={favicon}
				></Image>
			</div>
		);
	}

	return (
		<div
			onClick={() => onClick(show)}
			className={`relative w-[64px] h-[64px] rounded-full border-2 border-white ${
				hasCustomFavicon ? 'cursor-pointer' : ''
			}`}
		>
			<span
				className={`centered text-xs text-center ${
					show ? 'opacity-0' : 'opacity-100'
				} transition-opacity`}
			>
				Tap to show
			</span>
			<Image
				width='64'
				height='64'
				alt='server-favicon'
				className={`rounded-full ${
					show ? 'opacity-100' : 'opacity-0'
				} transition-opacity`}
				src={favicon}
			></Image>
		</div>
	);
};

export default ServerFavicon;
