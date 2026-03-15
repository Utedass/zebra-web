<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	let { form }: PageProps = $props();
</script>

Nope, this will not work. Have to make a proxy..

<hr />
<form method="POST" use:enhance>
	<input type="string" class="input" name="stringJohan" />
	<button type="submit" class="btn preset-filled">Tjoho!</button>
</form>
