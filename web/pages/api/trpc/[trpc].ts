import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import DB from '../../../db/Db';
import FoundServerModel from '../../../db/models/FoundServerModel';
import BlacklistModel, { Blacklist } from '../../../db/models/BlacklistModel';
import ParsedPlayer from '../../../lib/classes/ParsedPlayer';
import { RawServer } from '../../../lib/types';
import parseMojangRes from '../../../utils/parseMojangRes';
import { IP_REGEX } from '../../../utils/regex';
import filterBlackListed from '../../../utils/filterBlackListed';
import KeyModel, { AuthKey } from '../../../db/models/KeyModel';
import bcrypt from 'bcrypt';
import { TRPCError } from '@trpc/server';
/* 
	Queries the most recent entries to the db,
	this is done by sorting by timestamp (foundAt) in a descending manner,
	the query filters results where foundAt < cursor, 
	it means I can paginate using the last foundAt from the last query.
	By default cursor is the largest value it can be (basically saying get all entries).
	 */
export const appRouter = trpc
	.router()
	.middleware(async ({ path, type, next }) => {
		const start = Date.now();
		const result = await next();
		const durationMs = Date.now() - start;
		result.ok
			? console.log('OK request timing:', { path, type, durationMs })
			: console.log('Non-OK request timing', { path, type, durationMs });

		return result;
	})
	.query('mostRecent', {
		input: z.object({
			limit: z.number().positive().default(6),
			cursor: z.number().nullish(),
		}),
		async resolve({ input }) {
			const db = new DB();
			await db.connect();
			// Find all servers with foundAt less than cursor
			// If no cursor was provided use a big ass number
			const blacklist = await BlacklistModel.find<Blacklist>({});
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
			filterBlackListed(items, blacklist);
			return {
				items,
				nextCursor,
			};
		},
	})
	// Show oldest entries first
	.query('history', {
		input: z.object({
			limit: z.number().positive().default(6),
			cursor: z.number().nullish(),
		}),
		async resolve({ input }) {
			const db = new DB();
			await db.connect();
			const blacklist = await BlacklistModel.find<Blacklist>({});
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
			filterBlackListed(items, blacklist);
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
			const totalCount = await FoundServerModel.estimatedDocumentCount();
			const uniqueCount = (await FoundServerModel.distinct('ip')).length;
			return { totalCount, uniqueCount };
		},
	})
	.query('search', {
		input: z.object({
			ip: z.string().regex(IP_REGEX).nullish(),
			keyword: z.string().nullish(),
			limit: z.number().positive().default(6),
			cursor: z.number().nullish(),
		}),
		async resolve({ input }) {
			const db = new DB();
			await db.connect();
			const blacklist = await BlacklistModel.find<Blacklist>({});
			let items: RawServer[] = [];
			if (!input.keyword) {
				items = await FoundServerModel.find<RawServer>({
					ip: input.ip,
					foundAt: { $lt: input.cursor ?? 0xffffffffffff },
				})
					.sort({ foundAt: -1 })
					.limit(input.limit);
			} else {
				items = await FoundServerModel.find<RawServer>({
					foundAt: { $lt: input.cursor ?? 0xffffffffffff },
					$text: { $search: input.keyword },
				})
					.sort({ foundAt: -1 })
					.limit(input.limit);
			}

			let nextCursor: typeof input.cursor | undefined = undefined;
			if (items.length >= input.limit) {
				const lastTs = items[items.length - 1].foundAt;
				nextCursor = lastTs;
			}
			filterBlackListed(items, blacklist);
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
			const db = new DB();
			await db.connect();
			const mojangURL = `https://sessionserver.mojang.com/session/minecraft/profile/${input.uuid}`;
			const blacklist = await BlacklistModel.find<Blacklist>({});
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

			let mojangName, mojangUUID, skin: string | undefined;
			try {
				// Fetch player data from mojang
				const mojangRes = await fetch(mojangURL);
				const mojangJson = await mojangRes.json();
				// Extract skin url and
				const res = parseMojangRes(mojangJson);
				// Set mojang name
				mojangName = res.mojangName;
				mojangUUID = res.mojangUUID;
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
				mojangUUID = undefined;
				skin = undefined;
			}
			const filteredServers = player.length
				? filterBlackListed(player[0].servers as string[], blacklist)
				: undefined;
			return {
				player: {
					uuid: player.length ? (player[0]._id as string) : undefined,
					name: player.length ? (player[0].name as string) : undefined,
					servers: filteredServers,
					mojangUUID,
					mojangName,
					skin,
				} as ParsedPlayer,
			};
		},
	})
	.mutation('blacklistAdd', {
		input: z.object({
			ip: z.string().regex(IP_REGEX),
			key: z.string(),
			message: z.string().default('Redacted'),
		}),
		async resolve({ input }) {
			// Authorize:
			const prefix = input.key.slice(0, 7);
			const rawKey = input.key.slice(8, input.key.length);
			// Get AuthKey using prefix
			const db = new DB();
			await db.connect();
			const item = await KeyModel.findOne<AuthKey>({ prefix });
			// If Authkey exists, hash and compare it
			const matches = item && (await bcrypt.compare(rawKey, item?.hashedKey));
			if (!matches) {
				throw new TRPCError({ code: 'UNAUTHORIZED' });
			}
			// If auth was succesful
			if (matches) {
				const bl = new BlacklistModel<Blacklist>({
					ip: input.ip,
					message: input.message === '' ? 'Redcated' : input.message,
					author: prefix,
				});
				const res = await bl.save();
				return res;
			}
		},
	});

// Export type definition of API
export type AppRouter = typeof appRouter;

// Export API handler
export default trpcNext.createNextApiHandler({
	router: appRouter,
});
