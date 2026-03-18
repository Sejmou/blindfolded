<script lang="ts">
	import { base } from '$app/paths';

	let { data } = $props();

	const votes = $derived(data.votes);
	const fileCounts = $derived(data.fileCounts);
	const totalVotes = $derived(data.totalVotes);
	const maxCount = $derived(data.maxCount);

	function formatDate(d: Date): string {
		return new Date(d).toLocaleString(undefined, {
			dateStyle: 'short',
			timeStyle: 'short'
		});
	}

	function barWidth(count: number): string {
		if (maxCount <= 0) return '0%';
		return `${(count / maxCount) * 100}%`;
	}
</script>

<svelte:head>
	<title>Evaluate votings – Blindfolded</title>
</svelte:head>

<main class="min-h-screen bg-stone-950 text-stone-100 p-4 pb-8 max-w-4xl mx-auto">
	<header class="mb-8 flex items-center justify-between gap-4 flex-wrap">
		<div>
			<h1 class="text-2xl sm:text-3xl font-semibold tracking-tight">Voting results</h1>
			<p class="text-stone-400 mt-1">Who voted for what and option comparison.</p>
		</div>
		<a
			href={base || '/'}
			class="text-sm text-amber-400 hover:text-amber-300 transition-colors"
		>
			← Back
		</a>
	</header>

	{#if totalVotes === 0}
		<div class="rounded-xl bg-stone-900 border border-stone-800 p-8 text-center text-stone-400">
			<p>No votes yet. Share a voting link to collect responses.</p>
		</div>
	{:else}
		<!-- Bar chart: votes per file -->
		<section class="mb-10">
			<h2 class="text-lg font-medium text-stone-200 mb-4">Votes per file</h2>
			<div class="rounded-xl bg-stone-900 border border-stone-800 p-6">
				<div class="space-y-4">
					{#each fileCounts as { file, count }}
						<div class="flex items-center gap-4">
							<span
								class="min-w-0 max-w-48 truncate text-stone-300 font-medium text-sm"
								title={file}
							>
								{file}
							</span>
							<div class="flex-1 min-w-0">
								<div
									class="h-8 rounded-md bg-amber-600/90 transition-[width] duration-500 min-w-8 flex items-center justify-end pr-2"
									style="width: {barWidth(count)}"
									role="img"
									aria-label="{file}: {count} votes"
								>
									{#if count > 0}
										<span class="text-xs font-medium text-amber-950">{count}</span>
									{/if}
								</div>
							</div>
							<span class="w-10 text-right text-stone-400 text-sm tabular-nums shrink-0">
								{count}
							</span>
						</div>
					{/each}
				</div>
				<p class="mt-3 text-sm text-stone-500">Total votes: {totalVotes}</p>
			</div>
		</section>

		<!-- Table: who voted for what -->
		<section>
			<h2 class="text-lg font-medium text-stone-200 mb-4">Who voted for what</h2>
			<div class="rounded-xl border border-stone-800 overflow-hidden">
				<table class="w-full text-left border-collapse">
					<thead>
						<tr class="bg-stone-900/80 border-b border-stone-800">
							<th
								class="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider"
							>
								Voter
							</th>
							<th
								class="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider"
							>
								Option
							</th>
							<th
								class="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider"
							>
								File
							</th>
							<th
								class="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider"
							>
								Date
							</th>
						</tr>
					</thead>
					<tbody>
						{#each votes as vote}
							<tr class="border-b border-stone-800/80 hover:bg-stone-900/50 transition-colors">
								<td class="px-4 py-3 text-stone-200">{vote.voterName}</td>
								<td class="px-4 py-3">
									<span
										class="inline-flex items-center justify-center w-8 h-8 rounded-md bg-stone-800 text-amber-400 font-medium"
									>
										{vote.optionLabel}
									</span>
								</td>
								<td class="px-4 py-3 text-stone-300 text-sm font-mono">
									{vote.fileName}
								</td>
								<td class="px-4 py-3 text-stone-400 text-sm">
									{formatDate(vote.createdAt)}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>
	{/if}
</main>
