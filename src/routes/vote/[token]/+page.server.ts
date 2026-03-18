import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { sessions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

const VOTED_SESSIONS_COOKIE = 'blindfolded_voted_sessions';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const token = params.token;
	const [row] = await db.select().from(sessions).where(eq(sessions.token, token)).limit(1);

	if (!row) {
		throw redirect(302, '/');
	}

	const votedSessionIds = (cookies.get(VOTED_SESSIONS_COOKIE) ?? '').split(',').filter(Boolean);
	if (votedSessionIds.includes(row.id)) {
		throw redirect(302, '/evaluate');
	}

	const permutation = JSON.parse(row.permutation) as number[];
	return { token, optionCount: permutation.length };
};
