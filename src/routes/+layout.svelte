<script>
	import { onMount } from 'svelte';
	import Settings from '$lib/settings';
	import Projects from '$lib/projects';

	onMount(async () => {
		const settings = Settings.getInstance();
		const projects = Projects.getInstance();
		projects.loadFromSettings();
		// await settings.set('projects', [{ test: 'ok' }]);
		// await settings.set('theme', 'dark');
		// await settings.remove('theme');

		// await settings.loadSettings();
		// const data = await settings.get('projects');
		// console.log('DATA', data);
	});
</script>

<slot />
