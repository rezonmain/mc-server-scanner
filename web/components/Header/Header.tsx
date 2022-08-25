import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, RefObject, useEffect, useRef, useState } from 'react';
import { BsGithub } from 'react-icons/bs';
import { FiSearch } from 'react-icons/fi';
import useShyHeader from '../../lib/hooks/useShyHeader';
import { IP_REGEX, UUID_REGEX } from '../../utils/regex';
import CubeWidget from '../Cube/CubeWidget';

const Header = () => {
	const [inputFocus, setInputFocus] = useState(false);
	const [searchText, setSearchText] = useState<string>('');
	const [rendered, setRendered] = useState(false);
	const inputRef = useRef() as RefObject<HTMLInputElement>;
	const headerRef = useRef() as RefObject<HTMLElement>;
	const router = useRouter();
	useEffect(() => {
		setRendered(true);
	}, []);
	useShyHeader(headerRef);

	const onSubmit = (e?: FormEvent<HTMLFormElement>) => {
		e && e.preventDefault();
		// Don't do anything if user has not types anything
		if (searchText.trim().length <= 0) return;
		// Test if search text is an ip address
		const ip = searchText.match(IP_REGEX);
		// Test if search text is an uuid
		const uuid = searchText.trim().match(UUID_REGEX);
		// If query is uuid push it player page
		if (uuid) {
			router.push({ pathname: '/player', query: { uuid } });
			setSearchText('');
			return;
		}
		/* If query is ip set ip to matched ip, and set keyword to undefined
		if query is not an ip, set ip to undefined and keyword as trimed search text*/
		const query = {
			ip: ip ? ip[0] : undefined,
			keyword: ip ? undefined : searchText.trim(),
		};
		// If ip is undefined delete ip from query props as to not pass it as page query
		if (!ip) delete query.ip;
		// If keyword is undefines deleted it from query props
		if (!query.keyword) delete query.keyword;
		// Redundant test id query is and empty object don't do anything
		if (Object.keys(query).length === 0) return;
		// Push the query object to search page
		router.push({ pathname: '/search', query });
		// Unfocus input element
		inputRef.current?.blur();
		// Clear the input element
		setSearchText('');
	};
	return (
		<header ref={headerRef} className='bg-black sticky z-10'>
			<div className='mx-auto flex justify-between py-4 px-3  md:max-w-[750px] xl:max-w-[990px]'>
				<div id='link+search' className='flex flex-row gap-2 items-center'>
					<Link href={'/'}>
						<div id='home-link' className='cursor-pointer w-10 h-10'>
							{rendered && <CubeWidget />}
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
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
								onFocus={() => setInputFocus(true)}
								onBlur={() => setInputFocus(false)}
								type='search'
								placeholder={
									inputFocus ? 'Keyword, player, ip...' : 'Search...'
								}
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
						<div className='block select-none cursor-pointer bg-black ring-2 ring-neutral-600 text-md font-semibold rounded-md h-[2rem] py-1 px-2 hover:bg-neutral-800 active:bg-neutral-800 transition-colors'>
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
