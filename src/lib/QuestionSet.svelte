<script>
import Question from './Question.svelte'

import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();

export let delay
export let questions
let currentQuestionIndex = 0
$: question = questions[currentQuestionIndex]

let isAnsweredCorrectly

let answeredTotal = 0
let answeredCorrectly = 0
$: percentage = answeredTotal ?
	`${Math.round(100 * answeredCorrectly / answeredTotal)}%`
	: ''

const handleChosen = event => {
	isAnsweredCorrectly = question.correctAnswerIndex === event.detail.index
	answeredTotal++
	if (isAnsweredCorrectly) {
		answeredCorrectly++
	}
	setTimeout(moveToNextQuestion, delay)
}

const moveToNextQuestion = () => {
	isAnsweredCorrectly = undefined
	currentQuestionIndex++
}

$: {
	if (currentQuestionIndex > -1 && !question) {
		dispatch('finished', {
			percentage
		})
	}
}
</script>

<main>
	
	{#if question}
	<Question
		delay={delay}
		question={question}
		on:chosen={handleChosen}
		isAnsweredCorrectly={isAnsweredCorrectly}
	/>
	<!-- {:else}
		All done! -->
	{/if}

	<!-- {#if answeredTotal}
	Correct answers: {percentage}
	{/if} -->
</main>

<style>
</style>
