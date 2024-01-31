<script>
	import { onMount } from 'svelte';
	import Settings from '$lib/settings';

	onMount(async () => {
		const settings = new Settings();
		// await settings.set('projects', [{ test: 'ok' }]);
		// await settings.set('theme', 'dark');
		// await settings.remove('theme');

		await settings.loadSettings();
		const data = await settings.get('projects');
		console.log('DATA', data);
	});
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
