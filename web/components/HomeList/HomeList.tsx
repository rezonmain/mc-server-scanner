import React, { ChangeEvent, useState } from 'react';
import _ from 'lodash';
import InfiniteList from '../InfiniteList/InfiniteList';

const showOpts = ['mostRecent', 'history'] as const;

const HomeList = () => {
	const [showing, setShowing] = useState<typeof showOpts[number]>('mostRecent');
	const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
		e.preventDefault();
		setShowing(e.target.value as typeof showOpts[number]);
	};
	return (
		<>
			<form>
				<label htmlFor='showing'>Showing:</label>
				<select name='showing' value={showing} onChange={onChange}>
					{showOpts.map((opt) => (
						<option key={opt} value={opt}>
							{_.startCase(opt)}
						</option>
					))}
				</select>
			</form>
			<InfiniteList queryKey={showing}></InfiniteList>
		</>
	);
};

export default HomeList;
