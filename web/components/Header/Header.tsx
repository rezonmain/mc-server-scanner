import { useState } from 'react';
import { BsGithub } from 'react-icons/bs';
import { FiSearch } from 'react-icons/fi';

const Header = () => {
	const [inputFocus, setInputFocus] = useState(false);
	console.log(inputFocus);

	return (
		<header className='bg-black sticky max-w-[750px] mx-auto flex justify-between p-4 lg:max-w-none m- lg:mx-72 z-10'>
			<div id='link+search' className='flex flex-row gap-4 items-center'>
				<div id='home-link'>
					<span className=' text-xl font-bold'>MCS</span>
				</div>
				<div
					onClick={() => console.log('hi')}
					id='search+search-icon'
					className={`bg-neutral-700 flex flex-row items-center px-2 rounded-lg gap-2 ${
						inputFocus ? 'ring-2 ring-neutral-600' : ''
					} `}
				>
					<FiSearch size={18} />
					<input
						onClick={() => console.log('hi')}
						onFocus={() => setInputFocus(true)}
						onBlur={() => setInputFocus(false)}
						type='search'
						placeholder='Search...'
						className='bg-neutral-700 outline-none h-[2rem] max-w-[40vw] md:max-w-none md:w-[15rem] '
					/>
				</div>
				<button className='hidden md:block select-none cursor-pointer bg-black ring-2 ring-neutral-600 text-md font-semibold rounded-md h-[2rem] py-1 px-2 hover:bg-neutral-800 active:bg-neutral-800 transition-colors'>
					Go
				</button>
			</div>

			<div className='flex flex-row items-center gap-4'>
				<div className='hidden md:block select-none cursor-pointer bg-black ring-2 ring-neutral-600 text-md font-semibold rounded-md h-[2rem] py-1 px-2 hover:bg-neutral-800 active:bg-neutral-800 transition-colors'>
					<span>FAQ</span>
				</div>
				<BsGithub size={32} className='cursor-pointer' />
			</div>
		</header>
	);
};

export default Header;
