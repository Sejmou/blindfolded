import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { sessions, votes } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
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

	const permutation = JSON.parse(session.permutation) as number[];
	const slot = Number(chosenSlotIndex);
	if (!Number.isInteger(slot) || slot < 0 || slot >= permutation.length) {
		return json({ error: 'Invalid choice' }, { status: 400 });
	}

	await db.insert(votes).values({
		sessionId: session.id,
		chosenSlotIndex: slot,
		voterName: name
	});

	return json({ success: true });
};
