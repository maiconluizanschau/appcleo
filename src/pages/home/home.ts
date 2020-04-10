import { Chat } from './../../models/chat.model';
import { Membros } from './../../models/membros.models';
import { Groups } from './../../models/groups.model';
import { GroupsConfiguracaoService } from './../../providers/groups/groups';
import { RoleConfiguracaoService } from './../../providers/roleconfig/roleconfig';
import { ConversaConfiguracaoService } from './../../providers/conversaconfig/conversaconfig';
import { ConversaConfig } from './../../models/conversaconfig.model';
import { FlertPage } from './../flert/flert';
import { Http } from '@angular/http';
import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';

import { User } from './../../models/user.models';
import { Config } from '../../models/config.model';
import { Flert } from '../../models/flert.model';
import { Chatsecret } from '../../models/chatsecret.model';

import { UserService } from './../../providers/user/user';
import { AuthService } from './../../providers/auth/auth';
import { ConfiguracaoService } from './../../providers/configuracao/configuracao';
import { MatchService } from '../../providers/match/match';
import { ChatService } from '../../providers/chat/chat';

import { IntroPage } from '../intro/intro';
import { ChatListPage } from '../chat_list/chat_list';
import { ChatSecretoPage } from '../chat-secreto/chat-secreto';

import { SwingStackComponent } from 'angular2-swing/dist/swing-stack-component';
import { FirebaseObjectObservable, FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database';
import { SwingCardComponent } from 'angular2-swing/dist/swing-card-component';
import { StackConfig } from 'angular2-swing/dist/swing';

import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { NavController, AlertController, Loading, LoadingController, ModalController, List } from 'ionic-angular';
import 'rxjs/Rx';
import * as firebase from 'firebase/app';
import { Voto } from '../../models/voto.model';

import { Observable } from 'rxjs';
import { ChatSecretService } from '../../providers/chatsecret/chatsecret';
import { RoleConfig } from '../../models/roleconfig.model';


@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    like: FirebaseObjectObservable<any>;
    view: FirebaseObjectObservable<any>;
    flerts: boolean;
    card = [];
    votos: FirebaseListObservable<any[]>;
    user: User;
    grupo: Groups;
    users: FirebaseListObservable<User[]>;
    groups: FirebaseListObservable<Groups[]>;
    acabou: boolean = false;
    acabouUserAmizade: boolean = false;
    acabouGrupo: boolean = false;
    grupoRole: boolean = false;
    tipoConversa: string;
    loading: Loading;
    new_match: boolean = false;
    userLogado: User;
    userMatch: User;
    usersconversas: FirebaseListObservable<User[]>;
    conversaMostrar: FirebaseObjectObservable<ConversaConfig>;
    relacaoMostrar: FirebaseObjectObservable<Config>;
    roleMostrar: FirebaseObjectObservable<RoleConfig>;
    roleFalse: boolean;
    conversaFalse: boolean;
    relacionamentoFalse: boolean;
    idUser: string;
    constructor(
        public authService: AuthService,
        public navCtrl: NavController,
        public userService: UserService,
        public alertCtrl: AlertController,
        public confService: ConfiguracaoService,
        public conversaConfig: ConversaConfiguracaoService,
        public roleConfig: RoleConfiguracaoService,
        public groupsService: GroupsConfiguracaoService,
        public matchService: MatchService,
        public chatService: ChatService,
        private toastCtrl: ToastController,
        private configService: ConfiguracaoService,
        public af: AngularFireDatabase,
        public chatSecretService: ChatSecretService,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController,
        
    ) {
        this.new_match = false;
        this.idUser = this.authService.getUid();
    }


    //VERIFICAR SE TA LOGADO
    ionViewCanEnter(): Promise<boolean> {
        return this.authService.authenticated;
    }

    ionViewWillEnter() {
        
        this.loading = this.showLoading();
        //VERIFICAR O QUE O USUÃ�RIO BUSCA  //CONVERSA RELACAO OU ROLE
        this.confService
           .buscaConfig()
            .first()
            .subscribe((config: Config) => {
                if (config.intro === true) {
                    this.navCtrl.setRoot(IntroPage);
                    this.loading.dismiss(); //tira o carregando...
                }
                else if (config.intro === false) {
                    this.loading.dismiss(); //tira o carregando...
                    this.buscaInteresseMostrar();
                }
            });
        
        
    }

    //VERIFICAR O QUE O USUÃ�RIO BUSCA  //CONVERSA RELACAO OU ROLE
    public buscaInteresseMostrar(){

        this.relacaoMostrar = this.confService.buscaRelacaoConfigMostrar();
        this.relacaoMostrar.forEach(relacao => {
            if(relacao.relacaoSerBuscado === true)
            {
                this.relacionamentoFalse = false;
                this.tipoConversa = "Relacionamento";
                this.getOneUser();
            }else{
                this.relacionamentoFalse = true;
            }  
        });    
           
        this.conversaMostrar = this.conversaConfig.buscaConversaConfigMostrar();     
        this.conversaMostrar.forEach(conversa => {
            if(conversa.conversaSerBuscado === true)
            {
                this.conversaFalse = false;
                this.tipoConversa = "Amizade";
                this.getHomeConversaTipo();
            }else{
                this.conversaFalse = true;
            }   
        });

        this.roleMostrar = this.roleConfig.buscaRoleConfigMostrar();
        this.roleMostrar.forEach(role => {
            if(role.roleSerBuscado === true)
            {
                this.roleFalse = false;
                this.tipoConversa = "Grupo";
                this.getHomeRole();
            }else{
                this.roleFalse = true;
            }
        }); 
        
    }


    //BUSCA CONFIG INICIAL PARA CONVERSA
    public getHomeConversaTipo() {
        this.conversaConfig
            .buscaConversaConfig()  //recebe dados sobre o nÃ³ conversa
            .first()
            .subscribe((config: ConversaConfig) => {
                if (config.conversaSerBuscado === false) {
                    this.loading.dismiss(); //tira o carregando...
                }
                else if (config.conversaSerBuscado === true) {  //verifica se o user busca por conversas
                    //console.log("Busca por conversas!");
                    //DIRECIONAR A PAGINA CONFORME O TIPO
                            if(config.bar === true) {
                                let usersConversa = [];
                                this.conversaConfig.buscaConversaBar() 
                                    .subscribe(conversas => {
                                        conversas.forEach(conversa => {
                                            if(conversa.conversaSerBuscado === true){
                                                this.userService.getUser(conversa.key)
                                                    .subscribe((user: User) => {
                                                        //console.log("User para bar: "+user.name);
                                                        usersConversa.push(user);
                                                        this.getOneUser2(user);
                                                        this.flerts = false;
                                                        this.new_match = false;
                                                    })}
                                        });
                                    })
                            }
                            else{
                                this.acabouUserAmizade = true;
                            }
                            if(config.cafe === true) {
                                let usersConversa = [];
                                this.conversaConfig.buscaConversaCafe() 
                                    .subscribe(conversas => {
                                        conversas.forEach(conversa => {
                                            if(conversa.conversaSerBuscado === true){
                                                this.userService.getUser(conversa.key)
                                                    .subscribe((user: User) => {
                                                        //console.log("User para bar: "+user.name);
                                                        usersConversa.push(user);
                                                        this.getOneUser2(user);
                                                        this.flerts = false;
                                                        this.new_match = false;
                                                    })}
                                        });
                                    })
                            }
                            else{
                                this.acabouUserAmizade = true;
                            }
                            if(config.arlivre === true) {
                                let usersConversa = [];
                                this.conversaConfig.buscaConversaArlivre() 
                                    .subscribe(conversas => {
                                        conversas.forEach(conversa => {
                                            if(conversa.conversaSerBuscado === true){
                                                this.userService.getUser(conversa.key)
                                                    .subscribe((user: User) => {
                                                        //console.log("User para bar: "+user.name);
                                                        usersConversa.push(user);
                                                        this.getOneUser2(user);
                                                        this.flerts = false;
                                                        this.new_match = false;
                                                    })}
                                        });
                                    })
                            }
                            else{
                                this.acabouUserAmizade = true;
                            }
                            if(config.cinema === true) {
                                let usersConversa = [];
                                this.conversaConfig.buscaConversaCinema() 
                                    .subscribe(conversas => {
                                        conversas.forEach(conversa => {
                                            if(conversa.conversaSerBuscado === true){
                                                this.userService.getUser(conversa.key)
                                                    .subscribe((user: User) => {
                                                        //console.log("User para bar: "+user.name);
                                                        usersConversa.push(user);
                                                        this.getOneUser2(user);
                                                        this.flerts = false;
                                                        this.new_match = false;
                                                    })}
                                        });
                                    })
                            }
                            else{
                                this.acabouUserAmizade = true;
                            }
                            if(config.leitura === true) {
                                let usersConversa = [];
                                this.conversaConfig.buscaConversaLeitura() 
                                    .subscribe(conversas => {
                                        conversas.forEach(conversa => {
                                            if(conversa.conversaSerBuscado === true){
                                                this.userService.getUser(conversa.key)
                                                    .subscribe((user: User) => {
                                                        //console.log("User para bar: "+user.name);
                                                        usersConversa.push(user);
                                                        this.getOneUser2(user);
                                                        this.flerts = false;
                                                        this.new_match = false;
                                                    })}
                                        });
                                    })
                            }
                            else{
                                this.acabouUserAmizade = true;
                            }
                            if(config.restaurante === true) {
                                let usersConversa = [];
                                this.conversaConfig.buscaConversaRestaurante() 
                                    .subscribe(conversas => {
                                        conversas.forEach(conversa => {
                                            if(conversa.conversaSerBuscado === true){
                                                this.userService.getUser(conversa.key)
                                                    .subscribe((user: User) => {
                                                        //console.log("User para bar: "+user.name);
                                                        usersConversa.push(user);
                                                        this.getOneUser2(user);
                                                        this.flerts = false;
                                                        this.new_match = false;
                                                    })}
                                        });
                                    })
                            }
                            else{
                                this.acabouUserAmizade = true;
                            }

                }
            })
    }
    //BUSCA CONFIG INICIAL PARA GRUPO
    public getHomeRole() {
        this.roleConfig
            .buscaRoleConfigMostrar()  //recebe dados sobre o nÃ³ role
            .first()
            .subscribe((config: RoleConfig) => {
                if (config.roleSerBuscado === true) {  //verifica se o user busca por role
                            if(config.balada === true) {
                                console.log("GRUPO: ")
                                let gruposConversa = [];
                                this.roleConfig.buscaGrupo('balada') 
                                    .subscribe(grupos => {
                                        grupos.forEach(grupo => {
                                                gruposConversa.push(grupo);
                                                this.getOneUserRole(grupo);
                                                this.flerts = false;
                                                this.new_match = false;
                                            })
                                        });
                            }
                            else{
                                this.acabouGrupo = true;
                            }
                            if(config.show === true) {
                                let gruposConversa = [];
                                this.roleConfig.buscaGrupo('show') 
                                    .subscribe(grupos => {
                                        grupos.forEach(grupo => {
                                                gruposConversa.push(grupo);
                                                this.getOneUserRole(grupo);
                                                this.flerts = false;
                                                this.new_match = false;
                                            })
                                        });                                 
                            }
                            else{
                                this.acabouGrupo = true;
                            }
                            if(config.beber === true) {
                                let gruposConversa = [];
                                this.roleConfig.buscaGrupo('beber') 
                                    .subscribe(grupos => {
                                        grupos.forEach(grupo => {
                                                gruposConversa.push(grupo);
                                                this.getOneUserRole(grupo);
                                                this.flerts = false;
                                                this.new_match = false;
                                            })
                                        });
                                    
                            }
                            else{
                                this.acabouGrupo = true;
                            }
                            if(config.comer === true) {
                                let gruposConversa = [];
                                this.roleConfig.buscaGrupo('comer') 
                                    .subscribe(grupos => {
                                        grupos.forEach(grupo => {
                                                gruposConversa.push(grupo);
                                                this.getOneUserRole(grupo);
                                                this.flerts = false;
                                                this.new_match = false;
                                            })
                                        });
                            }
                            else{
                                this.acabouGrupo = true;
                            }
                            if(config.academia === true) {
                                let gruposConversa = [];
                                this.roleConfig.buscaGrupo('academia') 
                                    .subscribe(grupos => {
                                        grupos.forEach(grupo => {
                                                gruposConversa.push(grupo);
                                                this.getOneUserRole(grupo);
                                                this.flerts = false;
                                                this.new_match = false;
                                            })
                                        });
                            }
                            else{
                                this.acabouGrupo = true;
                            }
                            if(config.esporte === true) {
                                let gruposConversa = [];
                                this.roleConfig.buscaGrupo('esporte') 
                                    .subscribe(grupos => {
                                        grupos.forEach(grupo => {
                                                gruposConversa.push(grupo);
                                                this.getOneUserRole(grupo);
                                                this.flerts = false;
                                                this.new_match = false;
                                            })
                                        });
                            }
                            else{
                                this.acabouGrupo = true;
                            }
                }
            })
    }

    //CHAMA PAGE CHAT
    private Chat(): void {
        this.navCtrl.push(ChatListPage);
    }

    //BUSCA LIKES
    public getLikes() {
        this.matchService.getTotalVotos()
            .subscribe(action => {
                this.like = action.like;
            });
    }

    //BUSCA VIEWS
    public getViews() {
        this.matchService.getTotalViews()
            .subscribe(action => {
                this.view = action.view;
            });
    }


    //BUSCA USERS
    /* 
    Aqui foi feito uma matriz para percorer os chatsecretos e usuarios
    primeiro busca o usuario e verifica se tem o id dele no array de chatsecretos
    se tiver coloca verifica como false, para nao add no array que vai pra view
    */
   private getOneUser() {
    let verifica: boolean = true;
    let achokey: any;
    this.grupoRole = false;
    this.configService.buscaConfig()
        .subscribe((config: Config) => {
            this.userService.filtro2(config)
                .subscribe(users => {
                    this.matchService.getSecretsIds(this.authService.getUid())
                        .subscribe(secretas => {
                            users.forEach(user => {
                                
                                if (users.length == 0) {
                                    this.user = null;
                                } else {
                                    
                                    secretas.forEach(secreta => {
                                        if (secreta.key === user.key) {
                                            verifica = false;
                                        }
                                    });
                                    if (verifica  && user.idade >= config.faixaInicio && user.idade <= config.faixaFim) {
                                        achokey = user.key;
                                    }
                                    verifica = true;
                                }
                            });
                            if (achokey) {
                                this.acabou = false;
                                this.userService.getUser(achokey)
                                    .first()
                                    .subscribe((user: User) => {
                                        this.user = user; //atribuir valores              
                                    });
                            } else {
                                this.acabou = true;
                            }
                        });
                });
        });
}

    private getOneUser2(user: User) {
        let verifica: boolean = true;
        let achokey: any;
        this.grupoRole = false;
                this.matchService.getVotos(this.authService.getUid())
                .subscribe(votos => {
                        if (!user) { 
                            this.user = null;
                        } 
                        else {
                            votos.forEach(voto => {
                                if (voto.key === user.key) {
                                    verifica = false;
                                }
                            });
                            if (verifica) {
                                achokey = user.key;
                                this.user = user;
                                this.acabouUserAmizade = false;
                                //console.log("->" + achokey);
                            }
                            verifica = true;
                        }
                    });
                    if (achokey) {                      
                        this.acabouUserAmizade = false;
                        //this.user = user; //atribuir valores
                    } else {
                        this.acabouUserAmizade = true;
                    }
    }

    private getOneUserRole(grupo: Groups) {
        let verifica: boolean = true;
        let achokey: any;
        this.grupoRole = true;
        this.groupsService.getMembros(this.authService.getUid())
        .subscribe(grupos => {  
            grupos.forEach(grupo2 => { 
                if(grupo2.key === grupo.key) {
                    verifica = false;
                }
            });  
            if(verifica) {
                    achokey = grupo.key;
                    this.grupo = grupo;
                    this.acabouGrupo = false;
            }
            verifica = true;           
        });
        if (achokey) {                      
            this.acabouGrupo = false;
            this.grupo = grupo; //atribuir valores
        } else {
            this.acabouGrupo = true;
        }   
    }

    //CRIAÃ‡AÃ• DO CHAT ENTRE USUARIOS TEMPORÃ�RIO 24 HORAS
    public openChaSecret(like: boolean,recipientUser: User): void {

        //this.matchService.createFlertLikes(recipientUser.key, this.authService.getUid(), false, false);
        this.userService.currentUser//PEGA USUARIO LOGADO
            .first()
            .subscribe((currentUser: User) => {
                this.chatSecretService.votoSecret(like, recipientUser.$key, currentUser.$key);
                this.chatSecretService.getDeepChatsecret(currentUser.$key, recipientUser.$key)  // caminho /users/id1/id2
                    .first()
                    .subscribe((chat: Chatsecret) => {
                        if(like === true){
                            //o objeto chat tem um propriedade(chat)valida?
                            if (chat.hasOwnProperty('$value')) {
                                let timestamp: Object = firebase.database.ServerValue.TIMESTAMP;//pega time temp do firebase""
                                let chat1 = new Chatsecret(timestamp, '', timestamp, recipientUser.name, (recipientUser.photo || ''), 'false');
                                this.chatSecretService.create(chat1, currentUser.$key, recipientUser.$key);
                                let chat2 = new Chatsecret(timestamp, '', timestamp, currentUser.name, (currentUser.photo || ''), 'false');
                                this.chatSecretService.create(chat2, recipientUser.$key, currentUser.$key);
                            }
                        }
                    });
            });
            if(like === true){
                this.navCtrl.push(ChatSecretoPage, {
                    recipientUser: recipientUser
                });
            }
    }   

    // VOTO AMIZADE
    public voteUp(like: boolean, user: User) {
        this.card.pop();
        this.getOneUser2(user)
        //this.matchService.removeUser(user.$key);
        this.userService.currentUser//PEGA USUARIO LOGADO
            .first()
            .subscribe((c: User) => {
                if (like) {
                    this.userLogado = c;
                    this.userMatch = user;
                    this.presentToast(true);
                    let timestamp: Object = firebase.database.ServerValue.TIMESTAMP;//pega time temp do firebase
                    let user1 = new Flert(user.key, timestamp, user.name, (user.photo || ''));
                    this.matchService.createFlertLikes(user1.key, c.key, true, true);
                    
                    this.matchService.buscarVotoUserEspecifico(this.userMatch.key)
                    .subscribe((votoMatchAmizade: Voto) => {
                        if(votoMatchAmizade.voto === true){
                           this.new_match = true;
                           let timestamp: Object = firebase.database.ServerValue.TIMESTAMP;//pega time temp do firebase
                           let chat1 = new Chat('', timestamp, this.userMatch.name, (this.userMatch.photo || ''));
                           this.chatService.create(chat1, this.userLogado.$key, this.userMatch.$key);
                           let chat2 = new Chat('', timestamp, this.userLogado.name, (this.userLogado.photo || ''));
                           this.chatService.create(chat2, this.userMatch.$key, this.userLogado.$key);
                        }
                      }
                      )        
                    } else if (!like) {
                        console.log("NÃo dei like!");
                        this.presentToast(false);
                        let timestamp: Object = firebase.database.ServerValue.TIMESTAMP;//pega time temp do firebase
                        let user1 = new Flert(user.key, timestamp, user.name, (user.photo || ''));
                        this.matchService.createFlertLikes(user1.key, c.key, false, false);
                    }
            });
    }

    // VOTAÃ‡Ã‚O
    public entrarGrupo(like: boolean, grupo: Groups) {
        this.card.pop();
        this.getOneUserRole(grupo);
        this.userService.currentUser//PEGA USUARIO LOGADO
            .first()
            .subscribe((c: User) => {
                if (like) {
                    this.userLogado = c;
                    this.presentToast(true);  
                    let timestamp: Object = firebase.database.ServerValue.TIMESTAMP;//pega time temp do firebase
                    this.groupsService.entrarGrupo2(c, grupo, like, timestamp);
                } else if (!like) {
                    this.presentToast(false);
                    let timestamp: Object = firebase.database.ServerValue.TIMESTAMP;//pega time temp do firebase
                    this.groupsService.entrarGrupo2(c, grupo, like, timestamp);
                }
            });
    }

    public newMatchFalse(){
        this.new_match = false;
    }
    presentToast(tipo: boolean) {
        if (tipo) {
            let toast = this.toastCtrl.create({
                message: 'LIKE',
                duration: 3000,
                position: 'top'
            });
            toast.present();
        }
        else {
            let toast = this.toastCtrl.create({
                message: 'DESLIKE',
                duration: 3000,
                position: 'top'
            });
            toast.present();    
        }
    }

    //MOSTRA MENSAGEM DE AGUARDE...
    private showLoading(): Loading {
        let loading: Loading = this.loadingCtrl.create({
            content: 'Aguarde...'
        });
        //mostra carregamento pagina
        loading.present();
        return loading;
    }

    public esconderPerfil(esconder_perfil: boolean, user: User, userLogado: User){
        console.log("Esconder perfil? "+esconder_perfil +" para o "+user.name);
        console.log("Eu sou: "+userLogado.name);
       // this.matchService.esconderPerfil(esconder_perfil, user, userLogado);
    }
}