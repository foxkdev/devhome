<script>
	import { onMount } from 'svelte';
	import { Logger } from '$lib/utils/logger';
	import Settings from '$lib/settings';
	import Projects from '$lib/projects/projects';

	onMount(async () => {
		Logger.getInstance();
		const settings = Settings.getInstance();
		await settings.setup();
		const projects = Projects.getInstance();
		await projects.loadFromSettings();
		Logger.info('App started');
	});
</script>

<slot />
