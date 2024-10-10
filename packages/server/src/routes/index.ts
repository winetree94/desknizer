import { accountRouter } from '../routes/account';
import { router } from '../trpc';

export const rootRouter = router({
  account: accountRouter,
});
