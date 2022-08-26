import { createReactQueryHooks } from '@trpc/react';
import type { AppRouter } from '../pages/api/trpc/[trpc]';

export type TQuery = keyof AppRouter['_def']['queries'];
export const trpc = createReactQueryHooks<AppRouter>();
