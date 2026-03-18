import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { env } from '$env/dynamic/private';

const AUDIO_EXT = new Set(['.mp3', '.wav', '.m4a', '.ogg', '.webm']);

export function getAudioDir(): string {
	const dir = env.AUDIO_TAKES_DIR ?? join(process.cwd(), 'audio_takes');
	return dir;
}

export function getAudioFiles(): string[] {
	const dir = getAudioDir();
	try {
		const names = readdirSync(dir);
		return names
			.filter((name) => AUDIO_EXT.has(name.slice(name.lastIndexOf('.')).toLowerCase()))
			.sort();
	} catch {
		return [];
	}
}

export function shuffle<T>(array: T[]): T[] {
	const out = [...array];
	for (let i = out.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[out[i], out[j]] = [out[j], out[i]];
	}
	return out;
}

export function getMime(filename: string): string {
	const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();
	const mime: Record<string, string> = {
		'.mp3': 'audio/mpeg',
		'.wav': 'audio/wav',
		'.m4a': 'audio/mp4',
		'.ogg': 'audio/ogg',
		'.webm': 'audio/webm'
	};
	return mime[ext] ?? 'application/octet-stream';
}
