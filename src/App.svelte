<script lang="ts">
	import Game from "./Game.svelte";
	import {
		enemySpawnRateMutator,
		enemySpeedMutator,
		gameTick,
		gameTimeLimit,
		playgroundRadius,
	} from "./gameStore";

	let currentlyPlaying: boolean = false;

	const startGame = () => {
		currentlyPlaying = true;
	};

	const stopGame = () => {
		currentlyPlaying = false;
	};

	const handleCloseGame = (info) => {
		if (info) {
			// submit this game
		}
		currentlyPlaying = false;
	};
</script>

<main>
	<h1>Play svelty-balls!</h1>

	{#if currentlyPlaying}
		<Game on:close={(e) => handleCloseGame(e.detail)} />
		<button on:click={stopGame}>Foreit current game.</button>
	{:else}
		<section>
			Settings: Enemy Speed Mutator:
			<input type="number" bind:value={$enemySpeedMutator} />
			Enemy Spawn Mutator:
			<input type="number" bind:value={$enemySpawnRateMutator} />
			Time Limit:
			<input type="number" bind:value={$gameTimeLimit} />
		</section>
		<button on:click={() => startGame()}>Play Game</button>
	{/if}
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}
</style>
