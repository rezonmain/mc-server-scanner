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
	.query('mostRecent', {
		input: z.object({ limit: z.number() }).default({ limit: 5 }),
		async resolve({ input }) {
			const db = new DB();
			await db.connect();
			const res = await FoundServerModel.find<RawServer>({})
				.sort({
					foundAt: -1,
				})
				.limit(input?.limit);
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
