import { db } from '@/db/drizzle';
import { accountSchema, insertAccountSchema } from '@/db/schema';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createId } from '@paralleldrive/cuid2';

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
  );
