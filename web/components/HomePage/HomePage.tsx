import ScrollTop from '../ScrollTop/ScrollTop';
import ServerCount from '../ServerCount/ServerCount';
import HomeList from '../HomeList/HomeList';

const HomePage = () => {
	return (
		<div className='p-4 max-w-[750px] mx-auto'>
			<ServerCount />
			<ScrollTop />
			<HomeList />
		</div>
	);
};

export default HomePage;
