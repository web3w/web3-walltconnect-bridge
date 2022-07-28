import {createApp, getIPAdress} from "./src/index";

const start = async () => {
    try {
        const port = 5001
        const host = getIPAdress()
        const app = createApp()
        await app.listen({
            port,
            host
        })
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

start()
