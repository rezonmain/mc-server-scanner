import React, { ChangeEvent, useState } from 'react';
import _ from 'lodash';
import ListByFoundAt from '../ListByFoundAt/ListByFoundAt';

const listingOpts = ['mostRecent', 'history'] as const;
export type ListingOpts = typeof listingOpts[number];

const ServerList = () => {
	const [showing, setShowing] = useState<ListingOpts>('mostRecent');
	const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
		e.preventDefault();
		setShowing(e.target.value as ListingOpts);
	};
	return (
		<>
			<form>
				<label htmlFor='showing'>Showing:</label>
				<select name='showing' value={showing} onChange={onChange}>
					{listingOpts.map((opt) => (
						<option key={opt} value={opt}>
							{_.startCase(opt)}
						</option>
					))}
				</select>
			</form>
			<ListByFoundAt queryKey={showing}></ListByFoundAt>
		</>
	);
};

export default ServerList;
