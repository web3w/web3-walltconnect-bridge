import Fastify, {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import fastifyStatic from '@fastify/static';
import PDFMerger from 'pdf-merger-js';
import fs from "fs";
import path from 'path'
import pkg from '../package.json'
import {JsonDB, Config} from 'node-json-db';
import {patentCreate} from "./utils/patentCreate";
import {userSign} from "./utils/sign";


// The first argument is the database filename. If no extension, '.json' is assumed and automatically added.
// The second argument is used to tell the DB to save after each push
// If you put false, you'll have to call the save() method.
// The third argument is to ask JsonDB to save the database in an human readable format. (default false)
// The last argument is the separator. By default it's slash (/)
const db = new JsonDB(new Config("jsonDB", true, false, '/'));


export const getIPAdress = () => {
    let interfaces = require('os').networkInterfaces()
    for (let devName in interfaces) {
        let iface = interfaces[devName]
        for (let i = 0; i < iface.length; i++) {
            let alias = iface[i]
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address
            }
        }
    }
    return "0.0.0.0"
}

export const createApp = () => {
    const app = Fastify({
        logger: true
    })

    //require('@fastify/static')
    app.register(fastifyStatic, {
        root: path.join(__dirname, '../file'),
        prefix: "/file/"
    })

    //@ts-ignore
    app.register(helmet)
    //@ts-ignore
    app.register(cors)

    app.post('/login', async (req: FastifyRequest, res: FastifyReply) => {
        if (!req.body || typeof req.body !== 'object') {
            res.status(400).send({
                message: 'Error: missing or invalid request body'
            })
        }
        let result = {success: false, data: {}}
        // @ts-ignore
        const {name, pwd, phone} = req.body


        if (name && pwd) {
            const data = await db.getData("/users");
            const user = Object.values(data).find((val: any) => val.name == name && val.pwd == pwd)
            if (user) {
                result.success = true
                result.data = user as any
            }
        }
        res.status(200).send(result)
    })

    app.get('/hello', (req: FastifyRequest, res: FastifyReply) => {
        res.status(200).send(`Hello World, this is WalletConnect v${pkg.version}`)
    })

    app.get('/info', (req: FastifyRequest, res: FastifyReply) => {
        res.status(200).send({
            name: pkg.name,
            description: pkg.description,
            version: pkg.version
        })
    })


    app.post('/patent', async (req: FastifyRequest, res: FastifyReply) => {
        if (!req.body || typeof req.body !== 'object') {
            res.status(400).send({
                message: 'Error: missing or invalid request body'
            })
        }
        //patentName, indexAdvanced, indexFeasible, indexApplicable, indexLegal
        // @ts-ignore
        const {id, phone, score} = req.body

        const data = await db.getData("/patents");

        const patent = data[id];

        patent.scores[phone] = score

        await db.push("/patents/" + id, patent);
        const sign = userSign[phone]
        const scores = [{id: id, name: patent.name, sign, ...score}]
        //Object.values(patent.scores).map((val: any) => ({id: id, name: patent.name, sign, ...val}))

        const path: any = await patentCreate("./src/utils/template.html", phone + "." + patent.index + "." + id, scores.filter(val => val.score))

        const last = path.filename.lastIndexOf("/")

        res.status(200).send({
            success: true,
            data: path.filename.substr(last)
        })
    })

    app.get('/patent', async (req: FastifyRequest, res: FastifyReply) => {

        // try something exceptional here
        let result = {success: false, data: []}
        if (req.query) {
            // tslint:disable-next-line:no-multi-spaces
            const data = await db.getData("/patents");

            // @ts-ignore
            const {phone, id} = req.query
            if (phone && id) {
                const patent = data[id]
                //ts-ignore
                const score = patent.scores[phone]
                result = {
                    success: true,
                    data: {path: "/" + phone + "." + patent.index + "." + id + ".pdf", ...score}
                }
            }
        }
        res.status(200).send(result)
    })

    //
    app.get('/patents', async (req: FastifyRequest, res: FastifyReply) => {
        try {
            // try something exceptional here
            let result = {success: false, data: {}}
            if (req.query) {
                // tslint:disable-next-line:no-multi-spaces
                const data = await db.getData("/patents");

                // @ts-ignore
                const {id} = req.query
                if (id) {
                    const patent = data[id]
                    if (!patent) throw 'patent'
                    // const sign = userSign[phone]
                    const phones = Object.keys(patent.scores)
                    const scores = phones.map((phone: any) => ({
                        id: id,
                        name: patent.name,
                        sign: userSign[phone],
                        ...patent.scores[phone]
                    }))
                    const prints = scores.filter((val: any) => val.score)
                    if (!prints.length) throw 'prints'
                    // const path: any = await patentCreate("./src/utils/template.html", id, prints)
                    // patent.path = path.filename
                    result = {success: true, data: patent}
                } else {
                    const patentIds = Object.keys(data)
                    const patents = patentIds.map(val => (
                        {
                            id: val,
                            index: data[val].index,
                            name: data[val].name,
                            projectId: data[val].projectId
                        }))
                    result = {success: true, data: patents}
                }
            }
            res.status(200).send(result)
        } catch (error) {
            res.status(200).send({success: false, data: {}})
        }
    })

    app.get('/user', async (req: FastifyRequest, res: FastifyReply) => {
        try {
            // try something exceptional here
            let result = {success: false, data: []}
            if (req.query) {
                // tslint:disable-next-line:no-multi-spaces
                const users = await db.getData("/users");

                // @ts-ignore
                const {name, phone} = req.query
                if (phone || typeof phone === 'string') {
                    const user = users[phone]
                    let arr = fs.readdirSync("./file");
                    const merger = new PDFMerger();
                    const files = arr.filter(val => val.includes(phone))
                    if (files.length > 0) {
                        for (const fileName of files) {
                            await merger.add("./file/" + fileName)
                        }
                        const project = await db.getData("/projects");
                        const fileName = "./file/user/" + project.name + user.name + '.pdf'
                        await merger.save(fileName);
                        user.path = fileName.substr(1)
                    }

                    user.sign = userSign[phone]
                    result = {success: true, data: user}
                }
                // result = {success: true, data: patent}

            }

            res.status(200).send(result)
        } catch (error) {
            res.status(400)
        }
    })

    app.ready(() => {
        console.log("API Ready")
    })

    return app
}





