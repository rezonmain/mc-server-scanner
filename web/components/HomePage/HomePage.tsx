import ScrollTop from '../ScrollTop/ScrollTop';
import ServerCount from '../ServerCount/ServerCount';
import ServerList from '../ServerList/ServerList';

const HomePage = () => {
	return (
		<div className='p-4 max-w-[750px] mx-auto'>
			<ServerCount />
			<ScrollTop />
			<ServerList />
		</div>
	);
};

export default HomePage;
