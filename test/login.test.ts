import {JsonDB, Config} from 'node-json-db';
import PDFMerger from 'pdf-merger-js';
import fs from "fs";

(async () => {

    const db = new JsonDB(new Config("jsonDB", true, false, '/'));
    const data = await db.getData("/users");
    // console.log(data)

    let arr = fs.readdirSync("./file");
    const merger = new PDFMerger();
    const files = arr.filter(val => val.includes('13911773803'))
    for (const fileName of files) {
        await merger.add("./file/" + fileName)
    }

    await merger.save('merged1.pdf');
})()


// module.exports = {
//     apps: [{
//         name: "walletconnect-bridge",
//         script: "/data/node_site/walletconnect_bridge/web3-walltconnect-bridge/lib/app.js",
//         error_file: "./err.log",
//         out_file: "./out.log"
//     }]
// }

//
// pm2 install pm2-logrotate
//
// pm2 set pm2-logrotate:max_size 1K (1KB)
//
// pm2 set pm2-logrotate:compress true (compress logs when rotated)
