import type { PageServerLoad } from './$types';

const HAS_VOTED_COOKIE = 'blindfolded_has_voted';

export const load: PageServerLoad = async ({ cookies }) => {
	return {
		hasVoted: !!cookies.get(HAS_VOTED_COOKIE)
	};
};
