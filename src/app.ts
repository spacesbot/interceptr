
import { Option } from './common/models/option';
const socketIo = require("socket.io");
const socketIoClient = require('socket.io-client');
const request = require('request');

class Interceptr {
    private options: Option;
    private server: any;
    private io: any;

    private static instance: Interceptr;

    constructor() {
        if (Interceptr.instance) {
            throw new Error("Error: Instantiation failed: Use Actions.getInstance() instead of new.");
        }
        Interceptr.instance = this;
    }

    /**
     * Get instance method for singleton
     */
    public static getInstance(): Interceptr {
        if (!Interceptr.instance) {
            Interceptr.instance = new Interceptr();
        }

        return Interceptr.instance;
    }

    public configure(app: any, options: Option, socket: any): Interceptr {
        this.server = app;
        this.options = options;
        this.sockets(socket);

        return this;
    }
   
    // Send message
    private sendFbWebook(webhook: any): void {
        this.io.to("myroom").emit("fbWebhook", webhook);
    }

    // Configure sockets
    private sockets(socket: any): void {
        // Get socket.io handle
        this.io = socketIo(this.server);
        this.listenFbWebhookMessage(socket);

        this.io.on("connection", (s: any) => {
            console.log("connected");

            s.join("myroom", (error: any) => {
                console.log("ERROR JOINING ROOM");
            });
            // this.listenFbWebhookMessage(s);
        });
    }

    private listenFbWebhookMessage(s: any) {
        s.on("fbWebhook", (message: any) => {
            console.log("fb webhook Message: " + message);
            request({
                url: this.options.local_host + ":" + this.options.local_port + "/" + message.endpoint,
                method: 'POST',
                json: message.body

            }, function (error: any, response: any, body: any) {
                if (error) {
                    console.log('Error sending messages: ', error)
                } else if (response.body.error) {
                    console.log('Error: ', response.body.error)
                }
            })
        });
    }

    private hasClientConnected(): boolean {
        return this.io.connected !== undefined;
    }

    public handler(req: any, res: any, next: any) {
        if (Interceptr.getInstance()) {
            const response: any = {
                body: req.body,
                endpoint: req.url
            }
            Interceptr.getInstance().sendFbWebook(response);
        }


        next();
    }

}

export const interceptr = (app: any, options: Option): any => {
    const socket = socketIoClient(options.remote_host + options.remote_port ? ":" + options.remote_port : "");
    socket.on("connected", (m: any) => {
        console.log("connected to " + options.remote_port);
        console.log(JSON.stringify(m));
    });
    return Interceptr.getInstance().configure(app, options, socket);
} 