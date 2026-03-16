<script lang="ts">
	import { enhance } from '$app/forms';
	//import type { PageProps } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Slider } from '$lib/components/ui/slider';
	//let { form }: PageProps = $props();

	let qty = $state(1);

	const etiketter = [
		{ display: 'Frysdag', label_id: 'frysdag' },
		{ display: 'Dagens datum bara', label_id: 'today' }
	];
</script>

<article class="prose">
	<h1>Din etikettstation i webben</h1>
</article>

<div class="flex-col max-w-50">
	Antal etiketter: {qty}
	<Slider type="single" bind:value={qty} min={1} max={10} />
</div>

{#each etiketter as etikett (etikett.label_id)}
	<form method="POST" action="?/print" use:enhance>
		<!--
		<input type="string" class="input" name="stringJohan" />
		<button type="submit" class="btn preset-filled">Tjoho!</button>
		-->
		<input type="hidden" name="label_id" value={etikett.label_id} />
		<input type="hidden" name="qty" value={qty} />
		<Button variant="outline" type="submit" aria-label="Submit">{etikett.display}</Button>
	</form>
{/each}
