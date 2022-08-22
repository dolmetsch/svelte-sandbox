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
let percentage, correct, total
const delay = 200

const ws = Object.keys(words)

const addWrongOptions = (options, original) => {
	let added = 0
	const toAdd = 3
	let attempts = 0
	while (added < toAdd) {
		const randI = Math.floor(Math.random() * ws.length)
		const w = words[ws[randI]]
		if (!options.includes(w)) {
			options.push(w)
			added++
		}
		attempts++
		if (attempts >= ws.length + toAdd) {
			break
		}
	}
}

const allQuestions = shuffle(ws).map(
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

let questions = allQuestions
let wrongAnswers = []

const handleFinished = (event) => {
	finished = true
	total = event.detail.total
	correct = event.detail.correct
	percentage = event.detail.percentage
	wrongAnswers = event.detail.wrongAnswers
}

const goForWrongAnswers = () => {
	questions = wrongAnswers
	finished = false
}

const reset = () => {
	questions = shuffle(allQuestions)
	finished = false
}

$: wrongAnswersAsDict = wrongAnswers.reduce(
	(acc, q) => {
		acc[q.text] = q.options[q.correctAnswerIndex]
		return acc
	},
	{}
)

const onKeyDown = e => {
	if (!started) {
		started = true
	}
	if (finished) {
		switch (e.key) {
			case 'r':
				reset()
				break
			case 'f':
				goForWrongAnswers()
				break
		}
	}
}
</script>

<template>
{#if started }
	{#if !finished}
		<QuestionSet delay={delay} questions={questions} on:finished={handleFinished}/>
	{:else}
		All Done! {correct}/{total} {percentage}
		<span on:click={reset}>Restart?</span>
		<br/>
		
		{#if wrongAnswers.length}
			<h4>Wrong Answers:</h4>
			<span on:click={goForWrongAnswers}>Repeat with these words</span>
			<ul>
			{#each wrongAnswers as a}
				<li>{a.text} - {a.options[a.correctAnswerIndex]}</li>
			{/each}
			</ul>
			{JSON.stringify(wrongAnswersAsDict)}
		{/if}
	{/if}
{:else}
	<span>click anywhere or press any key to start</span>
{/if}
</template>

<svelte:window on:click={() => started = true} on:keydown={onKeyDown} />

<style>
</style>
