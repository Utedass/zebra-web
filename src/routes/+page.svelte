<script lang="ts">
	import { enhance } from '$app/forms';
	//import type { PageProps } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Slider } from '$lib/components/ui/slider';
	import * as Card from '$lib/components/ui/card';
	//let { form }: PageProps = $props();

	let qty = $state(1);

	const etiketter = [
		{ display: 'Frysdag', label_id: 'frysdag' },
		{ display: 'Dagens datum bara', label_id: 'today' },
		{ display: 'Jonatan + nummer', label_id: 'jonatan' },
		{ display: 'Isabelle + nummer', label_id: 'isabelle' }
		//{ display: 'Experiment', label_id: 'experiment' }
	];
</script>

<Card.Root class="mx-auto mt-2 max-w-60">
	<Card.Header>
		<Card.Title>Etikett med vett!</Card.Title>
		<Card.Description>Din etikettstation i webben</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="flex flex-col gap-6">
			<p>
				Antal etiketter: <span class="text-right font-bold">{qty}</span>
			</p>
			<Slider class="" type="single" bind:value={qty} min={1} max={10} />

			<div class="flex flex-col gap-2">
				{#each etiketter as etikett (etikett.label_id)}
					<form method="POST" action="?/print" use:enhance>
						<!--
		<input type="string" class="input" name="stringJohan" />
		<button type="submit" class="btn preset-filled">Tjoho!</button>
		-->
						<input type="hidden" name="label_id" value={etikett.label_id} />
						<input type="hidden" name="qty" value={qty} />
						<Button class="w-full" variant="outline" type="submit" aria-label="Submit"
							>{etikett.display}</Button
						>
					</form>
				{/each}
			</div>
		</div>
	</Card.Content>
</Card.Root>
