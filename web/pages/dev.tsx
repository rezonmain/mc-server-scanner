import type { NextPage } from 'next';
import SkinViewer from '../components/SkinViewer/SkinViewer';

const Dev: NextPage = () => {
	return (
		<div className='h-[500px] w-[50vw] mx-auto'>
			<SkinViewer type='classic' skin='' />
		</div>
	);
};

export default Dev;
