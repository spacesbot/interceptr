"use strict";
const option_1 = require('./common/models/option');
const socketIo = require("socket.io");
const socketIoClient = require('socket.io-client');
const request = require('request');
class Interceptr {
    constructor() {
        this.Option = option_1.Option;
        if (Interceptr.instance) {
            throw new Error("Error: Instantiation failed: Use Actions.getInstance() instead of new.");
        }
        Interceptr.instance = this;
    }
    static getInstance() {
        if (!Interceptr.instance) {
            Interceptr.instance = new Interceptr();
        }
        return Interceptr.instance;
    }
    configure(app, options, socket) {
        this.server = app;
        this.options = options;
        this.sockets(socket);
        return this;
    }
    sendFbWebook(webhook) {
        this.io.to("myroom").emit("fbWebhook", webhook.body);
    }
    sockets(socket) {
        this.io = socketIo(this.server);
        this.listenFbWebhookMessage(socket);
        this.io.on("connection", (s) => {
            console.log("connected");
            s.join("myroom", (error) => {
                console.log("ERROR JOINING ROOM");
            });
        });
    }
    listenFbWebhookMessage(s) {
        s.on("fbWebhook", (message) => {
            console.log("fb webhook Message: " + message);
            request({
                url: "http://localhost:3000/",
                method: 'POST',
                json: message.body
            }, function (error, response, body) {
                if (error) {
                    console.log('Error sending messages: ', error);
                }
                else if (response.body.error) {
                    console.log('Error: ', response.body.error);
                }
            });
        });
    }
    hasClientConnected() {
        return this.io.connected !== undefined;
    }
    handler(req, res, next) {
        if (Interceptr.getInstance()) {
            const response = {
                body: req.body,
                endpoint: req.url
            };
            Interceptr.getInstance().sendFbWebook(response);
        }
        next();
    }
}
exports.interceptr = (app, options) => {
    const socket = socketIoClient(options.remote_host + ":" + options.remote_port);
    this.Option = Interceptr.getInstance().Option;
    socket.on("connected", (m) => {
        console.log("connected to " + options.remote_port);
        console.log(JSON.stringify(m));
    });
    return Interceptr.getInstance().configure(app, options, socket);
};
//# sourceMappingURL=app.js.map