import { GroupsConfiguracaoService } from './../../providers/groups/groups';
import { RoleConfig } from './../../models/roleconfig.model';
import { RoleConfiguracaoService } from './../../providers/roleconfig/roleconfig';
import { ConversaConfig } from './../../models/conversaconfig.model';
import { ConversaConfiguracaoService } from './../../providers/conversaconfig/conversaconfig';
import { LoginPage } from './../login/login';
import { Config } from './../../models/config.model';
import { Component } from '@angular/core';
import { Loading, LoadingController, NavController, NavParams, AlertController } from 'ionic-angular';
import { FirebaseObjectObservable, AngularFireDatabase } from "angularfire2/database";


import { AuthService } from "../../providers/auth/auth";
import { ConfiguracaoService } from './../../providers/configuracao/configuracao';
//compartilhamento 
import { SocialSharing } from '@ionic-native/social-sharing';
import { UserService } from '../../providers/user/user';
import { User } from '../../models/user.models';
import { ModalPage } from '../modal/modal';
//email
import { EmailComposer } from '@ionic-native/email-composer';
import 'rxjs/Rx';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { InfoamizadePage } from '../infoamizade/infoamizade';
import { InfogroupPage } from '../infogroup/infogroup';

@Component({
    selector: 'page-config',
    templateUrl: 'config.html'
})
export class ConfigPage {

    private listConfig: FirebaseObjectObservable<Config>;
    private listaConversaConfig: FirebaseObjectObservable<ConversaConfig>;
    private listaRoleConfig: FirebaseObjectObservable<RoleConfig>;
    public rangeObject: any = { lower: 18, upper: 60 };
    



    toggleStatusH: boolean;
    toggleStatusM: boolean;
    toggleStatusHBuscado: boolean;
    toggleStatusMBuscado: boolean;
    toggleStatusRelacao: boolean;
    genero: string;
    loading: Loading;
    toggleStatusArLivre: boolean;
    toggleStatusBar: boolean;
    toggleStatusCafe: boolean;
    toggleStatusCinema: boolean;
    toggleStatusLeitura: boolean;
    toggleStatusRestaurante: boolean;
    toggleStatusConversa: boolean;
    toggleStatusRole: boolean;
    toggleStatusBalada: boolean;
    toggleStatusShow: boolean;
    toggleStatusComer: boolean;
    toggleStatusBeber: boolean;
    toggleStatusEsporte: boolean;
    toggleStatusAcademia: boolean;
    idUser: string;
    //email
   // subject='';
    body='';
   // to='';    

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public db: AngularFireDatabase,
        public authService: AuthService,
        public loadingCtrl: LoadingController,
        public ConfigService: ConfiguracaoService,
        public conversaConfigService: ConversaConfiguracaoService,
        public alertCtrl: AlertController,
        public userService: UserService,
        public configService: ConfiguracaoService,
        public ConfiguracaoService: ConversaConfiguracaoService,
        public roleConfiguracaoService: RoleConfiguracaoService,
        public groupsConfiguracaoService: GroupsConfiguracaoService,
        //convite
        private sharingVar: SocialSharing,
        //email
        private emailComposer: EmailComposer,

    ) {
        this.loading = this.showLoading();
        this.buscaIdUser();
    }

    private buscaIdUser() {
        this.userService.currentUser
          .first()
          .subscribe((currentUser: User) => {
            this.idUser = currentUser.$key;
          });
      }

    //PAGINA DE DESCRIÇAO DAS CONFIGURAÇÔES
    public info(tipo: number) {
        this.navCtrl.push(ModalPage)
    }


    
    //PAGINA DE DESCRIÇAO DAS CONFIGURAÇÔES
    public amizade(tipo: number) {
        this.navCtrl.push(InfoamizadePage)
    }
