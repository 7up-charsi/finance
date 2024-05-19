import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { accountsRoutes } from './accounts';
import { categoriesRoutes } from './categories';
import { transactionsRoutes } from './transactions';

export const runtime = 'edge';

const app = new Hono().basePath('/api');

const routes = app
  .route('/accounts', accountsRoutes)
  .route('/categories', categoriesRoutes)
  .route('/transactions', transactionsRoutes);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
