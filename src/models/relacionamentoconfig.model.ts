export class RelacionamentoConfig {


    public femininoSerBuscado;
    public masculinoSerBuscado;

    constructor(
        public faixaFim: number,
        public faixaInicio: number,
        public feminino: boolean,
        public masculino: boolean,
        public intro: boolean,
        public ativo: boolean,

    ) { }

}