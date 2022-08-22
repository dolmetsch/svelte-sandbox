<script>
import WordQuestionSet from './lib/WordQuestionSet.svelte'
import WordPairingExercise from './lib/WordPairingExercise.svelte'
import AntonymsExercise from './lib/AntonymsExercise.svelte'
import audioAvailability from './assets/audio-availability.json'
import words from './assets/words.js'

const pair = (acc, value, index) => {
	if (index % 2 == 0) {
		acc.push([value])
	} else {
		acc[acc.length - 1].push(value)
	}
	return acc
}
const pairs = Object.keys(words).reduce(pair, [])

const missingAudio = Object.keys(words).filter(w => !audioAvailability[w])
</script>

<main>
	<!-- {#each missingAudio as w }
		{w}<br>
	{/each} -->

	<WordQuestionSet words={words}/>
	<!-- <WordPairingExercise words={words}/> -->
	<!-- <AntonymsExercise words={words} pairs={pairs}/> -->
</main>

<style>
</style>
