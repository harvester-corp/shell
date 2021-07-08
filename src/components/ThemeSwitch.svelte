<script>
	let night = localStorage.getItem('night') === 'true';
	if (night) {
		document.body.classList.toggle('dark-mode');
		for (let a of document.getElementsByTagName('a')) {
			a.classList.toggle('dark-mode');
		}
	}

	function toggle() {
		document.body.classList.toggle('dark-mode');
		for (let a of document.getElementsByTagName('a')) {
			a.classList.toggle('dark-mode');
		}
		night = !night;
		localStorage.setItem('night', String(night));
	}
</script>

<div class="day-night">
	{#if night}
		<button on:click={toggle}>
			<span>🌚 Night Mode</span>
		</button>
	{:else}
		<button on:click={toggle}>
			<span>🌞 Day Mode</span>
		</button>
	{/if}
</div>

<style>
	button {
		background-color: #f76027;
		color: white;
		border: none;
		border-radius: 4px;
		padding: 0.5rem;
		text-transform: uppercase;
	}

	:global(body.dark-mode) button {
		background-color: #0084f6;
		color: white;
	}

	.day-night button {
		padding: 0.2rem 0.8rem 0.3rem 0.4rem;
		border-radius: 14px;
		cursor: pointer;
	}
</style>
