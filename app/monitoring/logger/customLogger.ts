/** @format */


import Transport from 'winston-transport';
import { Logs } from '../local';
import { producer } from "@/streaming";


export default class customTransport extends Transport {
    constructor(opts: any) {
        super(opts);
    }

    log(info: any, callback: any) {
        const correlationId = producer.publish(
            "MERN_TEMPLATE_API_LOGGER",
            () => Promise.resolve(info[Symbol.for("message")])
        ).catch(error => Logs.error("Custom Transport Error:", error));
        
        callback();
    }
}