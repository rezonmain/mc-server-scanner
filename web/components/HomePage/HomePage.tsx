import ScrollTop from '../ScrollTop/ScrollTop';
import HomeList from '../HomeList/HomeList';

const HomePage = () => {
	return (
		<main className='p-4 md:max-w-[750px] xl:max-w-[990px] mx-auto'>
			<h1 id='page-title' className='text-md font-semibold mb-2'>
				Scanned entries
			</h1>
			<div id='content' className=' flex flex-col gap-4'>
				<ScrollTop />
				<HomeList />
			</div>
		</main>
	);
};

export default HomePage;
