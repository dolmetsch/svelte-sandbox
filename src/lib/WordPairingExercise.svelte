<script>
export let words
import audioAvailability from '../assets/audio-availability.json'

let animationInProgress = false

const shuffle = array => {
	for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
		const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
	return array
}

// const originals = shuffle(Object.keys(words))
// const translations = shuffle(Object.values(words))
const originals = Object.keys(words).sort()
const translations = Object.values(words).sort()
let guessed = {}

let originalSelected, translationSelected

$: allDone = !animationInProgress && Object.keys(guessed).length >= 2 * originals.length

$: {
	if (originalSelected && translationSelected) {
		animationInProgress = true
		if (words[originalSelected] === translationSelected) {
			guessed[originalSelected] = true
			guessed[translationSelected] = true
			if (!audioAvailability[originalSelected]) {
				setTimeout(hideAnswered, 500)
			}
		}
		else {
			if (!audioAvailability[originalSelected]) {
				setTimeout(hideAnswered, 200)
			}
		}
	}
}

const hideAnswered = () => {
	originalSelected = translationSelected = undefined
	animationInProgress = false
}
</script>

<template>

<div>
	left to guess:
	{ originals.length - (Object.keys(guessed).length / 2) }
</div>

{#if allDone}
	All Done!
	<span on:click={() => guessed = {}}>Restart?</span>
{:else}
	<div class="exercise">
		{#if originalSelected && translationSelected && audioAvailability[originalSelected]}
			<audio
				src={`/audio/${originalSelected}.mp3`}
				autoplay
				on:ended={hideAnswered}
			></audio>
		{/if}
		<div class="column originals">
		{#each originals as o}
			<div
				class:guessed="{guessed[o]}"
				class:selected="{originalSelected === o}"
				class:wrong="{translationSelected && originalSelected === o && words[originalSelected] !== translationSelected}"
				class="word"
				on:click={() => !animationInProgress && !guessed[o] && (originalSelected = originalSelected === o ? undefined : o)}
			>{o}</div>
		{/each}
		</div>

		<div class="column translations">
		{#each translations as t}
			<div
				class:guessed="{guessed[t]}"
				class:selected="{translationSelected === t}"
				class:wrong="{originalSelected && translationSelected === t && words[originalSelected] !== translationSelected}"
				class="word"
				on:click={() => !animationInProgress && !guessed[t] && (translationSelected = translationSelected === t ? undefined : t)}
			>{t}</div>
		{/each}
		</div>
	</div>
{/if}

</template>

<style>
.exercise {
	overflow: hidden;
}
	.exercise > .column {
		float: left;
	}
		.exercise > .column > .word {
			box-sizing: border-box;
			border: 1px solid rgba(255, 255, 255, 0.1);
			font-size: 2em;
			padding: 0 .5em;
			display: block;
			height: 1.5em;
			line-height: 1.5em;
			transition:
				height .5s ease-in-out .5s,
				color .5s ease-in-out .5s,
				border-width .5s ease-in-out .5s;
		}

		.exercise > .column > .word.selected {
			border-color: white;
		}

		.exercise > .column > .word.selected.wrong {
			border-color: orangered;
		}

		.exercise > .column > .word.selected.guessed,
		.exercise > .column > .word.guessed {
			border-color: greenyellow;
			border-width: 0;
			height: 0;
			color: transparent;
		}
</style>
