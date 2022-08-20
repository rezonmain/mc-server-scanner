import ScrollTop from '../ScrollTop/ScrollTop';
import HomeList from '../HomeList/HomeList';

const HomePage = () => {
	return (
		<div className='p-4 md:max-w-[750px] xl:max-w-[990px] mx-auto'>
			<h1 className='text-m dfont-semibold mb-2'>Scanned entries</h1>
			<div className=' flex flex-col gap-4'>
				<ScrollTop />
				<HomeList />
			</div>
		</div>
	);
};

export default HomePage;
