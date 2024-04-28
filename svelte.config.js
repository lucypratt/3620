import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess({})],

	kit: {
        appDir: 'app', // Required as the default is _app
        adapter: adapter(),
		paths: {
            base: dev ? '' : process.env.BASE_PATH,
        }
    }
};

export default config;
