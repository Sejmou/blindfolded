import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { sessions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const token = params.token;
	const [row] = await db.select().from(sessions).where(eq(sessions.token, token)).limit(1);

	if (!row) {
		throw redirect(302, '/');
	}

	const permutation = JSON.parse(row.permutation) as number[];
	return { token, optionCount: permutation.length };
};
