export class Avaliacao {


    public $key: string;
    constructor(
        public beleza: number,
        public simpatia: number,
        public conversa: number,
        public comentario: string,
        public premium: boolean
    ) {}

}