<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import { Button } from '$lib/components/ui/button';
	//let { form }: PageProps = $props();
</script>

<article class="prose">
	<h1>Din etikettstation i webben</h1>
</article>
Den här texten då?

<form method="POST" use:enhance>
	<!--
			<input type="string" class="input" name="stringJohan" />
			<button type="submit" class="btn preset-filled">Tjoho!</button>
			-->
	<Button variant="outline" type="submit" aria-label="Submit">Frysdag</Button>
</form>
