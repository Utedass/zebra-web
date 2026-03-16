import type { Actions } from './$types';
import net from 'node:net';

export const actions = {
    print: async ({ request }) => {
        const data = await request.formData();
        const label_id = data.get("label_id");
        const qty: number = Number(data.get("qty") ?? "1");

        switch (label_id) {
            case "frysdag":
                console.log("Printing frysdag label.");
                console.log(labelFrysdag(qty));
                zplCommand(labelFrysdag());
                break;
            case "today":
                console.log("Printing today label.");
                console.log(labelToday(qty));
                zplCommand(labelToday());
                break;
            default:
                console.log(`Unsupported label: ${label_id}`);
        }
    }
} satisfies Actions;


function labelFrysdag(num = 1) {
    const now = new Date();
    const timestring = now.toISOString().slice(0, 10); // "YYYY-MM-DD"

    const zplCommand = `
^XA
^LH16,8
^FO100,15
^AB,20
^FDFrysdag^FS
^FO50,50
^A0,40
^FD${timestring}^FS
^LH0,0
^PQ${num}
^XZ
`;
    return zplCommand;
}

function labelToday(num = 1) {
    const now = new Date();
    const timestring = now.toISOString().slice(0, 10); // "YYYY-MM-DD"

    const zplCommand = `
^XA
^LH16,8
^FO50,50
^A0,40
^FD${timestring}^FS
^LH0,0
^PQ${num}
^XZ
`;
    return zplCommand;
}


function zplCommand(zplCommand: string) {
    const printerHost = 'd6j235201761.home.arpa';
    const printerPort = 9100;

    const client = new net.Socket();

    client.connect(printerPort, printerHost, () => {
        console.log('Connected to printer!');
        client.write(zplCommand, 'utf8', () => {
            console.log('Sent ZPL to printer!');
            client.end();
        });
    });

    client.on('error', (err: any) => {
        console.error('Connection failed:', err);
    });

    client.on('close', () => {
        console.log('Connection closed');
    });
}
