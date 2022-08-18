import type { NextPage } from 'next';
import ServerCard from '../components/ServerCard/ServerCard';
import Waiting from '../components/Waiting/Waiting';
import PropertyParser from '../lib/classes/PropertyParser';
import { trpc } from '../utils/trpc';

const Dev: NextPage = () => {
	return <Waiting amount={1} />;
};

export default Dev;

// general search:

//FriendlyWale