//PAGINA DE DESCRIÇAO DAS CONFIGURAÇÔES
public grupo(tipo: number) {
    this.navCtrl.push(InfogroupPage)
}

    //VERIFICAÇÂO SE SER ESTA LOGADO
    ionViewCanEnter(): Promise<boolean> {

        return this.authService.authenticated;
        //this.buscaPreConfiguracoes();
    }


    ionViewWillEnter() {
        this.buscaPreConfiguracoes();
    }

    private faixa(range: any) {
        console.log("ENTRO: " + range.lower);
        this.ConfigService.gravaFaixa(range);
    }

    otherShare() {
        this.sharingVar.share("Parabéns, 😃 você acabou de ser convidado(a) para baixar ao aplicativo da CLEO", null/*Subject*/, null/*File*/, "cleoapp.com.br")
            .then(() => {
                   alert("Success");
            },
                () => {
                alert("Um Erro Ocorreu! Tente Mais tarde, se o problema persistir entre em contato com o suporte!")
                })
        //console.log("Adicionar grupos..."); 
        //this.Create_Group();
    }
    //fim convite


    //FAZER BUSCA DAS CONFIGURAÇÕES JÁ SALVAS NO BD
    private buscaPreConfiguracoes() {
        this.listConfig = this.ConfigService.buscaConfig();
        this.listConfig.first()
            .subscribe((config: Config) => {
                this.toggleStatusH = config.masculino;//envia para view
                this.toggleStatusM = config.feminino;
                this.rangeObject.lower = config.faixaInicio;
                this.rangeObject.upper = config.faixaFim;
                this.toggleStatusHBuscado = config.masculinoSerBuscado;
                this.toggleStatusMBuscado = config.femininoSerBuscado;
                this.toggleStatusRelacao = config.relacaoSerBuscado;
            });
        this.listaConversaConfig = this.conversaConfigService.buscaConversaConfigMostrar();
        this.listaConversaConfig.first()
            .subscribe((config: ConversaConfig) => {
                this.toggleStatusConversa = config.conversaSerBuscado;//envia para view
                this.toggleStatusBar = config.bar;
                this.toggleStatusCafe = config.cafe;
                this.toggleStatusCinema = config.cinema;
                this.toggleStatusArLivre = config.arlivre;
                this.toggleStatusLeitura = config.leitura;
                this.toggleStatusRestaurante = config.restaurante;
            });
        this.listaRoleConfig = this.roleConfiguracaoService.buscaRoleConfigMostrar();
        this.listaRoleConfig.first()
            .subscribe((config: RoleConfig) => {
                this.toggleStatusRole = config.roleSerBuscado;//envia para view
                this.toggleStatusBalada = config.balada;
                this.toggleStatusShow = config.show;
                this.toggleStatusComer = config.comer;
                this.toggleStatusBeber = config.beber;
                this.toggleStatusAcademia = config.academia;
                this.toggleStatusEsporte = config.esporte;
            });
        //BUSCA DO GENERO    
        this.userService.currentUser
            .first()
            .subscribe((currentUser: User) => {
                this.genero = currentUser.genero;
                if (this.genero == "Masculino" || this.genero == "Outros") {
                    //this.toggleStatusM = false;

                }
            });

        this.loading.dismiss(); //tira o carregando...
    }

    //ENVIANDO A ESCOLHA TIPO HOMEM
    private Change_Toggle_Homens(bval: boolean) {
        let genero = "Mas";
        this.ConfigService.gravaInteresse(bval, genero);
    }

    //ENVIANDO A ESCOLHA TIPO MULHER
    private Change_Toggle_Mulheres(bval: boolean) {
        let genero = "Fem";
        this.ConfigService.gravaInteresse(bval, genero);
    }

    //ENVIANDO A ESCOLHA TIPO CONVERSA
    private Change_Toggle_Conversa(bval: boolean, tipo: string) {
        //let tipo = "Conversa";
        if(tipo === 'conversa' && bval === true){
            this.toggleStatusConversa = true;
            this.toggleStatusRelacao = false;
            this.toggleStatusRole = false;
        }
        this.conversaConfigService.gravaInteresseConversa(bval, tipo, this.idUser);
    }

    //ENVIANDO A ESCOLHA TIPO CONVERSA
    private Create_Group() {
        this.groupsConfiguracaoService.createGroup();
    }

    //ENVIANDO A ESCOLHA TIPO RELAÇÃO
    private Change_Toggle_Relacao(bval: boolean, tipo: string) {
        //let tipo = "Conversa";
        if(tipo === 'relacao' && bval === true){
            this.toggleStatusConversa = false;
            this.toggleStatusRelacao = true;
            this.toggleStatusRole = false;
        }
        this.configService.gravaInteresse(bval, tipo);
    }

    //ENVIANDO A ESCOLHA TIPO ROLE
    private Change_Toggle_Role(bval: boolean, tipo: string) {
        //let tipo = "Conversa";
        if(tipo === 'role' && bval === true){
            this.toggleStatusConversa = false;
            this.toggleStatusRelacao = false;
            this.toggleStatusRole = true;
        }
        this.roleConfiguracaoService.gravaInteresseRole(bval, tipo);
    }

    //ENVIANDO A ESCOLHA TIPO MULHER
    private Change_Toggle_Mulheres_Buscado(bval: boolean) {
        let genero = "Fem";
        this.ConfigService.gravaInteresseSerBuscado(bval, genero);
    }

    //ENVIANDO A ESCOLHA TIPO HOMEM
    private Change_Toggle_Homens_Buscado(bval: boolean) {
        let genero = "Mas";
        this.ConfigService.gravaInteresseSerBuscado(bval, genero);
    }

    //ENVIANDO A ESCOLHA TIPO ATIVO/PASSSIVO
    /**private Change_Toggle_AtivoPasssivo(atv: boolean) {
        console.log("->" + atv);
        if (this.genero == "Masculino" || this.genero == "Outros") {
            if (atv == true) {
                this.toggleStatusM = false;//desabilita toggle mulher
                this.configService.gravaAtivo(atv);
                let genero = "Fem";
                this.configService.gravaInteresse(false, genero);
            }
            else if (atv == false) {
                this.configService.gravaAtivo(atv);
            }
        } else if ("Feminino") {
            if (atv == true) {
                this.configService.gravaAtivo(atv);
            }
            else if (atv == false) {
                this.configService.gravaAtivo(atv);
            }
        } 

    } **/

    //MOSTRA MENSAGEM DE AGUARDE...
    private showLoading(): Loading {
        let loading: Loading = this.loadingCtrl.create({
            content: 'Aguarde...'
        });
        //mostra carregamento pagina
        loading.present();
        return loading;
    }

    //SAIR DO APP APAGANDO
    private logout() {
        const alert = this.alertCtrl.create({
            title: 'Logout',
            message: 'Você deseja sair do Aplicativo?',
            buttons: [
                {
                    text: 'NÂO',
                },
                {
                    text: 'SIM',
                    handler: () => {
                        this.authService.logout();
                        this.navCtrl.setRoot(LoginPage);
                    }
                }
            ]
        });
        alert.present();
    }

    //DELETAR CONTA
    private deleteConta() {
        const alert = this.alertCtrl.create({
            title: 'Confirmação',
            message: 'Você deseja deletar essa conta?',
            buttons: [
                {
                    text: 'NÃO',
                },
                {
                    text: 'SIM',
                    handler: () => {
                        this.authService.deletarConta(this.authService.getUid())
                        this.navCtrl.setRoot(LoginPage);
                    }
                }
            ]
        });
        alert.present();
    }

    private problema() {
        let prompt = this.alertCtrl.create({
            title: 'Enviar problema',
            message: "Informe o problema que você encontrou.",
            inputs: [
                {
                    name: 'descricao',
                    placeholder: 'Descrição'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Enviar',
                    handler: data => {
                        console.log('Saved clicked');
                    }
                }
            ]
        });
        prompt.present();

    }

   //enviar email
    enviaEmail(){
        let email ={
          to: 'contato@cleoapp.com.br',
          cc:[],
          bcc:[],
          attachment:[],
          subject: 'Problema Aplicativo CLEO',
          body: this.body,
          isHtml: false,
          app:"Gmail"
        }
        this.emailComposer.open(email);
      }
}