import type { Actions } from './$types';
import net from 'node:net';

export const actions = {
    print: async ({ request }) => {
        const data = await request.formData();
        const label_id = data.get("label_id");
        const qty: number = Number(data.get("qty") ?? "1");
        let label: string = "";

        switch (label_id) {
            case "frysdag":
                console.log("Printing frysdag label.");
                label = labelFrysdag(qty);
                console.log(label);
                //zplCommand(label);
                break;
            case "today":
                console.log("Printing today label.");
                label = labelToday(qty);
                console.log(label);
                zplCommand(label);
                break;
            case "experiment": 
                console.log("Experiments running");
                label = labelExperiment(qty);
                console.log(label);
                //zplCommand(label);
                break;
            default:
                console.log(`Unsupported label: ${label_id}`);
        }
    }
} satisfies Actions;

function labelExperiment(qty = 1){
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
