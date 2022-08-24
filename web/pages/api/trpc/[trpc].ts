import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import DB from '../../../db/Db';
import FoundServerModel from '../../../db/models/FoundServerModel';
import ParsedPlayer from '../../../lib/classes/ParsedPlayer';
import { RawServer } from '../../../lib/types';
import parseMojangRes from '../../../utils/parseMojangRes';
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
			limit: z.number().positive().default(5),
			cursor: z.number().nullish(),
		}),
		async resolve({ input }) {
			const db = new DB();
			await db.connect();
			const items = await FoundServerModel.find<RawServer>({ ip: input.ip })
				.limit(input.limit)
				.sort({ foundAt: -1 });
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
	})
	.query('search', {
		input: z.object({
			ip: z.string().regex(IP_REGEX).nullish(),
			keyword: z.string().nullish(),
			limit: z.number().positive().default(5),
			cursor: z.number().nullish(),
		}),
		async resolve({ input }) {
			const db = new DB();
			await db.connect();
			const items = await FoundServerModel.find<RawServer>({
				ip: { $regex: input.ip ? `^${input.ip}$` : '.*' },
				foundAt: { $lt: input.cursor ?? 0xffffffffffff },
				$or: [
					{ description: { $regex: input.keyword, $options: 'i' } },
					{ 'description.text': { $regex: input.keyword, $options: 'i' } },
					{
						'description.extra.text': { $regex: input.keyword, $options: 'i' },
					},
					{ 'description.translate': { $regex: input.keyword, $options: 'i' } },
					{ 'players.sample.name': { $regex: input.keyword, $options: 'i' } },
				],
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
	})
	.query('countNewData', {
		input: z.object({
			cursor: z.number().positive().default(0xfffffffffffff),
		}),
		async resolve({ input }) {
			const db = new DB();
			await db.connect();
			const count = await FoundServerModel.countDocuments({
				foundAt: { $gt: input.cursor },
			});
			return {
				count,
			};
		},
	})
	.query('player', {
		input: z.object({
			uuid: z.string(),
		}),
		async resolve({ input }) {
			const mojangURL = `https://sessionserver.mojang.com/session/minecraft/profile/${input.uuid}`;
			const db = new DB();
			await db.connect();
			const player = await FoundServerModel.aggregate([
				{ $unwind: '$players.sample' },
				{ $match: { 'players.sample.id': input.uuid } },
				{
					$group: {
						_id: input.uuid,
						name: { $first: '$players.sample.name' },
						servers: { $addToSet: '$ip' },
					},
				},
			]);
			let mojangName, skin: string | undefined;
			try {
				// Fetch player data from mojang
				const mojangRes = await fetch(mojangURL);
				const mojangJson = await mojangRes.json();
				// Extract skin url and
				const res = parseMojangRes(mojangJson);
				// Set mojang name
				mojangName = res.mojangName;
				// Fetch skin blob and convert to base64 to send to client
				const skinUrl = res.url;
				const skinImageRes = await fetch(skinUrl);
				const blob = await skinImageRes.arrayBuffer();
				// Get skin as base64 of blob
				skin = `data:${skinImageRes.headers.get(
					'content-type'
				)};base64,${Buffer.from(blob).toString('base64')}`;
			} catch {
				// If no response from mojang set mojangName and skin to undefined
				mojangName = undefined;
				skin = undefined;
			}
			return {
				player: {
					uuid: player[0]._id as string,
					name: player[0].name as string,
					servers: player[0].servers as string[],
					mojangName,
					skin,
				} as ParsedPlayer,
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
