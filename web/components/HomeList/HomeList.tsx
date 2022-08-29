import React, { ChangeEvent, useEffect, useState } from 'react';
import _ from 'lodash';
import InfiniteList from '../InfiniteList/InfiniteList';
import HomeView from '../HomeView/HomeView';

export const showOpts = ['mostRecent', 'history'] as const;
const HomeList = () => {
	const [showing, setShowing] = useState<typeof showOpts[number]>('mostRecent');
	const [rendered, setRendered] = useState(false);
	const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
		e.preventDefault();
		setShowing(e.target.value as typeof showOpts[number]);
		sessionStorage.setItem('showing', e.target.value);
	};
	useEffect(() => {
		const savedShowing = sessionStorage.getItem('showing');
		savedShowing && setShowing(savedShowing as typeof showOpts[number]);
		setRendered(true);
	}, []);
	return (
		<>
			<HomeView onChange={onChange} showing={showing} />
			<InfiniteList queryKey={showing}></InfiniteList>
		</>
	);
};

export default HomeList;
