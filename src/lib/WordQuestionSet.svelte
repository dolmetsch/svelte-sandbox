<script>
import QuestionSet from './QuestionSet.svelte'
export let words
import audioAvailability from '../assets/audio-availability.json'

const shuffle = array => {
	for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
		const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
	return array
}

let started = false
let finished = false
let percentage
const delay = 200

const ws = Object.keys(words)

const addWrongOptions = (options, original) => {
	let added = 0
	const toAdd = 3
	while (added < toAdd) {
		const randI = Math.floor(Math.random() * ws.length)
		const w = words[ws[randI]]
		if (!options.includes(w)) {
			options.push(w)
			added++
		}
	}
}

const questions = shuffle(ws).map(
	original => {
		const translation = words[original]
		const options = [translation]
		addWrongOptions(options, original)
		shuffle(options)
		const correctAnswerIndex = options.indexOf(translation)
		return {
			text: original,
			correctAnswerIndex,
			options,
			hasAudio: audioAvailability[original]
		}
	},
)

const handleFinished = (event) => {
	finished = true
	percentage = event.detail.percentage
}
</script>

<template>
{#if started }
	{#if !finished}
		<QuestionSet delay={delay} questions={questions} on:finished={handleFinished}/>
	{:else}
		All Done! {percentage}
		<span on:click={() => finished = false}>Restart?</span>
	{/if}
{:else}
	<span on:click={() => started = true}>click to start</span>
{/if}
</template>

<style>
</style>
