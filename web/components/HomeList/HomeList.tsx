import React, { ChangeEvent, useState } from 'react';
import _ from 'lodash';
import InfiniteList from '../InfiniteList/InfiniteList';
import HomeView from '../HomeView/HomeView';

export const showOpts = ['mostRecent', 'history'] as const;
const HomeList = () => {
	const [showing, setShowing] = useState<typeof showOpts[number]>('mostRecent');
	const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
		e.preventDefault();
		setShowing(e.target.value as typeof showOpts[number]);
	};
	return (
		<>
			<HomeView onChange={onChange} showing={showing} />
			<InfiniteList queryKey={showing}></InfiniteList>
		</>
	);
};

export default HomeList;
