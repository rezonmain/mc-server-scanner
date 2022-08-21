import type { NextPage } from 'next';
import CubeWidget from '../components/Cube/CubeWidget';
import Waiting from '../components/Waiting/Waiting';

const Dev: NextPage = () => {
	return (
		<Waiting amount={5} />
		// <div className='text-center'>
		// 	<CubeWidget />
		// </div>
	);
};

export default Dev;
