<script lang="ts">
	let loading = $state(false);
	let error = $state('');

	async function getLink() {
		loading = true;
		error = '';
		try {
			const res = await fetch('/api/sessions', { method: 'POST' });
			const data = await res.json();
			if (!res.ok) {
				error = data.error ?? 'Something went wrong';
				return;
			}
			window.location.href = `/vote/${data.token}`;
		} catch {
			error = 'Could not create your link. Try again.';
		} finally {
			loading = false;
		}
	}
</script>

<main class="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-center p-4">
	<div class="max-w-md w-full text-center space-y-8">
		<h1 class="text-3xl sm:text-4xl font-semibold tracking-tight">Blindfolded</h1>
		<p class="text-stone-400 text-lg">
			Listen to two or more takes. Choose the one you prefer. You won’t know which is which.
		</p>
		<button
			onclick={getLink}
			disabled={loading}
			class="w-full py-4 px-6 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-stone-700 disabled:cursor-not-allowed text-white font-medium text-lg transition-colors touch-manipulation active:scale-[0.98]"
		>
			{loading ? 'Creating your link…' : 'Get my voting link'}
		</button>
		{#if error}
			<p class="text-red-400 text-sm">{error}</p>
		{/if}
	</div>
</main>
