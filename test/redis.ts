import Redis from 'ioredis';
import config from "../src/config"

(async () => {

    // "redis://:authpassword@127.0.0.1:6380/4"
    // redis://:WLRRSx5n4oShW9@8.210.21.224:6379/3
    const client = new Redis(config.redis)
    //     url: 'redis://:WLRRSx5n4oShW9@47.243.110.52:6379/3'
    // });

    // clien('error', (err) => console.log('Redis Client Error', err));
    await client.set("foo131", "valu11e","EX",3);

    const foo =await client.lrange(``, 0, -1)
    console.log(foo)
    // await client.set('key', 'value');

    //
    // const cl = await client.connect()
    // console.log(cl)

    // await client.set('key', 'value', {
    //     EX: 10,
    //     NX: true
    // });
})()
