<script lang="ts">
	import { untrack } from 'svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import { Slider } from '$lib/components/ui/slider';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Card from '$lib/components/ui/card';
	import type { PageProps } from './$types';
	import Check from '@lucide/svelte/icons/check';
	let { form }: PageProps = $props();

	let qty = $state(1);
	let keepQty = $state(false);

	const now = new Date();
	const timestring = now.toISOString().slice(0, 10); // "YYYY-MM-DD"

	const etiketter = [
		{ display: `Frysdag <br /> ${timestring}`, label_id: 'frysdag' },
		{ display: `${timestring}`, label_id: 'today' },
		{ display: 'Jonatan Gezelius <br /> +46 (0)73-58 48 690', label_id: 'jonatan' },
		{ display: 'Isabelle Fägerman <br /> +46 (0)73-316 35 80', label_id: 'isabelle' },
		{ display: 'Missing label', label_id: 'asdf' },
		{ display: 'Lyckad toaster!', label_id: 'success' },
		{ display: 'Misslyckad toaster!', label_id: 'fail' }
		//{ display: 'Experiment', label_id: 'experiment' }
	];

	$effect(() => {
		if (form?.fail) {
			toast.error(form?.error);
			if (form?.qty) {
				qty = form.qty;
			}
		}
	});

	$effect(() => {
		if (form?.success) {
			toast.success('Etikett utskriven!');
			console.log(`form?.qty: ${form?.qty}`);
			if (untrack(() => keepQty) && form?.qty) {
				qty = Number(form.qty);
			} else {
				qty = 1;
			}
		}
	});
</script>

<Card.Root class="mx-auto mt-2 max-w-80">
	<Card.Header>
		<Card.Title>Etikett med vett!</Card.Title>
		<Card.Description>Din etikettstation i webben</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="flex flex-col gap-6">
			<p>
				Antal etiketter: <span class="text-right font-bold">{qty}</span>
			</p>
			<Slider class="h-8" type="single" bind:value={qty} min={1} max={10} />
			<label class="flex gap-5">
				Behåll antal <Checkbox bind:checked={keepQty} />
			</label>

			<div class="flex flex-col gap-2">
				{#each etiketter as etikett (etikett.label_id)}
					<form method="POST" action="?/print" use:enhance>
						<input type="hidden" name="label_id" value={etikett.label_id} />
						<input type="hidden" name="qty" value={qty} />
						<Button class="w-full py-7" variant="outline" type="submit" aria-label="Submit"
							>{@html etikett.display}</Button
						>
					</form>
				{/each}
			</div>
		</div>
	</Card.Content>
</Card.Root>
