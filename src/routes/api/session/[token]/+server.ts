import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { sessions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params }) => {
	const token = params.token;
	const [row] = await db.select().from(sessions).where(eq(sessions.token, token)).limit(1);

	if (!row) {
		return json({ error: 'Invalid or expired link' }, { status: 404 });
	}

	const permutation = JSON.parse(row.permutation) as number[];
	return json({ optionCount: permutation.length });
};
