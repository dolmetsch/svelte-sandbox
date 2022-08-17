<template>

<h4 on:click={playAudio} class:has-audio={question.hasAudio}>{question.text}</h4>
{#if question.hasAudio}
	<audio bind:this={audio} src={`/audio/${question.text}.mp3`} autoplay></audio>
{/if}

<ul>
{#each question.options as option, index}
	<li
		on:click={() => chooseIndex(index)}
		class:chosen="{chosenIndex === index}"
		class:correct="{chosenIndex === index && isAnsweredCorrectly !== undefined && isAnsweredCorrectly}"
		class:incorrect="{chosenIndex === index && isAnsweredCorrectly !== undefined && !isAnsweredCorrectly}"
	>
		<span class="index">{index+1}:</span>
		<span class="value">{option}</span>
	</li>
{/each}
</ul>

<svelte:window on:keydown={onKeyDown} />
</template>


<script>

import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();

let audio

export let delay
export let question
export let isAnsweredCorrectly
let chosenIndex = -1

const chooseIndex = (index) => {
	chosenIndex = index
	dispatch('chosen', { index })
}

$: {
	if (isAnsweredCorrectly !== undefined) {
		setTimeout(() => chosenIndex = - 1, delay)
	}
}

const onKeyDown = e => {
	if (e.key <= question.options.length && e.key >= '1') {
		chooseIndex(parseInt(e.key) - 1)
		e.preventDefault()
	}
}

const playAudio = () => {
	question.hasAudio && audio && audio.play()
}

</script>


<style lang="stylus">
h4
	font-size 3em

.has-audio
	cursor pointer
	text-decoration underline

ul
	padding 0
	margin 0

	li
		list-style none
		border 1px solid gray
		font-size 2em
		padding .25em
		border-radius .5em
		margin 0
		margin-bottom .5em
		padding-left 3em
		position relative

		> .index
			position absolute
			left .5em
			top .25em
			bottom .25em
			opacity 0.5

		&.chosen
			border-color white
			&.correct
				border-color green
			&.incorrect
				border-color red
</style>