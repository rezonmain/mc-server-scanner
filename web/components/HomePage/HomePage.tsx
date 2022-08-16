import ServerCount from '../ServerCount/ServerCount';
import ServerList from '../ServerList/ServerList';

const HomePage = () => {
	return (
		<div className='p-4'>
			<ServerCount />
			<ServerList />
		</div>
	);
};

export default HomePage;
