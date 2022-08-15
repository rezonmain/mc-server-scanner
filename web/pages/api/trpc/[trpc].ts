import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import DB from '../../../db/Db';
import FoundServerModel from '../../../db/models/FoundServerModel';
import { RawServer } from '../../../lib/types';

/* 
	Queries the most recent entries to the db,
	this is done by sorting by timestamp (foundAt) in a descending manner,
	the query filters results where _id < cursor, 
	this input is used for pagination, because _id's are stored
	in a ascending manner, getting all the servers with _id < cursor
	it means I can paginate using the last _id from the last query.
	By default cursor is the largest value it can be (basically saying get all entries).
	 */
export const appRouter = trpc.router().query('mostRecent', {
	input: z.object({
		limit: z.number().default(5),
		cursor: z.string().nullish(),
	}),
	async resolve({ input }) {
		const db = new DB();
		await db.connect();

		// Find all servers with _id less than cursor
		const items = await FoundServerModel.find<RawServer>({
			_id: { $lt: input.cursor ?? 'ffffffffffffffffffffffff' },
		})
			// Sort in a desceding manner (more recent entries show first)
			.sort({ foundAt: -1 })
			// Limit the number of entries
			.limit(input.limit);
		let nextCursor: typeof input.cursor | undefined = undefined;
		if (items.length >= input.limit) {
			// Get last _id from the last item (least recent), use this _id as the next cursor
			const lastId = items[items.length - 1]._id;
			nextCursor = lastId;
		}
		return {
			items,
			nextCursor,
		};
	},
});

// Export type definition of API
export type AppRouter = typeof appRouter;

// Export API handler
export default trpcNext.createNextApiHandler({
	router: appRouter,
	createContext: () => null,
});
