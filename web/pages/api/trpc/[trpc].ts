import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import DB from '../../../db/Db';
import FoundServerModel from '../../../db/models/FoundServerModel';
import { RawServer } from '../../../lib/types';

export const appRouter = trpc
	.router()
	.query('greet', {
		input: z.object({ text: z.string().nullish() }).nullish(),
		resolve({ input }) {
			return {
				greeting: `Hello ${input?.text || 'world'}`,
			};
		},
	})
	/* 
	Queries the most recent entries to the db,
	this is done by sorting by timestamp (foundAt) in a descending manner,
	the query filters results where _id < input.lt, 
	this input is used for pagination, because _id's are stored
	in a ascending manner, getting all the servers with _id < some value,
	it means I can paginate using the last _id from the last query.
	By default this value is the largest it can be (basically saying get all entries).
	 */
	.query('mostRecent', {
		input: z
			.object({
				limit: z.number(),
				// Using default here it means I don't have to included alongside limit in query
				lt: z.string().default('ffffffffffffffffffffffff'),
			})
			.default({
				limit: 5,
				lt: 'ffffffffffffffffffffffff',
			}),
		async resolve({ input }) {
			const db = new DB();
			await db.connect();
			// Find all servers with _id less than input.lt
			const res = await FoundServerModel.find<RawServer>({
				_id: { $lt: input.lt },
			})
				// Sort in a desceding manner (more recent entries show first)
				.sort({ foundAt: -1 })
				// Limit the number of entries
				.limit(input.limit);
			return res;
		},
	})
	.query('findOne', {
		input: z.object({ ip: z.string() }),
		async resolve({ input }) {
			const db = new DB();
			await db.connect();
			const res = await FoundServerModel.findOne<RawServer>({ ip: input.ip });
			return res;
		},
	});

// Export type definition of API
export type AppRouter = typeof appRouter;

// Export API handler
export default trpcNext.createNextApiHandler({
	router: appRouter,
	createContext: () => null,
});
