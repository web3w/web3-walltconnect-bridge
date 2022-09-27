import fs from "fs";
import {patentCreate} from "../src/utils/patentCreate";

(async () => {
    const scores = [{
        id: "201610140712.2",
        name: "一种信道状态信息的反馈方法及装置",
        "xjx": 30,
        "kxx": 10,
        "yyx": 30,
        "flx": 30,
        "score": 100
    }, {
        id: "201610140712.2",
        name: "一种信道状态信息的反馈方法及装置",
        "xjx": 30,
        "kxx": 10,
        "yyx": 30,
        "flx": 30,
        "score": 100
    }]
    const path = await patentCreate("./src/utils/template.html", "sdsd", scores)
    console.log("Path", path)
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
