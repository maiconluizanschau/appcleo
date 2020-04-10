import { timestamp } from 'rxjs/operator/timestamp';
export class Membros {
    grupo: String
    membro: String;
    constructor(
        public descricao: string,
        public photo: string,
        public lastMessage: string,
        public local: string,
        public timestamp: Object
    ) {}

}