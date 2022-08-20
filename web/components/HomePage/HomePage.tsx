import ScrollTop from '../ScrollTop/ScrollTop';
import ServerCount from '../ServerCount/ServerCount';
import HomeList from '../HomeList/HomeList';

const HomePage = () => {
	return (
		<div className='p-4 md:max-w-[750px] xl:max-w-[990px] mx-auto'>
			<ServerCount />
			<ScrollTop />
			<HomeList />
		</div>
	);
};

export default HomePage;
