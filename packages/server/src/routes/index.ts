import { accountRouter } from './account';
import { router } from '../trpc';

export const rootRouter = router({
  account: accountRouter,
});
