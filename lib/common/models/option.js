"use strict";
class Option {
    constructor(remote_host, remote_port, local_host, local_port, user_key, secret) {
        this.remote_host = remote_host;
        this.remote_port = remote_port;
        this.user_key = user_key;
        this.secret = secret;
        this.local_host = local_host;
        this.local_port = local_port;
    }
}
exports.Option = Option;
//# sourceMappingURL=option.js.map