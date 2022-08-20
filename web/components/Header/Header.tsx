import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, RefObject, useRef, useState } from 'react';
import { BsGithub } from 'react-icons/bs';
import { FiSearch } from 'react-icons/fi';
import useStickyHeader from '../../lib/hooks/useStickyHeader';
import { IP_REGEX } from '../../utils/regex';

const Header = () => {
	const [inputFocus, setInputFocus] = useState(false);
	const [searchText, setSearchText] = useState<string>('');
	const inputRef = useRef() as RefObject<HTMLInputElement>;
	const router = useRouter();
	useStickyHeader();
	const onSubmit = (e?: FormEvent<HTMLFormElement>) => {
		e && e.preventDefault();
		if (searchText.trim().length <= 0) return;
		const ip = searchText.match(IP_REGEX);
		const query = {
			ip: ip ? ip[0] : undefined,
			description: ip ? undefined : searchText.trim(),
		};

		if (!ip) delete query.ip;
		router.push({ pathname: '/search', query });
		inputRef.current?.blur();
	};

	return (
		<header className='bg-black sticky z-10'>
			<div className='mx-auto flex justify-between p-4  md:max-w-[750px] xl:max-w-[990px]'>
				<div id='link+search' className='flex flex-row gap-4 items-center'>
					<Link href={'/'}>
						<div id='home-link' className='cursor-pointer'>
							<span className=' text-xl font-bold'>MSC</span>
						</div>
					</Link>

					<div
						id='search+search-icon'
						className={`bg-neutral-700 flex flex-row items-center px-2 rounded-lg gap-2 ${
							inputFocus ? 'ring-2 ring-neutral-600' : ''
						} transition-all `}
					>
						<FiSearch size={18} />
						<form onSubmit={(e) => onSubmit(e)}>
							<input
								ref={inputRef}
								autoCapitalize='off'
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
								onFocus={() => setInputFocus(true)}
								onBlur={() => setInputFocus(false)}
								type='search'
								placeholder={inputFocus ? ' Keyword or IP...' : 'Search...'}
								className={`bg-neutral-700 outline-none h-[2rem] max-w-[40vw] md:max-w-none md:w-[15rem] ${
									inputFocus ? 'text-white' : 'text-neutral-400'
								} transition-colors `}
							/>
						</form>
					</div>
					<button
						onClick={() => onSubmit()}
						className='hidden md:block select-none cursor-pointer bg-black ring-2 ring-neutral-600 text-md font-semibold rounded-md h-[2rem] py-1 px-2 hover:bg-neutral-800 active:bg-neutral-800 transition-colors'
					>
						Go
					</button>
				</div>
				<div className='flex flex-row items-center gap-4'>
					<Link href={'/about'}>
						<div className='hidden md:block select-none cursor-pointer bg-black ring-2 ring-neutral-600 text-md font-semibold rounded-md h-[2rem] py-1 px-2 hover:bg-neutral-800 active:bg-neutral-800 transition-colors'>
							<span>FAQ</span>
						</div>
					</Link>
					<a href='https://github.com/rezonmain/mc-server-scanner'>
						<BsGithub size={32} className='cursor-pointer' />
					</a>
				</div>
			</div>
		</header>
	);
};

export default Header;
