import { BsGithub } from 'react-icons/bs';
import { FiSearch } from 'react-icons/fi';

const Header = () => {
	return (
		<header className='bg-black sticky flex justify-between p-4 lg:mx-40 z-10'>
			<div id='link+search' className='flex flex-row gap-4 items-center'>
				<div id='home-link'>
					<span className=' text-xl font-bold'>MCS</span>
				</div>
				<div
					id='search'
					className='bg-neutral-700 flex flex-row items-center px-2 py-1 rounded-lg gap-2'
				>
					<FiSearch />
					<input
						type='search'
						placeholder='Search...'
						className='bg-neutral-700 h-full outline-none max-w-[40vw] md:max-w-none md:w-[50vw] '
					/>
				</div>
			</div>

			<div className='flex flex-row items-center gap-4'>
				<div className='hidden md:block select-none cursor-pointer bg-black ring-2 ring-neutral-600 text-md font-semibold rounded-md py-1 px-2 hover:bg-neutral-800 active:bg-neutral-800 transition-colors'>
					<span>FAQ</span>
				</div>
				<BsGithub size={32} className='cursor-pointer' />
			</div>
		</header>
	);
};

export default Header;
