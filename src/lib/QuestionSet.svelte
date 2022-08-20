<script>
import Question from './Question.svelte'

import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();

export let delay
export let questions
let currentQuestionIndex = 0
$: question = questions[currentQuestionIndex]

let isAnsweredCorrectly
let answerGiven = false
const wrongAnswers = []

let answeredTotal = 0
let answeredCorrectly = 0
$: percentage = answeredTotal ?
	`${Math.round(100 * answeredCorrectly / answeredTotal)}%`
	: ''

const handleChosen = event => {
	isAnsweredCorrectly = question.correctAnswerIndex === event.detail.index
	if (!answerGiven) {
		answeredTotal++
		if (isAnsweredCorrectly) {
			answeredCorrectly++
			setTimeout(moveToNextQuestion, delay)
		} else {
			wrongAnswers.push(question)
		}
		answerGiven = true
	} else {
		if (isAnsweredCorrectly) {
			setTimeout(moveToNextQuestion, delay)
		}
	}
}

const moveToNextQuestion = () => {
	isAnsweredCorrectly = undefined
	currentQuestionIndex++
	answerGiven = false
}

$: {
	if (currentQuestionIndex > -1 && !question) {
		dispatch('finished', {
			percentage,
			wrongAnswers,
			total: answeredTotal,
			correct: answeredCorrectly,
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
