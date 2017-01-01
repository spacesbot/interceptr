export class Option {
    public remote_host: string;
    public remote_port: number;
    public user_key: string;
    public secret: string;

    constructor(remote_host: string, remote_port: number, user_key: string, secret: string) {
        this.remote_host = remote_host;
        this.remote_port = remote_port;
        this.user_key = user_key;
        this.secret = secret;
    }
}