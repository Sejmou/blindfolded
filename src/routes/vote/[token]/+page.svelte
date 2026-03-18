<script lang="ts">
	import { base } from '$app/paths';

	let { data } = $props();
	let chosen = $state<number | null>(null);
	let voterName = $state('');
	let submitting = $state(false);
	let submitted = $state(false);
	let error = $state('');

	const token = $derived(data.token);
	const optionCount = $derived(data.optionCount);
	const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
	const labels = $derived(optionLabels.slice(0, optionCount));

	async function submit() {
		if (chosen === null) {
			error = 'Please choose which take you preferred.';
			return;
		}
		const name = voterName.trim();
		if (!name) {
			error = 'Please enter your name.';
			return;
		}

		submitting = true;
		error = '';
		try {
			const res = await fetch('/api/vote', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					token,
					chosenSlotIndex: Number(chosen),
					voterName: name
				})
			});
			const out = await res.json();
			if (!res.ok) {
				error = out.error ?? 'Something went wrong';
				return;
			}
			submitted = true;
		} catch {
			error = 'Could not submit. Try again.';
		} finally {
			submitting = false;
		}
	}
</script>

<main class="min-h-screen bg-stone-950 text-stone-100 p-4 pb-8 max-w-2xl mx-auto">
	{#if submitted}
		<div class="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
			<p class="text-2xl font-medium text-amber-400">Thanks for voting!</p>
			<p class="text-stone-400">Your response has been recorded.</p>
		</div>
	{:else}
		<header class="mb-8">
			<h1 class="text-2xl sm:text-3xl font-semibold tracking-tight">Blindfolded</h1>
			<p class="text-stone-400 mt-1">Listen to each take, then choose your favourite.</p>
		</header>

		<div class="space-y-6">
			{#each labels as label, i}
				<section class="rounded-xl bg-stone-900 border border-stone-800 p-4">
					<h2 class="text-sm font-medium text-stone-400 mb-3">Option {label}</h2>
					<audio
						controls
						preload="metadata"
						class="w-full max-w-full h-10 accent-amber-600"
						src={`${base}/api/audio/${token}/${i}`}
					></audio>
				</section>
			{/each}
		</div>

		<form
			onsubmit={(e) => {
				e.preventDefault();
				submit();
			}}
			class="mt-10 space-y-6"
		>
			<div>
				<label for="choice" class="block text-sm font-medium text-stone-300 mb-2">
					Which take did you prefer?
				</label>
				<div class="flex flex-wrap gap-3" role="group" aria-label="Choose preferred take">
					{#each labels as label, i}
						<label
							class="inline-flex items-center gap-2 cursor-pointer touch-manipulation"
						>
							<input
								type="radio"
								name="choice"
								value={i}
								bind:group={chosen}
								class="w-5 h-5 accent-amber-600 border-stone-600"
							/>
							<span class="text-stone-200">Option {label}</span>
						</label>
					{/each}
				</div>
			</div>

			<div>
				<label for="name" class="block text-sm font-medium text-stone-300 mb-2">
					Your name
				</label>
				<input
					id="name"
					type="text"
					bind:value={voterName}
					placeholder="Enter your name"
					required
					class="w-full px-4 py-3 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
					autocomplete="name"
				/>
			</div>

			{#if error}
				<p class="text-red-400 text-sm">{error}</p>
			{/if}

			<button
				type="submit"
				disabled={submitting}
				class="w-full py-4 px-6 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-stone-700 disabled:cursor-not-allowed text-white font-medium text-lg transition-colors touch-manipulation active:scale-[0.98]"
			>
				{submitting ? 'Submitting…' : 'Submit vote'}
			</button>
		</form>
	{/if}
</main>
