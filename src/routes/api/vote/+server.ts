import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { sessions, votes } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { getAudioFiles } from '$lib/server/audio';

const HAS_VOTED_COOKIE = 'blindfolded_has_voted';
const VOTED_SESSIONS_COOKIE = 'blindfolded_voted_sessions';
const HAS_VOTED_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export const POST: RequestHandler = async ({ request, cookies }) => {
	let body: { token?: string; chosenSlotIndex?: number; voterName?: string };
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 });
	}

	const { token, chosenSlotIndex, voterName } = body;
	if (token == null || chosenSlotIndex == null || voterName == null) {
		return json(
			{ error: 'Missing token, chosenSlotIndex, or voterName' },
			{ status: 400 }
		);
	}

	const name = String(voterName).trim();
	if (!name) {
		return json({ error: 'Name is required' }, { status: 400 });
	}

	const [session] = await db.select().from(sessions).where(eq(sessions.token, token)).limit(1);
	if (!session) {
		return json({ error: 'Invalid or expired link' }, { status: 404 });
	}

	const votedSessionIds = (cookies.get(VOTED_SESSIONS_COOKIE) ?? '').split(',').filter(Boolean);
	if (votedSessionIds.includes(session.id)) {
		return json({ error: 'You have already voted for this session.' }, { status: 400 });
	}

	const permutation = JSON.parse(session.permutation) as number[];
	const slot = Number(chosenSlotIndex);
	if (!Number.isInteger(slot) || slot < 0 || slot >= permutation.length) {
		return json({ error: 'Invalid choice' }, { status: 400 });
	}

	const files = getAudioFiles();
	const fileIndex = permutation[slot];
	const chosenFileName = files[fileIndex] ?? null;

	await db.insert(votes).values({
		sessionId: session.id,
		chosenSlotIndex: slot,
		chosenFileName,
		voterName: name
	});

	const votedSessions = (cookies.get(VOTED_SESSIONS_COOKIE) ?? '')
		.split(',')
		.filter(Boolean);
	if (!votedSessions.includes(session.id)) {
		votedSessions.push(session.id);
	}

	const isSecure = process.env.NODE_ENV === 'production';
	cookies.set(HAS_VOTED_COOKIE, '1', {
		path: '/',
		httpOnly: true,
		secure: isSecure,
		sameSite: 'lax',
		maxAge: HAS_VOTED_MAX_AGE
	});
	cookies.set(VOTED_SESSIONS_COOKIE, votedSessions.join(','), {
		path: '/',
		httpOnly: true,
		secure: isSecure,
		sameSite: 'lax',
		maxAge: HAS_VOTED_MAX_AGE
	});

	return json({ success: true });
};
