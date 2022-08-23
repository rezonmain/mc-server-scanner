import type { NextPage } from 'next';
import Viewer from '../components/Viewer/Viewer';

const Dev: NextPage = () => {
	return (
		<div className='h-[500px] w-[50vw] mx-auto'>
			<Viewer />
		</div>
	);
};

export default Dev;
