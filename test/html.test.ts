import fs from "fs";
import {PDFCreate} from "../src/utils/htmlToPdf";

(async () => {

    let html = fs.readFileSync('./template.html', 'utf8');
    let options = {
        format: "A3",
        orientation: "portrait",
        border: "10mm",
        header: {
            height: "45mm",
            contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
        },
        footer: {
            height: "28mm",
            contents: {
                first: 'Cover page',
                2: 'Second page', // Any page number is working. 1-based index
                default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                last: 'Last Page'
            }
        }
    }

    let users = [
        {
            name: "Shyam",
            age: "26",
        },
        {
            name: "Navjot",
            age: "26",
        },
        {
            name: "Vitthal",
            age: "26",
        },
    ];
    const document = {
        html: html,
        data: {
            users: users,
        },
        path: "./output.pdf",
        type: "",
    };
    PDFCreate(document, options).then((res) => {
        console.log(res);
    })
        .catch((error) => {
            console.error(error);
        });


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
