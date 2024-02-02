<script>
	import { onMount } from 'svelte';
	import Settings from '$lib/settings';

	onMount(async () => {
		const settings = new Settings();
	});
</script>

<slot />
