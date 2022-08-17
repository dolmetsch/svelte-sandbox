import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'
import yaml from 'vite-plugin-yaml'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
	svelte({
		preprocess: [sveltePreprocess({ typescript: true })]
	}),
	yaml,
  ]
})
