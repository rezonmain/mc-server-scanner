import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';

export const appRouter = trpc.router().query('greet', {
	input: z.object({ text: z.string().nullish() }).nullish(),
	resolve({ input }) {
		return {
			greeting: `Hello ${input?.text || 'world'}`,
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
