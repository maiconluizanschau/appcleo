export class MessageGroup {
    public key: string
    constructor(
        public userId: string,
        public text: string,
        public timestamp: any,
        public grupo: string,
        public nameUserEnviou: string
    ) {}

}