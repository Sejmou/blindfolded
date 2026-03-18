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

<main class="mx-auto min-h-screen max-w-4xl bg-stone-950 p-4 pb-8 text-stone-100">
	<header class="mb-8 flex flex-wrap items-center justify-between gap-4">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">Voting results</h1>
			<p class="mt-1 text-stone-400">Who voted for what and option comparison.</p>
		</div>
		<a href={base || '/'} class="text-sm text-amber-400 transition-colors hover:text-amber-300">
			← Back
		</a>
	</header>

	{#if totalVotes === 0}
		<div class="rounded-xl border border-stone-800 bg-stone-900 p-8 text-center text-stone-400">
			<p>No votes yet. Share a voting link to collect responses.</p>
		</div>
	{:else}
		<!-- Bar chart: votes per file -->
		<section class="mb-10">
			<h2 class="mb-4 text-lg font-medium text-stone-200">Votes per file</h2>
			<div class="rounded-xl border border-stone-800 bg-stone-900 p-6">
				<div class="space-y-4">
					{#each fileCounts as { file, count }}
						<div class="flex items-center gap-4">
							<span
								class="max-w-48 min-w-0 truncate text-sm font-medium text-stone-300"
								title={file}
							>
								{file}
							</span>
							<div class="min-w-0 flex-1">
								<div
									class="flex h-8 min-w-8 items-center justify-end rounded-md bg-amber-600/90 pr-2 transition-[width] duration-500"
									style="width: {barWidth(count)}"
									role="img"
									aria-label="{file}: {count} votes"
								>
									{#if count > 0}
										<span class="text-xs font-medium text-amber-950">{count}</span>
									{/if}
								</div>
							</div>
							<span class="w-10 shrink-0 text-right text-sm text-stone-400 tabular-nums">
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
			<h2 class="mb-4 text-lg font-medium text-stone-200">Who voted for what</h2>
			<div class="overflow-hidden rounded-xl border border-stone-800">
				<table class="w-full border-collapse text-left">
					<thead>
						<tr class="border-b border-stone-800 bg-stone-900/80">
							<th class="px-4 py-3 text-xs font-medium tracking-wider text-stone-500 uppercase">
								Voter
							</th>
							<th class="px-4 py-3 text-xs font-medium tracking-wider text-stone-500 uppercase">
								Option
							</th>
							<th class="px-4 py-3 text-xs font-medium tracking-wider text-stone-500 uppercase">
								File
							</th>
							<th class="px-4 py-3 text-xs font-medium tracking-wider text-stone-500 uppercase">
								Date
							</th>
						</tr>
					</thead>
					<tbody>
						{#each votes as vote}
							<tr class="border-b border-stone-800/80 transition-colors hover:bg-stone-900/50">
								<td class="px-4 py-3 text-stone-200">{vote.voterName}</td>
								<td class="px-4 py-3">
									<span
										class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-stone-800 font-medium text-amber-400"
									>
										{vote.optionLabel}
									</span>
								</td>
								<td class="px-4 py-3 font-mono text-sm text-stone-300">
									{vote.fileName}
								</td>
								<td class="px-4 py-3 text-sm text-stone-400">
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
