import { db } from '@/db/drizzle';
import { accountSchema, insertAccountSchema } from '@/db/schema';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { and, eq, inArray } from 'drizzle-orm';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';

export const accountsRoutes = new Hono()
  .get('/', clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: 'unauthorized' }, 401);
    }

    const data = await db
      .select({ id: accountSchema.id, name: accountSchema.name })
      .from(accountSchema)
      .where(eq(accountSchema.userId, auth.userId));

    return c.json({ data }, 200);
  })
  .get(
    '/:id',
    clerkMiddleware(),
    zValidator(
      'param',
      z.object({
        id: z.string().optional(),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid('param');

      if (!id) {
        return c.json({ error: 'Missing id' }, 400);
      }

      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json({ error: 'unauthorized' }, 401);
      }

      const [data] = await db
        .select({
          id: accountSchema.id,
          name: accountSchema.name,
        })
        .from(accountSchema)
        .where(
          and(eq(accountSchema.userId, auth.userId), eq(accountSchema.id, id)),
        );

      if (!data) {
        return c.json({ error: 'Not found' }, 404);
      }

      return c.json({ data });
    },
  )
  .post(
    '/',
    clerkMiddleware(),
    zValidator('json', insertAccountSchema.pick({ name: true })),
    async (c) => {
      const values = c.req.valid('json');

      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json({ error: 'unauthorized' }, 401);
      }

      const [data] = await db
        .insert(accountSchema)
        .values({
          id: createId(),
          userId: auth.userId,
          ...values,
        })
        .returning();

      return c.json({ data }, 201);
    },
  )
  .post(
    '/bulk-delete',
    clerkMiddleware(),
    zValidator('json', z.object({ ids: z.array(z.string()) })),
    async (c) => {
      const values = c.req.valid('json');

      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json({ error: 'unauthorized' }, 401);
      }

      const data = await db
        .delete(accountSchema)
        .where(
          and(
            eq(accountSchema.userId, auth.userId),
            inArray(accountSchema.id, values.ids),
          ),
        )
        .returning({ id: accountSchema.id });

      return c.json({ data });
    },
  )
  .patch(
    '/:id',
    clerkMiddleware(),
    zValidator(
      'param',
      z.object({
        id: z.string().optional(),
      }),
    ),
    zValidator('json', insertAccountSchema.pick({ name: true })),
    async (c) => {
      const { id } = c.req.valid('param');
      const values = c.req.valid('json');

      if (!id) {
        return c.json({ error: 'Missing id' }, 400);
      }

      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json({ error: 'unauthorized' }, 401);
      }

      const [data] = await db
        .update(accountSchema)
        .set(values)
        .where(
          and(eq(accountSchema.userId, auth.userId), eq(accountSchema.id, id)),
        )
        .returning();

      if (!data) {
        return c.json({ error: 'Not found' }, 404);
      }

      return c.json({ data });
    },
  )
  .delete(
    '/:id',
    clerkMiddleware(),
    zValidator(
      'param',
      z.object({
        id: z.string().optional(),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid('param');

      if (!id) {
        return c.json({ error: 'Missing id' }, 400);
      }

      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json({ error: 'unauthorized' }, 401);
      }

      const [data] = await db
        .delete(accountSchema)
        .where(
          and(eq(accountSchema.userId, auth.userId), eq(accountSchema.id, id)),
        )
        .returning({ id: accountSchema.id });

      if (!data) {
        return c.json({ error: 'Not found' }, 404);
      }

      return c.json({ data });
    },
  );
