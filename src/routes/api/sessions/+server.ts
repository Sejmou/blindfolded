import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { sessions } from '$lib/server/db/schema';
import { getAudioFiles, shuffle } from '$lib/server/audio';

export const POST: RequestHandler = async () => {
	const files = getAudioFiles();
	if (files.length < 2) {
		return json(
			{ error: 'Need at least 2 audio files in the audio_takes folder' },
			{ status: 400 }
		);
	}

	const indices = files.map((_, i) => i);
	const permutation = shuffle(indices);
	const token = crypto.randomUUID();

	await db.insert(sessions).values({
		token,
		permutation: JSON.stringify(permutation)
	});

	return json({ token });
};
