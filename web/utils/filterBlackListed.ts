import { Blacklist } from '../db/models/BlacklistModel';
import { RawServer } from '../lib/types';

/* Player query passes string[], if this is the case return it
every other query passes RawServer[], in this case item can be edited in place */
const filterBlackListed = (
	items: RawServer[] | string[],
	blacklistArray: Blacklist[]
) => {
	const filtered: string[] = [];

	items.forEach((item) => {
		// If current item (ip) exists in the blacklist return it, otherwise is underfined
		const blacklisted = blacklistArray.find((blacklist) =>
			typeof item === 'string'
				? blacklist.ip === item
				: blacklist.ip === item.ip
		);

		if (typeof item === 'string') {
			item = blacklisted ? blacklisted.message : item;
			filtered.push(item);
		} else {
			item.ip = blacklisted ? blacklisted.message : item.ip;
		}
	});

	return filtered;
};

export default filterBlackListed;
