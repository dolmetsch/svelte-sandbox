<script>
export let words
export let pairs
import audioAvailability from '../assets/audio-availability.json'

let translationSelected, originalSelected
let guessed = {}

$: {
	if (translationSelected && originalSelected) {
		if (words[originalSelected] === translationSelected) {
			guessed[translationSelected] = originalSelected
		}
		if (!audioAvailability[originalSelected]) {
			resetSelection()
		}
	}
}

const shuffle = array => {
	for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
		const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
	return array
}

const originals = shuffle(Object.keys(words))

const resetSelection = () => {
	translationSelected = originalSelected = undefined
}
</script>

<template>

{#if originalSelected && translationSelected}
<audio
	src={`/audio/${originalSelected}.mp3`}
	autoplay
	on:ended={resetSelection}
></audio>
{/if}

<div class="exercise">
	<div class="columns">
		<div class="column left">
			{#each pairs.map(p => words[p[0]]) as t}
				<div class="pair">
					<div
						class="translation"
						class:selected={translationSelected === t}
						on:click={() => translationSelected = t}
					>{t}</div>
					{#if guessed[t]}
						<div class="original">{guessed[t]}</div>
					{/if}
				</div>
			{/each}
		</div>
		<div class="column right">
			{#each pairs.map(p => words[p[1]]) as t}
				<div class="pair">
					{#if guessed[t]}
						<div class="original">{guessed[t]}</div>
					{/if}
					<div
						class="translation"
						class:selected={translationSelected === t}
						on:click={() => translationSelected = t}
					>{t}</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="list">
		{#each originals as w}
			<span
				class:used={Object.values(guessed).includes(w)}
				class:selected={originalSelected === w}
				class="original"
				on:click={() => originalSelected = w}
			>{w}</span>
		{/each}
	</div>
</div>

</template>

<style>
.exercise {
	overflow: hidden;
	font-size: 1.5em;
}

.selected {
	border-color: white !important;
}

	.exercise > .columns {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}
		.exercise > .columns > .column {
		}
			.exercise > .columns > .column > .pair {
			}
				.exercise > .columns > .column > .pair > .translation {
					display: inline-block;
					padding: .5em;
					margin: .25em;
					border: 1px solid rgba(255, 255, 255, 0.1)
				}
				.exercise > .columns > .column > .pair > .original {
					display: inline-block;
					padding: .5em;
					margin: .25em;
					border: 1px solid rgba(255, 255, 255, 0.1)
				}
	.exercise > .list {
		clear: both;
		margin-top: 1em;
	}
		.exercise > .list > .original {
			display: inline-block;
			margin: .25em;
			padding: .5em;
			border: 1px solid rgba(255, 255, 255, 0.1)
		}
			.exercise > .list > .original.used {
				opacity: 0.2;
			}
</style>