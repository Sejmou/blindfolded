import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { votes, sessions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { getAudioFiles } from '$lib/server/audio';

const HAS_VOTED_COOKIE = 'blindfolded_has_voted';

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export type VoteRow = {
	id: string;
	voterName: string;
	chosenSlotIndex: number;
	optionLabel: string;
	fileName: string;
	createdAt: Date;
};

export type FileCount = {
	file: string;
	count: number;
};

export const load: PageServerLoad = async ({ cookies }) => {
	if (!cookies.get(HAS_VOTED_COOKIE)) {
		throw redirect(302, '/');
	}

	const files = getAudioFiles();
	const rows = await db
		.select({
			id: votes.id,
			voterName: votes.voterName,
			chosenSlotIndex: votes.chosenSlotIndex,
			chosenFileName: votes.chosenFileName,
			createdAt: votes.createdAt,
			permutation: sessions.permutation
		})
		.from(votes)
		.innerJoin(sessions, eq(votes.sessionId, sessions.id))
		.orderBy(votes.createdAt);

	const voteRows: VoteRow[] = rows.map((r) => {
		let fileName: string;
		if (r.chosenFileName != null && r.chosenFileName !== '') {
			fileName = r.chosenFileName;
		} else {
			const permutation = JSON.parse(r.permutation) as number[];
			const fileIndex = permutation[r.chosenSlotIndex];
			fileName = files[fileIndex] ?? `file ${fileIndex}`;
		}
		return {
			id: r.id,
			voterName: r.voterName,
			chosenSlotIndex: r.chosenSlotIndex,
			optionLabel: OPTION_LABELS[r.chosenSlotIndex] ?? `Slot ${r.chosenSlotIndex}`,
			fileName,
			createdAt: r.createdAt ?? new Date()
		};
	});

	const countByFile: Record<string, number> = {};
	for (const r of voteRows) {
		countByFile[r.fileName] = (countByFile[r.fileName] ?? 0) + 1;
	}

	const allFileNames = new Set([...files, ...Object.keys(countByFile)]);
	const fileCounts: FileCount[] = [...allFileNames].sort().map((file) => ({
		file,
		count: countByFile[file] ?? 0
	}));
	const totalVotes = rows.length;
	const maxCount = fileCounts.length ? Math.max(...fileCounts.map((f) => f.count)) : 0;

	return {
		votes: voteRows,
		fileCounts,
		totalVotes,
		maxCount
	};
};
