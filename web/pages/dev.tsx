import type { NextPage } from 'next';
import SkinViewer from '../components/SkinViewer/SkinViewer';

const Dev: NextPage = () => {
	return (
		<div className='h-[500px] w-[50vw] mx-auto'>
			<SkinViewer
				type='classic'
				skin='http://textures.minecraft.net/texture/8d2a31e719de0681329cd2736e6c111d7e30e012d28d38ae1aa14fc2913183e4'
			/>
		</div>
	);
};

export default Dev;
