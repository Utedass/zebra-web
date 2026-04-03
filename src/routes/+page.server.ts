import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import net from 'node:net';

export const actions = {
	print: async ({ request }) => {
		const data = await request.formData();
		const label_id = data.get('label_id');
		const qty: number = Number(data.get('qty') ?? '1');
		let label: string = '';

		switch (label_id) {
			case 'frysdag':
				console.log('Printing frysdag label.');
				label = labelFrysdag(qty);
				break;
			case 'today':
				console.log('Printing today label.');
				label = labelToday(qty);
				break;
			case 'jonatan':
				console.log('Printing jonatan label.');
				label = labelJonatan(qty);
				break;
			case 'isabelle':
				console.log('Printing isabelle label.');
				label = labelIsabelle(qty);
				break;
			case 'experiment':
				// Keep for experimenting with label generation
				console.log('Experiments running');
				label = labelExperiment(qty);
				console.log(label);
				//zplCommand(label);
				return { success: true };
			case 'success':
				console.log('Experiments running, success');
				return { success: true };
			case 'fail':
				console.log('Experiments running, fail');
				return fail(400, { fail: true, error: 'Error text goes here' });
			default:
				console.log(`Unsupported label: ${label_id}`);
				return fail(404, { fail: true, error: 'Label does not exist' });
		}

		console.log(label);
		const ok = await zplCommand(label);

		console.log(`Retunerat från utskrift ${ok}`);

		if (!ok) {
			return fail(503, { fail: true, error: 'Kunde inte skriva ut etiketten' });
		}

		return { success: true };
	}
} satisfies Actions;

function labelExperiment(qty = 1) {
	const zplCommand = `
^XA
^PQ${qty}
^FO50,50
^A0N,40,40
^FDTEST^FS
^XZ
`;
	return zplCommand;
}

function labelFrysdag(qty = 1) {
	const now = new Date();
	const timestring = now.toISOString().slice(0, 10); // "YYYY-MM-DD"

	const zplCommand = `
^XA
^PQ${qty}
^LH16,8
^FO100,15
^AB,20
^FDFrysdag^FS
^FO50,50
^A0,40
^FD${timestring}^FS
^LH0,0
^XZ
`;
	return zplCommand;
}

function labelToday(qty = 1) {
	const now = new Date();
	const timestring = now.toISOString().slice(0, 10); // "YYYY-MM-DD"

	const zplCommand = `
CT~~CD,~CC^~CT~
^XA
~TA000
~JSN
^LT8
^MNW
^MTT
^PON
^PMN
^LH0,0
^JMA
^PR6,6
~SD19
^JUS
^LRN
^CI27
^PA0,1,1,0
^XZ

^XA
^PQ${qty}
^MMT
^PW330
^LL102
^LS0
^FPH,8
^FT25,64
^A0N,39,38
^FH\\
^CI28
^FD${timestring}
^FS
^CI27
^XZ
`;
	return zplCommand;
}

function labelJonatan(qty: number) {
	return labelTwoline('Jonatan Gezelius', '+46 (0)73-58 48 690', qty);
}

function labelIsabelle(qty: number) {
	return labelTwoline('Isabelle Fägerman', '+46 (0)73-316 35 80', qty);
}

function labelTwoline(firstLine: string, secondLine: string, qty: number) {
	const zplCommand = `
CT~~CD,~CC^~CT~
^XA
~TA000
~JSN
^LT8
^MNW
^MTT
^PON
^PMN
^LH0,0
^JMA
^PR6,6
~SD19
^JUS
^LRN
^CI27
^PA0,1,1,0
^XZ

^XA
^PQ${qty}
^MMT
^PW330
^LL102
^LS0
^FT5,40^A0N,31,30^FB325,1,8,C^FH\\^CI28^FD${firstLine}\\5C&^FS^CI27
^FT5,79^A0N,31,30^FB325,1,8,C^FH\\^CI28^FD${secondLine}\\5C&^FS^CI27
^XZ

`;
	return zplCommand;
}

function zplCommand(zplCommand: string) {
	const printerHost = 'd6j235201761.home.arpa';
	const printerPort = 9100;

	return new Promise((resolve) => {
		let success = false;
		let done = false;
		const client = new net.Socket();

		const timeout = setTimeout(() => {
			if (!done) {
				console.error('Operation timed out');
				client.destroy();
				resolve(false);
			}
		}, 1500);

		client.connect(printerPort, printerHost, () => {
			console.log('Connected to printer!');
			client.write(zplCommand, 'utf8', () => {
				console.log('Sent ZPL to printer!');
				success = true;
				done = true;
				clearTimeout(timeout);
				client.end();
			});
		});

		client.on('error', (err: Error) => {
			console.error('Connection failed:', err);
			success = false;
			done = true;
			clearTimeout(timeout);
		});

		client.on('close', () => {
			console.log('Connection closed');
			done = true;
			clearTimeout(timeout);
			resolve(success);
		});
	});
}
