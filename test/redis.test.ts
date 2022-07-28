import Redis from 'ioredis';
import {redisCfg} from "../src/config/index.json"

(async () => {
    const client = new Redis(redisCfg)

    // await client.set("foo131", "valu11e","EX",3);

    const foo = await client.lrange(`sssss`, 0, -1)
    console.log(foo)

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
