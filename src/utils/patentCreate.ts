import fs from "fs";

import {PDFCreate} from "./htmlToPdf";


export async function patentCreate(template: string, id: string, scores: any[]) {
    let html = fs.readFileSync(template, 'utf8');
    let options = {
        format: "A4",
        orientation: "portrait",
        border: "10mm",
        type: "pdf",
        timeout: 30000
        // header: {
        //     height: "8mm",
        //     contents: '<div style="text-align: center;">Author: CIC</div>'
        // },
        // footer: {
        //     height: "8mm",
        //     contents: {
        //         first: 'Cover page',
        //         2: 'Second page', // Any page number is working. 1-based index
        //         default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
        //         last: 'Last Page'
        //     }
        // }
    }


    const document = {
        html: html,
        data: {
            scores
        },
        path: "./file/" + id + '.pdf',
        type: "pdf",
    };
    return PDFCreate(document, options)


}
