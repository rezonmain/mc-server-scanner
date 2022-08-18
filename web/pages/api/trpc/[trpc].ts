import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import DB from '../../../db/Db';
import FoundServerModel from '../../../db/models/FoundServerModel';
import { RawServer } from '../../../lib/types';
import { IP_REGEX } from '../../../utils/regex';

/* 
	Queries the most recent entries to the db,
	this is done by sorting by timestamp (foundAt) in a descending manner,
	the query filters results where foundAt < cursor, 
	it means I can paginate using the last foundAt from the last query.
	By default cursor is the largest value it can be (basically saying get all entries).
	 */
export const appRouter = trpc
	.router()
	.query('mostRecent', {
		input: z.object({
			limit: z.number().positive().default(5),
			cursor: z.number().nullish(),
		}),
		async resolve({ input }) {
			const db = new DB();
			await db.connect();

			// Find all servers with foundAt less than cursor
			// If no cursor was provided use a big ass number
			const items = await FoundServerModel.find<RawServer>({
				foundAt: { $lt: input.cursor ?? 0xffffffffffff },
			})
				// Sort in a descending manner (more recent entries show first)
				.sort({ foundAt: -1 })
				// Limit the number of entries
				.limit(input.limit);
			let nextCursor: typeof input.cursor | undefined = undefined;
			if (items.length >= input.limit) {
				// Get last timestamp(foundAt) from the last item (least recent), use this ts as the next cursor
				const lastTs = items[items.length - 1].foundAt;
				nextCursor = lastTs;
			}
			return {
				items,
				nextCursor,
			};
		},
	})
	// Show oldest entries first
	.query('history', {
		input: z.object({
			limit: z.number().positive().default(5),
			cursor: z.number().nullish(),
		}),
		async resolve({ input }) {
			const db = new DB();
			await db.connect();

			const items = await FoundServerModel.find<RawServer>({
				foundAt: { $gt: input.cursor ?? 0x0 },
			})
				// Sort in a ascending manner (oldest firs)
				.sort({ foundAt: 1 })
				// Limit the number of entries
				.limit(input.limit);
			let nextCursor: typeof input.cursor | undefined = undefined;
			if (items.length >= input.limit) {
				// Get last timestamp(foundAt) from the last item (least recent), use this ts as the next cursor
				const lastTs = items[items.length - 1].foundAt;
				nextCursor = lastTs;
			}
			return {
				items,
				nextCursor,
			};
		},
	})
	.query('count', {
		async resolve() {
			const db = new DB();
			await db.connect();
			const totalCount = await FoundServerModel.countDocuments({});
			const uniqueCount = (await FoundServerModel.distinct('ip')).length;

			return { totalCount, uniqueCount };
		},
	})
	.query('findByIp', {
		input: z.object({
			ip: z.string().regex(IP_REGEX),
		}),
		async resolve({ input }) {
			const db = new DB();
			await db.connect();
			const items = await FoundServerModel.find<RawServer>({ ip: input.ip });
			return {
				items,
			};
		},
	})
	.query('search', {
		input: z.object({
			term: z.string(),
			limit: z.number().positive().default(5),
			cursor: z.number().nullish(),
		}),
		async resolve({ input }) {
			const db = new DB();
			await db.connect();
			const items = await FoundServerModel.find<RawServer>({
				$or: [
					{ 'players.sample.name': { $regex: input.term, $options: 'i' } },
					{ 'description.text': { $regex: input.term, $options: 'i' } },
					{ 'description.extra.text': { $regex: input.term, $options: 'i' } },
				],
				foundAt: { $lt: input.cursor ?? 0xffffffffffff },
			})
				.sort({ foundAt: -1 })
				.limit(input.limit);
			let nextCursor: typeof input.cursor | undefined = undefined;
			if (items.length >= input.limit) {
				const lastTs = items[items.length - 1].foundAt;
				nextCursor = lastTs;
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
