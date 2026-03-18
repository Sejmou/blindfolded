import { createReadStream } from 'node:fs';
import { Readable } from 'node:stream';
import { join } from 'node:path';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { sessions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { getAudioDir, getAudioFiles, getMime } from '$lib/server/audio';

export const GET: RequestHandler = async ({ params }) => {
	const token = params.token;
	const slot = parseInt(params.slot, 10);

	const [row] = await db.select().from(sessions).where(eq(sessions.token, token)).limit(1);
	if (!row) {
		return new Response('Invalid or expired link', { status: 404 });
	}

	const files = getAudioFiles();
	const permutation = JSON.parse(row.permutation) as number[];
	if (slot < 0 || slot >= permutation.length) {
		return new Response('Invalid slot', { status: 400 });
	}

	const fileIndex = permutation[slot];
	if (fileIndex >= files.length) {
		return new Response('File not found', { status: 404 });
	}

	const filename = files[fileIndex];
	const filepath = join(getAudioDir(), filename);
	const mime = getMime(filename);

	try {
		const stream = createReadStream(filepath);
		const webStream = Readable.toWeb(stream) as ReadableStream;
		return new Response(webStream, {
			headers: {
				'Content-Type': mime,
				'Cache-Control': 'private, no-cache'
			}
		});
	} catch {
		return new Response('File not found', { status: 404 });
	}
};
